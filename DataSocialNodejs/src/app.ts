import express from 'express';
import { config } from './config/config';
import { connectToNeo4j, closeNeo4j } from './database/neo4j';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './middlewares/errorHandler';

//Express
const app = express();

app.use(express.json()); //Esto es un middleware para parsear rutas


//RUTA RAÍZ (información de la API)
app.get('/', (_req, res) => {
  res.json({
    nombre: 'DataSocial API',
    version: '1.0.0',
    descripcion: 'API de red social con Neo4j',
    endpoints: {
      usuarios: {
        registro: 'POST /api/users/registro',
        login: 'POST /api/users/login',
        listar: 'GET /api/users',
        obtener: 'GET /api/users/:id',
        afinidad: 'GET /api/users/:id/afinidad',
        actualizar: 'PUT /api/users/:id',
        eliminar: 'DELETE /api/users/:id',
      },
      posts: {
        crear: 'POST /api/posts',
        listar: 'GET /api/posts',
        porUsuario: 'GET /api/posts/usuario/:userId',
        similares: 'GET /api/posts/similares/:userId',
        eliminar: 'DELETE /api/posts/:id',
      },
    },
  });
});

/*
REGISTRAR RUTAS

 Conectamos las rutas con sus prefijos:
 - /api/users  -> rutas de usuarios
 - /api/posts  -> rutas de posts
*/
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

//MIDDLEWARE DE ERRORES
app.use(errorHandler);

//BLOQUE 6: ARRANCAR EL SERVIDOR
const iniciarServidor = async (): Promise<void> => {
  try {
    //Conectar a Neo4j antes de aceptar peticiones
    await connectToNeo4j();

    //Inicia el servidor HTTP
    app.listen(config.port, () =>{
      console.log(`Servidor DataSocial corriendo en http://localhost:${config.port}`);
      console.log(`Entorno: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};


//CIERRE LIMPIO DEL SERVIDOR
process.on('SIGINT', async () => {
  await closeNeo4j();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeNeo4j();
  process.exit(0);
});

//Arrancamos el servidor
iniciarServidor();
