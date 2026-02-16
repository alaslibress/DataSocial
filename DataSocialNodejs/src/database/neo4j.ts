import neo4j, { Driver } from 'neo4j-driver';
import { config } from '../config/config';


let driver: Driver; //Driver oficial de neo4j para conexión con bbdd

//FUnción para conectar con neo4j
export async function connectToNeo4j(): Promise<Driver> {
  try {
    driver = neo4j.driver(
      config.neo4j.uri,
      neo4j.auth.basic(config.neo4j.user, config.neo4j.password)
    );

    await driver.verifyConnectivity();
    console.log('Conectado a Neo4j');

    return driver;
  } catch (error) {
    console.error('Error al conectar a Neo4j:', error);
    throw error;
  }
}

//Obtener driver para los services
export function getDriver(): Driver {
  if (!driver) {
    throw new Error('Neo4j no está conectado. Llama a connectToNeo4j() primero.');
  }
  return driver;
}

//Cierra recursos
export async function closeNeo4j(): Promise<void> {
  if (driver) {
    await driver.close();
    console.log('Conexion a Neo4j cerrada');
  }
}
