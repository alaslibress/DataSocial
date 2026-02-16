export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  sexo: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  biografia: string;
  gustoPrincipal1: string;
  gustoPrincipal2: string;
  gustoPrincipal3: string;
  email: string;
  fechaCreacion: string;
}

export interface Post {
  id: string;
  contenido: string;
  fechaCreacion: string;
  hashtags: string[];
  autor?: string;
}

export interface AfinidadResult {
  id: string;
  nombre: string;
  apellidos: string;
  gustosComunes: string[];
  hashtagsComunes: string[];
  numGustos: number;
  numHashtags: number;
  puntuacionAfinidad: number;
}

export interface RegistroData {
  nombre: string;
  apellidos: string;
  sexo: User['sexo'];
  biografia: string;
  gustoPrincipal1: string;
  gustoPrincipal2: string;
  gustoPrincipal3: string;
  email: string;
  password: string;
}
