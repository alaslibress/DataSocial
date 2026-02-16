//Publicación (Puede tener algún hastag en el contenido)
export interface Post {
  id: string;                  //ID único generado automáticamente
  contenido: string;           //Texto de la publicación
  fechaCreacion: string;       //Fecha de creación automática
}

//INterfaz que crea un post con el contenido necesario
export interface CreatePostInput {
  contenido: string;           //Texto del post
  hashtags: string[];          //Ej: ["tecnologia", "programacion", "neo4j"]
  userId: string;              //ID del usuario que publica
}
