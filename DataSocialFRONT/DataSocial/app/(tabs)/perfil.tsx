import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  Portal,
  Modal,
  TextInput,
  RadioButton,
  Snackbar,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import axios from 'axios';

const BIOGRAFIAS = [
  'Casual, me gustan los ponis',
  'Amante de la naturaleza y los viajes',
  'Me gusta la informatica, por algo me dedico a este mundillo',
  'Deportista me gusta mas que solo el futbol...',
];

export default function PerfilScreen() {
  const { user, logout, actualizarPerfil } = useAuthStore();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editApellidos, setEditApellidos] = useState('');
  const [editBiografia, setEditBiografia] = useState('');
  const [editGusto1, setEditGusto1] = useState('');
  const [editGusto2, setEditGusto2] = useState('');
  const [editGusto3, setEditGusto3] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackError, setSnackError] = useState(false);

  if (!user) return null;

  const abrirEdicion = () => {
    setEditNombre(user.nombre);
    setEditApellidos(user.apellidos);
    setEditBiografia(user.biografia);
    setEditGusto1(user.gustoPrincipal1);
    setEditGusto2(user.gustoPrincipal2);
    setEditGusto3(user.gustoPrincipal3);
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    setLoading(true);
    try {
      await actualizarPerfil({
        nombre: editNombre.trim(),
        apellidos: editApellidos.trim(),
        biografia: editBiografia,
        gustoPrincipal1: editGusto1.trim(),
        gustoPrincipal2: editGusto2.trim(),
        gustoPrincipal3: editGusto3.trim(),
      });
      setModalVisible(false);
      setSnackError(false);
      setSnackMessage('Perfil actualizado correctamente');
      setSnackVisible(true);
    } catch (err) {
      setSnackError(true);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setSnackMessage(err.response.data?.error || 'Error al actualizar el perfil');
        } else {
          setSnackMessage('Error de conexion con el servidor');
        }
      } else {
        setSnackMessage('Ha ocurrido un error inesperado');
      }
      setSnackVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const sexoLabel: Record<string, string> = {
    masculino: 'Masculino',
    femenino: 'Femenino',
    otro: 'Otro',
    prefiero_no_decir: 'Prefiero no decir',
  };

  const fechaFormateada = new Date(user.fechaCreacion).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F5F5' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ borderRadius: 12, marginBottom: 16 }} elevation={2}>
          <Card.Content>
            <View className="items-center mb-4">
              <View
                className="items-center justify-center mb-3"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#7C3AED',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
                  {user.nombre.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                {user.nombre} {user.apellidos}
              </Text>
              <Text variant="bodyMedium" style={{ color: '#666', marginTop: 2 }}>
                {user.email}
              </Text>
            </View>

            <View
              className="py-3 mb-3"
              style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB' }}
            >
              <Text variant="bodySmall" style={{ color: '#999', marginBottom: 2 }}>
                Sexo
              </Text>
              <Text variant="bodyMedium">{sexoLabel[user.sexo] || user.sexo}</Text>
            </View>

            <View className="mb-3">
              <Text variant="bodySmall" style={{ color: '#999', marginBottom: 2 }}>
                Biografia
              </Text>
              <Text variant="bodyMedium">{user.biografia}</Text>
            </View>

            <View className="mb-3">
              <Text variant="bodySmall" style={{ color: '#999', marginBottom: 6 }}>
                Gustos Principales
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Chip
                  style={{ backgroundColor: '#EDE9FE' }}
                  textStyle={{ color: '#7C3AED' }}
                >
                  {user.gustoPrincipal1}
                </Chip>
                <Chip
                  style={{ backgroundColor: '#EDE9FE' }}
                  textStyle={{ color: '#7C3AED' }}
                >
                  {user.gustoPrincipal2}
                </Chip>
                <Chip
                  style={{ backgroundColor: '#EDE9FE' }}
                  textStyle={{ color: '#7C3AED' }}
                >
                  {user.gustoPrincipal3}
                </Chip>
              </View>
            </View>

            <View>
              <Text variant="bodySmall" style={{ color: '#999', marginBottom: 2 }}>
                Miembro desde
              </Text>
              <Text variant="bodyMedium">{fechaFormateada}</Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={abrirEdicion}
          style={{ marginBottom: 12, borderRadius: 8 }}
          buttonColor="#7C3AED"
          icon="pencil"
        >
          Editar Perfil
        </Button>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={{ borderRadius: 8, borderColor: '#DC2626' }}
          textColor="#DC2626"
          icon="logout"
        >
          Cerrar Sesion
        </Button>
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: '#fff',
            margin: 20,
            padding: 20,
            borderRadius: 12,
            maxHeight: '85%',
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 16, color: '#7C3AED' }}>
              Editar Perfil
            </Text>

            <TextInput
              label="Nombre"
              value={editNombre}
              onChangeText={setEditNombre}
              mode="outlined"
              style={{ marginBottom: 12, backgroundColor: '#fff' }}
              outlineColor="#DDD6FE"
              activeOutlineColor="#7C3AED"
            />

            <TextInput
              label="Apellidos"
              value={editApellidos}
              onChangeText={setEditApellidos}
              mode="outlined"
              style={{ marginBottom: 16, backgroundColor: '#fff' }}
              outlineColor="#DDD6FE"
              activeOutlineColor="#7C3AED"
            />

            <Text variant="titleSmall" style={{ marginBottom: 8, color: '#333' }}>
              Biografia
            </Text>
            <RadioButton.Group onValueChange={setEditBiografia} value={editBiografia}>
              {BIOGRAFIAS.map((bio) => (
                <RadioButton.Item
                  key={bio}
                  label={bio}
                  value={bio}
                  color="#7C3AED"
                  style={{ marginBottom: 2 }}
                  labelStyle={{ fontSize: 13 }}
                />
              ))}
            </RadioButton.Group>

            <Text variant="titleSmall" style={{ marginTop: 12, marginBottom: 8, color: '#333' }}>
              Gustos Principales
            </Text>
            <TextInput
              label="Gusto 1"
              value={editGusto1}
              onChangeText={setEditGusto1}
              mode="outlined"
              style={{ marginBottom: 12, backgroundColor: '#fff' }}
              outlineColor="#DDD6FE"
              activeOutlineColor="#7C3AED"
            />
            <TextInput
              label="Gusto 2"
              value={editGusto2}
              onChangeText={setEditGusto2}
              mode="outlined"
              style={{ marginBottom: 12, backgroundColor: '#fff' }}
              outlineColor="#DDD6FE"
              activeOutlineColor="#7C3AED"
            />
            <TextInput
              label="Gusto 3"
              value={editGusto3}
              onChangeText={setEditGusto3}
              mode="outlined"
              style={{ marginBottom: 16, backgroundColor: '#fff' }}
              outlineColor="#DDD6FE"
              activeOutlineColor="#7C3AED"
            />

            <View className="flex-row justify-end gap-2">
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={{ borderRadius: 8 }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={guardarEdicion}
                loading={loading}
                disabled={loading}
                style={{ borderRadius: 8 }}
                buttonColor="#7C3AED"
              >
                Guardar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackError ? '#DC2626' : '#16A34A' }}
      >
        {snackMessage}
      </Snackbar>
    </View>
  );
}
