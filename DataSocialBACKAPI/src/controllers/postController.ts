import { Request, Response } from 'express';
import {
  crearPost,
  obtenerTodosLosPosts,
  obtenerPostsDeUsuario,
  eliminarPost,
  obtenerUsuariosConHashtagsComunes,
} from '../services/postService';

/*
CREAR UN POST

 Endpoint: POST /api/posts

 Body: {contenido, hashtags, userId}
   -contenido: texto del post
   - hashtags: array de strings ["JuanLove", "Futbol"]
   - userId: ID del usuario que publica

 Los hashtags se crean automáticamente si no existen
 y se vinculan al post en el grafo.
*/
export async function crear(req: Request, res: Response): Promise<void> {
  try {
    const { contenido, hashtags, userId } = req.body;

    //Validación de campos obligatorios
    if (!contenido || !userId) {
      res.status(400).json({ error: 'Contenido y userId son obligatorios' });
      return;
    }

    //Validar que hashtags sea un array si se envía
    if (hashtags && !Array.isArray(hashtags)) {
      res.status(400).json({ error: 'hashtags debe ser un array de strings' });
      return;
    }

    const post = await crearPost({
      contenido,
      hashtags: hashtags || [],
      userId,
    });

    res.status(201).json(post);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear post';
    res.status(500).json({ error: mensaje });
  }
}

/*
OBTENER TODOS LOS POSTS

Endpoint: GET /api/posts
Retorna todos los posts con sus hashtags
y el nombre del autor, ordenados por fecha.
*/
export async function obtenerTodos(_req: Request, res: Response): Promise<void> {
  try {
    const posts = await obtenerTodosLosPosts();
    res.json(posts);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener posts';
    res.status(500).json({ error: mensaje });
  }
}

/*
OBTENER POSTS DE UN USUARIO

Endpoint: GET /api/posts/usuario/:userId
Retorna todos los posts de un usuario específico.
*/
export async function obtenerPorUsuario(req: Request, res: Response): Promise<void> {
  try {
    const posts = await obtenerPostsDeUsuario(req.params.userId);
    res.json(posts);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener posts del usuario';
    res.status(500).json({ error: mensaje });
  }
}

/*
ELIMINAR UN POST

Endpoint: DELETE /api/posts/:id
Elimina el post y sus relaciones con hashtags.
Los hashtags permanecen (pueden usarlos otros posts).
*/
export async function eliminar(req: Request, res: Response): Promise<void> {
  try {
    const eliminado = await eliminarPost(req.params.id);

    if (!eliminado) {
      res.status(404).json({ error: 'Post no encontrado' });
      return;
    }

    res.json({ mensaje: 'Post eliminado correctamente' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar post';
    res.status(500).json({ error: mensaje });
  }
}

/*
USUARIOS CON INTERESES SIMILARES

Endpoint: GET /api/posts/similares/:userId

Encuentra usuarios que comparten hashtags con
el usuario dado. ¡¡¡ESTO ES LA FUNCIONALIDAD PRINCIPAL PARA HACER CONEXIONES!!!.

Retorna una lista ordenada por cantidad de
hashtags en común (más similares primero).
*/
export async function obtenerSimilares(req: Request, res: Response): Promise<void> {
  try {
    const similares = await obtenerUsuariosConHashtagsComunes(req.params.userId);
    res.json(similares);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al buscar usuarios similares';
    res.status(500).json({ error: mensaje });
  }
}
