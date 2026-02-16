import api from './axios';
import { Post } from '../types';

export const crearPost = async (
  contenido: string,
  hashtags: string[],
  userId: string
): Promise<Post> => {
  const response = await api.post<Post>('/posts', { contenido, hashtags, userId });
  return response.data;
};

export const obtenerPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('/posts');
  return response.data;
};

export const obtenerPostsUsuario = async (userId: string): Promise<Post[]> => {
  const response = await api.get<Post[]>(`/posts/usuario/${userId}`);
  return response.data;
};

export const eliminarPost = async (id: string): Promise<{ mensaje: string }> => {
  const response = await api.delete<{ mensaje: string }>(`/posts/${id}`);
  return response.data;
};
