import api from './axios';
import { User, RegistroData, AfinidadResult } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post<User>('/users/login', { email, password });
  return response.data;
};

export const registro = async (datos: RegistroData): Promise<User> => {
  const response = await api.post<User>('/users/registro', datos);
  return response.data;
};

export const obtenerUsuarios = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const obtenerUsuario = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const obtenerAfinidad = async (id: string): Promise<AfinidadResult[]> => {
  const response = await api.get<AfinidadResult[]>(`/users/${id}/afinidad`);
  return response.data;
};

export const actualizarPerfil = async (
  id: string,
  datos: Partial<Omit<User, 'id' | 'email' | 'fechaCreacion'>>
): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, datos);
  return response.data;
};

export const eliminarUsuario = async (id: string): Promise<{ mensaje: string }> => {
  const response = await api.delete<{ mensaje: string }>(`/users/${id}`);
  return response.data;
};
