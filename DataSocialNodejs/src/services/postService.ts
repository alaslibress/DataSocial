import neo4j, { Integer } from 'neo4j-driver';
import { getDriver } from '../database/neo4j';
import { Post, CreatePostInput } from '../types/Post';

// Convierte un valor Neo4j Integer a número JS de forma segura
function toNumber(value: unknown): number {
  if (neo4j.isInt(value)) return (value as Integer).toNumber();
  return value as number;
}

/*
CREAR UN POST CON HASHTAGS

 1. Busca al usuario que publica por su ID
 2. Crea el nodo :Post con randomUUID()
 3. Crea la relación (User)-[:PUBLICA]->(Post)
 4. Para cada hashtag:
    - MERGE crea el nodo :Hashtag si no existe
      (si ya existe, lo reutiliza)
    - Crea la relación (Post)-[:TIENE_HASHTAG]->(Hashtag)

Esto es lo que conecta usuarios en el grafo:
si dos usuarios usan el mismo hashtag, están
conectados a través de él.
*/
export async function crearPost(datos: CreatePostInput): Promise<Post & { hashtags: string[] }> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (p:Post {
        id: randomUUID(),
        contenido: $contenido,
        fechaCreacion: toString(datetime())
      })
      CREATE (u)-[:PUBLICA]->(p)
      WITH p
      UNWIND $hashtags AS nombreHashtag
      MERGE (h:Hashtag {nombre: nombreHashtag})
      CREATE (p)-[:TIENE_HASHTAG]->(h)
      RETURN p, collect(nombreHashtag) AS hashtags
      `,
      {
        userId: datos.userId,
        contenido: datos.contenido,
        hashtags: datos.hashtags.map((h) => h.toLowerCase()),
      }
    );

    if (resultado.records.length === 0) {
      throw new Error('No se pudo crear el post. Verifica que el userId sea correcto.');
    }

    const post = resultado.records[0].get('p').properties as Post;
    const hashtags = resultado.records[0].get('hashtags') as string[];

    return { ...post, hashtags };
  } finally {
    await session.close();
  }
}

/*
OBTENER TODOS LOS POSTS

 Devuelve todos los posts con sus hashtags
 y el nombre del usuario que los publicó.
 Cypher: MATCH (u)-[:PUBLICA]->(p)
         OPTIONAL MATCH (p)-[:TIENE_HASHTAG]->(h)
*/
export async function obtenerTodosLosPosts(): Promise<(Post & { hashtags: string[]; autor: string })[]> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (u:User)-[:PUBLICA]->(p:Post)
      OPTIONAL MATCH (p)-[:TIENE_HASHTAG]->(h:Hashtag)
      RETURN p, collect(h.nombre) AS hashtags, u.nombre + ' ' + u.apellidos AS autor
      ORDER BY p.fechaCreacion DESC
      `
    );

    return resultado.records.map((record) => {
      const post = record.get('p').properties as Post;
      const hashtags = record.get('hashtags') as string[];
      const autor = record.get('autor') as string;
      return { ...post, hashtags, autor };
    });
  } finally {
    await session.close();
  }
}

/*
OBTENER POSTS DE UN USUARIO

 Devuelve todos los posts de un usuario específico.
Cypher: MATCH (u:User {id: $userId})-[:PUBLICA]->(p)
*/
export async function obtenerPostsDeUsuario(
  userId: string
): Promise<(Post & { hashtags: string[] })[]> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (u:User {id: $userId})-[:PUBLICA]->(p:Post)
      OPTIONAL MATCH (p)-[:TIENE_HASHTAG]->(h:Hashtag)
      RETURN p, collect(h.nombre) AS hashtags
      ORDER BY p.fechaCreacion DESC
      `,
      { userId }
    );

    return resultado.records.map((record) => {
      const post = record.get('p').properties as Post;
      const hashtags = record.get('hashtags') as string[];
      return { ...post, hashtags };
    });
  } finally {
    await session.close();
  }
}

/*
ELIMINAR UN POST

 Elimina un post y sus relaciones con hashtags.
 Los hashtags NO se eliminan (pueden estar usados
 por otros posts).
 Cypher: MATCH (p:Post {id: $id}) DETACH DELETE p
*/
export async function eliminarPost(id: string): Promise<boolean> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (p:Post {id: $id})
      DETACH DELETE p
      RETURN count(p) AS eliminados
      `,
      { id }
    );

    const eliminados = toNumber(resultado.records[0].get('eliminados'));
    return eliminados > 0;
  } finally {
    await session.close();
  }
}

/*
¡¡¡CLAVE!!!
OBTENER USUARIOS CON HASHTAGS COMUNES

Esta es la consulta clave para la red social:
 Encuentra usuarios que comparten hashtags con
 el usuario dado (tienen intereses similares).

 Retorna los usuarios ordenados por cantidad
 de hashtags en común (de más a menos).

 Cypher:
   MATCH (yo)-[:PUBLICA]->()-[:TIENE_HASHTAG]->(h)
   MATCH (Juan)-[:PUBLICA]->()-[:TIENE_HASHTAG]->(h)
   WHERE yo <> Juan
*/
export async function obtenerUsuariosConHashtagsComunes(
  userId: string
): Promise<{ id: string; nombre: string; apellidos: string; hashtagsComunes: string[]; cantidad: number }[]> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (yo:User {id: $userId})-[:PUBLICA]->(:Post)-[:TIENE_HASHTAG]->(h:Hashtag)<-[:TIENE_HASHTAG]-(:Post)<-[:PUBLICA]-(otro:User)
      WHERE yo <> otro
      RETURN otro.id AS id,
             otro.nombre AS nombre,
             otro.apellidos AS apellidos,
             collect(DISTINCT h.nombre) AS hashtagsComunes,
             count(DISTINCT h) AS cantidad
      ORDER BY cantidad DESC
      `,
      { userId }
    );

    return resultado.records.map((record) => ({
      id: record.get('id') as string,
      nombre: record.get('nombre') as string,
      apellidos: record.get('apellidos') as string,
      hashtagsComunes: record.get('hashtagsComunes') as string[],
      cantidad: toNumber(record.get('cantidad')),
    }));
  } finally {
    await session.close();
  }
}
