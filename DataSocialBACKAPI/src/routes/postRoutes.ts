import { Router } from 'express';
import {
  crear,
  obtenerTodos,
  obtenerPorUsuario,
  eliminar,
  obtenerSimilares,
} from '../controllers/postController';

/*
RUTAS DE POSTS (Publicaciones)

Aquí se definen las rutas (LOs endpoints) para publicaciones
y para buscar usuarios con intereses similares.

*/
const router = Router();

// POST   /api/posts  -> Crear un post nuevo
router.post('/', crear);

// GET    /api/posts  -> Listar todos los posts
router.get('/', obtenerTodos);

// GET    /api/posts/usuario/:userId  -> Posts de un usuario
router.get('/usuario/:userId', obtenerPorUsuario);

// GET    /api/posts/similares/:userId  -> Usuarios con hashtags comunes
router.get('/similares/:userId', obtenerSimilares);

// DELETE /api/posts/:id  -> Eliminar un post
router.delete('/:id', eliminar);

export default router;
