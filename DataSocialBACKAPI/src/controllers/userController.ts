import { Request, Response } from 'express';
import {
  crearUsuario,
  loginUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRankingAfinidad,
} from '../services/userService';
import { BIOGRAFIAS_DISPONIBLES } from '../types/User';

/*
REGISTRAR UN USUARIO NUEVO

Endpoint: POST /api/users/registro
Body esperado: { nombre, apellidos, sexo,
biografia, gustoPrincipal1, gustoPrincipal2,
gustoPrincipal3, email, password }

Valida que la biografía sea una de las 4
disponibles antes de crear el usuario.

Todos estos son los campos que tendrá un usuario y por el que
compararemos con otros usuarios para ver sus afinidades
*/
export async function registrar(req: Request, res: Response): Promise<void> {
  try {
    const datos = req.body;

    //Validación para comprobar que todos los campos existan
    if (!datos.nombre || !datos.apellidos || !datos.sexo ||
        !datos.biografia || !datos.gustoPrincipal1 ||
        !datos.gustoPrincipal2 || !datos.gustoPrincipal3 ||
        !datos.email || !datos.password) {
      res.status(400).json({ error: 'Todos los campos son obligatorios' });
      return;
    }

    //Valida que el sexo sea uno de los valores permitidos
    const sexosValidos = ['masculino', 'femenino', 'otro', 'prefiero_no_decir'];
    if (!sexosValidos.includes(datos.sexo)) {
      res.status(400).json({
        error: 'Sexo no valido',
        sexosValidos,
      });
      return;
    }

    //Valida que la biografía cumpla con los requisitos
    if (!BIOGRAFIAS_DISPONIBLES.includes(datos.biografia as typeof BIOGRAFIAS_DISPONIBLES[number])) {
      res.status(400).json({
        error: 'Biografia no valida',
        biografiasDisponibles: BIOGRAFIAS_DISPONIBLES,
      });
      return;
    }

    const usuario = await crearUsuario(datos); //Creamos usuario
    res.status(201).json(usuario);
  } catch (error) {
    // Si el error es por email duplicado, informamos
    const mensaje = error instanceof Error ? error.message : 'Error al crear usuario';
    res.status(500).json({ error: mensaje });
  }
}

/*
LOGIN DE USUARIO

Endpoint: POST /api/users/login
Body esperado: { email, password }
Retorna el usuario si las credenciales son correctas,
o un error 401 si son incorrectas.
*/
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } =req.body;

    if (!email || !password) {
      res.status(400).json({error:'Email y password son obligatorios' });
      return;
    }

    const usuario = await loginUsuario({ email, password });

    if (!usuario) {
      res.status(401).json({error: 'Email o contraseña incorrectos' });
      return;
    }

    res.json(usuario);
  } catch (error) {
    const mensaje= error instanceof Error ? error.message : 'Error en login';
    res.status(500).json({error: mensaje});
  }
}

/*
OBTENER TODOS LOS USUARIOS

Endpoint: GET /api/users
Retorna la lista de todos los usuarios
(sin contraseñas).
*/
export async function obtenerTodos(_req: Request, res: Response): Promise<void> {
  try {
    const usuarios = await obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener usuarios';
    res.status(500).json({ error: mensaje });
  }
}

/*
OBTENER UN USUARIO POR ID

Endpoint: GET /api/users/:id
El :id se obtiene de la URL (req.params.id)
*/
export async function obtenerPorId(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener usuario';
    res.status(500).json({ error: mensaje });
  }
}

/*
ACTUALIZAR UN USUARIO

Endpoint: PUT /api/users/:id
Body: campos a actualizar (parcial)
No permite actualizar el password aquí.
*/
export async function actualizar(req: Request, res: Response): Promise<void> {
  try {
    const usuario =await actualizarUsuario(req.params.id, req.body);

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (error){
    const mensaje =error instanceof Error ? error.message : 'Error al actualizar usuario';
    res.status(500).json({ error: mensaje });
  }
}

/*
ELIMINAR UN USUARIO

Endpoint: DELETE /api/users/:id
Elimina el usuario y todas sus relaciones
(posts, conexiones con hashtags, etc.)
*/
export async function eliminar(req: Request, res: Response): Promise<void> {
  try {
    const eliminado = await eliminarUsuario(req.params.id);

    if (!eliminado) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar usuario';
    res.status(500).json({ error: mensaje });
  }
}

/*
RANKING DE AFINIDAD

Endpoint: GET /api/users/:id/afinidad
Devuelve un ranking de usuarios ordenado por afinidad
combinando gustos principales y hashtags en común.
*/
export async function obtenerAfinidad(req: Request, res: Response): Promise<void> {
  try {
    const ranking = await obtenerRankingAfinidad(req.params.id);
    res.json(ranking);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener ranking de afinidad';
    res.status(500).json({ error: mensaje });
  }
}
