
//Listado de biografías predeterminadas (Para añadir una, añadir una línea más)
export const BIOGRAFIAS_DISPONIBLES = [
  'Casual, me gustan los ponis',
  'Amante de la naturaleza y los viajes',
  'Me gusta la informática, por algo me dedico a este mundillo',
  'Deportista me gusta más que solo el futbol...',
] as const;


//Sexo
export type Sexo = 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';

/*
INTERFACE DEL USUARIO (completo)

 Esta es la estructura de un usuario TAL COMO
 se guarda en Neo4j. Incluye todos los campos.
 El password se almacena encriptado con bcrypt.
*/
export interface User {
  id: string;                  //ID único generado automáticamente
  nombre: string;              //Nombre del usuario
  apellidos: string;           //Apellidos del usuario
  sexo: Sexo;                  //Sexo del usuario
  biografia: string;           //Una de las biografías predeterminadas
  gustoPrincipal1: string;     //Primera cosa que le gusta
  gustoPrincipal2: string;     //Segunda cosa que le gusta
  gustoPrincipal3: string;     //Tercera cosa que le gusta
  email: string;               //Correo electrónico (único)
  password: string;            //Contraseña encriptada con bcrypt
  fechaCreacion: string;       //Fecha de creación automática
}

/*
INTERFACE PARA CREAR USUARIO

Cuando creamos un usuario nuevo, NO enviamos
el id ni la fecha (se generan automáticamente).
La contraseña se recibe en texto plano y se
 encripta antes de guardarla en Neo4j.
*/
export interface CreateUserInput{
  nombre: string;
  apellidos: string;
  sexo: Sexo;
  biografia: string;           //Debe ser una de BIOGRAFIAS_DISPONIBLES
  gustoPrincipal1: string;
  gustoPrincipal2: string;
  gustoPrincipal3: string;
  email: string;
  password: string;            //Se recibe sin encriptar
}

//INTERFACE PARA LOGIN
export interface LoginInput{
  email: string;
  password: string;
}
