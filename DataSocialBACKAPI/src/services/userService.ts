import bcrypt from 'bcrypt';
import neo4j, { Integer } from 'neo4j-driver';
import { getDriver } from '../database/neo4j';
import { User, CreateUserInput, LoginInput } from '../types/User';

// Convierte un valor Neo4j Integer a número JS de forma segura
function toNumber(value: unknown): number {
  if (neo4j.isInt(value)) return (value as Integer).toNumber();
  return value as number;
}

/*
CONFIGURACIÓN DE BCRYPT

 SALT_ROUNDS define la complejidad de la encriptación.
*/
const SALT_ROUNDS = 10;

/*
CREAR UN NUEVO USUARIO

 1. Encripta la contraseña con bcrypt
 2. Crea un nodo :User en Neo4j con randomUUID()
 3. Retorna el usuario creado (sin contraseña)

 Cypher: CREATE (u:User {...}) RETURN u
*/
export async function crearUsuario(datos: CreateUserInput): Promise<Omit<User, 'password'>> {
  const session = getDriver().session();

  try {
    //Normalizar campos a minúsculas
    const email = datos.email.toLowerCase();
    const gustoPrincipal1 = datos.gustoPrincipal1.toLowerCase();
    const gustoPrincipal2 = datos.gustoPrincipal2.toLowerCase();
    const gustoPrincipal3 = datos.gustoPrincipal3.toLowerCase();

    //Comprobar si ya existe un usuario con ese email
    const existente = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (existente.records.length > 0) {
      throw new Error('Ya existe un usuario con ese email');
    }

    //Encriptar la contraseña
    const passwordEncriptada = await bcrypt.hash(datos.password, SALT_ROUNDS);

    //Crear el nodo en Neo4j
    const resultado = await session.run(
      `
      CREATE (u:User {
        id: randomUUID(),
        nombre: $nombre,
        apellidos: $apellidos,
        sexo: $sexo,
        biografia: $biografia,
        gustoPrincipal1: $gustoPrincipal1,
        gustoPrincipal2: $gustoPrincipal2,
        gustoPrincipal3: $gustoPrincipal3,
        email: $email,
        password: $password,
        fechaCreacion: toString(datetime())
      })
      RETURN u
      `,
      {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        sexo: datos.sexo,
        biografia: datos.biografia,
        gustoPrincipal1,
        gustoPrincipal2,
        gustoPrincipal3,
        email,
        password: passwordEncriptada,
      }
    );

    //Extraer y devolver el usuario (sin password)
    if (resultado.records.length === 0) {
      throw new Error('No se pudo crear el usuario');
    }

    const usuario = resultado.records[0].get('u').properties as User;
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  } finally {
    await session.close();
  }
}

/*
LOGIN DE USUARIO

 1. Busca el usuario por email
 2. Compara la contraseña con bcrypt.compare()
 3. Retorna el usuario si las credenciales son correctas
4. Retorna null si el email o password son incorrectos

 Cypher: MATCH (u:User {email: $email}) RETURN u
*/
export async function loginUsuario(datos: LoginInput): Promise<Omit<User, 'password'> | null> {
  const session = getDriver().session();

  try {
    //Buscar usuario por email en la base de datos:
    const resultado = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email: datos.email.toLowerCase() }
    );

    //Si no existe el usuario: null
    if (resultado.records.length === 0) {
      return null;
    }

    //Comparar contraseñas con bcrypt
    const usuario = resultado.records[0].get('u').properties as User;
    const passwordCorrecta = await bcrypt.compare(datos.password, usuario.password);

    if (!passwordCorrecta) {
      return null;
    }

    //Devolver usuario sin la contraseña
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  } finally {
    await session.close();
  }
}

/*
OBTENER TODOS LOS USUARIOS

Retorna la lista completa de usuarios (sin passwords)
Cypher: MATCH (u:User) RETURN u
*/
export async function obtenerTodosLosUsuarios(): Promise<Omit<User, 'password'>[]> {
  const session = getDriver().session();

  try {
    const resultado = await session.run('MATCH (u:User) RETURN u');

    return resultado.records.map((record) => {
      const usuario = record.get('u').properties as User;
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    });
  } finally {
    await session.close();
  }
}

/*
OBTENER UN USUARIO POR ID

 Busca un usuario específico por su ID único.
 Retorna null si no se encuentra.
 Cypher: MATCH (u:User {id: $id}) RETURN u
*/
export async function obtenerUsuarioPorId(id: string): Promise<Omit<User, 'password'> | null> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      'MATCH (u:User {id: $id}) RETURN u',
      { id }
    );

    if (resultado.records.length === 0) {
      return null;
    }

    const usuario = resultado.records[0].get('u').properties as User;
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  } finally {
    await session.close();
  }
}

/*
ACTUALIZAR UN USUARIO

 Actualiza los campos del usuario por su ID.
 Solo actualiza los campos que se envían.
 NO ACTUALIZA EL PASSWORD
 Cypher: MATCH (u:User {id: $id}) SET u += $datos RETURN u
*/
export async function actualizarUsuario(
  id: string,
  datos: Partial<Omit<CreateUserInput, 'password'>>
): Promise<Omit<User, 'password'> | null> {
  const session = getDriver().session();

  try {
    //Normalizar campos a minúsculas si se envían
    const datosNormalizados = { ...datos };
    if (datosNormalizados.gustoPrincipal1) datosNormalizados.gustoPrincipal1 = datosNormalizados.gustoPrincipal1.toLowerCase();
    if (datosNormalizados.gustoPrincipal2) datosNormalizados.gustoPrincipal2 = datosNormalizados.gustoPrincipal2.toLowerCase();
    if (datosNormalizados.gustoPrincipal3) datosNormalizados.gustoPrincipal3 = datosNormalizados.gustoPrincipal3.toLowerCase();

    const resultado = await session.run(
      `
      MATCH (u:User {id: $id})
      SET u += $datos
      RETURN u
      `,
      { id, datos: datosNormalizados }
    );

    if (resultado.records.length === 0) {
      return null;
    }

    const usuario = resultado.records[0].get('u').properties as User;
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  } finally {
    await session.close();
  }
}

/*
RANKING DE AFINIDAD COMBINADO

 Combina dos métricas para calcular la afinidad entre usuarios:
 1. Gustos en común (gustoPrincipal1/2/3)
 2. Hashtags en común (a través de posts)

 Filtra usuarios con al menos 1 coincidencia (gustos O hashtags).
 Devuelve ordenado por puntuacionAfinidad DESC.

 Cypher: Compara gustos + OPTIONAL MATCH para hashtags compartidos
*/
export async function obtenerRankingAfinidad(userId: string) {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (yo:User {id: $userId})
      MATCH (otro:User)
      WHERE otro.id <> yo.id

      WITH yo, otro,
           [g IN [yo.gustoPrincipal1, yo.gustoPrincipal2, yo.gustoPrincipal3]
            WHERE g IN [otro.gustoPrincipal1, otro.gustoPrincipal2, otro.gustoPrincipal3]]
           AS gustosComunes

      OPTIONAL MATCH (yo)-[:PUBLICA]->(:Post)-[:TIENE_HASHTAG]->(h:Hashtag)<-[:TIENE_HASHTAG]-(:Post)<-[:PUBLICA]-(otro)
      WITH otro, gustosComunes,
           COLLECT(DISTINCT h.nombre) AS hashtagsComunes

      WITH otro, gustosComunes, hashtagsComunes,
           SIZE(gustosComunes) AS numGustos,
           SIZE(hashtagsComunes) AS numHashtags,
           SIZE(gustosComunes) + SIZE(hashtagsComunes) AS puntuacionAfinidad

      WHERE puntuacionAfinidad > 0

      RETURN otro.id AS id,
             otro.nombre AS nombre,
             otro.apellidos AS apellidos,
             gustosComunes,
             hashtagsComunes,
             numGustos,
             numHashtags,
             puntuacionAfinidad
      ORDER BY puntuacionAfinidad DESC
      `,
      { userId }
    );

    return resultado.records.map((record) => ({
      id: record.get('id'),
      nombre: record.get('nombre'),
      apellidos: record.get('apellidos'),
      gustosComunes: record.get('gustosComunes'),
      hashtagsComunes: record.get('hashtagsComunes'),
      numGustos: toNumber(record.get('numGustos')),
      numHashtags: toNumber(record.get('numHashtags')),
      puntuacionAfinidad: toNumber(record.get('puntuacionAfinidad')),
    }));
  } finally {
    await session.close();
  }
}

/*
ELIMINAR UN USUARIO

 Elimina un usuario y TODAS sus relaciones
 (posts, hashtags, etc.) con DETACH DELETE.
Retorna true si se eliminó, false si no existía.
 Cypher: MATCH (u:User {id: $id}) DETACH DELETE u
*/
export async function eliminarUsuario(id: string): Promise<boolean> {
  const session = getDriver().session();

  try {
    const resultado = await session.run(
      `
      MATCH (u:User {id: $id})
      DETACH DELETE u
      RETURN count(u) AS eliminados
      `,
      { id }
    );

    const eliminados = toNumber(resultado.records[0].get('eliminados'));
    return eliminados > 0;
  } finally {
    await session.close();
  }
}
