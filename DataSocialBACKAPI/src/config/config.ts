import dotenv from 'dotenv';

//Cargamos el archivo y sus variables (del .env)
dotenv.config({ path: 'config.env' });

//TIpamos las variables del archivo .env
export interface Config {
  port: number;
  nodeEnv: string;
  neo4j: {
    uri: string;
    user: string;
    password: string;
  };
}

//Objeto config que exporta y da valor a variables del tipado
export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),

  nodeEnv: process.env.NODE_ENV || 'development',

  neo4j: {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASSWORD || '',
  },

};
