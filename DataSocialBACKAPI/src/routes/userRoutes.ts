import { Router } from 'express';
import {
  registrar,
  login,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
  obtenerAfinidad,
} from '../controllers/userController';

/*
RUTAS DE USUARIOS

Aquí se definen todas las rutas (endpoints)
relacionadas con usuarios. Cada ruta apunta
a una función del controlador.

*/
const router = Router();

//POST /api/users/registro  -> Crear cuenta nueva
router.post('/registro', registrar);

//POST /api/users/login -> Iniciar sesión
router.post('/login', login);

//GET  /api/users -> Listar todos los usuarios
router.get('/', obtenerTodos);

//GET  /api/users/:id/afinidad -> Ranking de afinidad combinado
router.get('/:id/afinidad', obtenerAfinidad);

//GET  /api/users/:id -> Obtener un usuario por ID
router.get('/:id', obtenerPorId);

//PUT  /api/users/:id -> Actualizar un usuario
router.put('/:id', actualizar);

//DELETE /api/users/:id -> Eliminar un usuario
router.delete('/:id', eliminar);

export default router;
