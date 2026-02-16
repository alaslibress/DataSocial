import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, RadioButton, HelperText, Snackbar } from 'react-native-paper';
import useAuthStore from '../../store/useAuthStore';
import { RegistroData } from '../../types';
import { Link } from 'expo-router';
import axios from 'axios';

const BIOGRAFIAS = [
  'Casual, me gustan los ponis',
  'Amante de la naturaleza y los viajes',
  'Me gusta la informatica, por algo me dedico a este mundillo',
  'Deportista me gusta mas que solo el futbol...',
];

const SEXOS: { value: RegistroData['sexo']; label: string }[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
];

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [sexo, setSexo] = useState<RegistroData['sexo']>('masculino');
  const [biografia, setBiografia] = useState(BIOGRAFIAS[0]);
  const [gustoPrincipal1, setGustoPrincipal1] = useState('');
  const [gustoPrincipal2, setGustoPrincipal2] = useState('');
  const [gustoPrincipal3, setGustoPrincipal3] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureText, setSecureText] = useState(true);

  const registro = useAuthStore((state) => state.registro);

  const handleRegistro = async () => {
    setError('');

    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !gustoPrincipal1.trim() ||
      !gustoPrincipal2.trim() ||
      !gustoPrincipal3.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await registro({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        sexo,
        biografia,
        gustoPrincipal1: gustoPrincipal1.trim(),
        gustoPrincipal2: gustoPrincipal2.trim(),
        gustoPrincipal3: gustoPrincipal3.trim(),
        email: email.trim(),
        password,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.error || 'Error al crear la cuenta');
        } else {
          setError('Error de conexion con el servidor');
        }
      } else {
        setError('Ha ocurrido un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <ScrollView
        contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          variant="headlineMedium"
          style={{ fontWeight: 'bold', color: '#7C3AED', textAlign: 'center', marginBottom: 24 }}
        >
          Crear Cuenta
        </Text>

        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={{ marginBottom: 12, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />

        <TextInput
          label="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
          mode="outlined"
          left={<TextInput.Icon icon="account-outline" />}
          style={{ marginBottom: 16, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />

        <Text variant="titleSmall" style={{ marginBottom: 8, color: '#333' }}>
          Sexo
        </Text>
        <RadioButton.Group onValueChange={(value) => setSexo(value as RegistroData['sexo'])} value={sexo}>
          {SEXOS.map((s) => (
            <RadioButton.Item
              key={s.value}
              label={s.label}
              value={s.value}
              color="#7C3AED"
              style={{ backgroundColor: '#fff', marginBottom: 2, borderRadius: 8 }}
            />
          ))}
        </RadioButton.Group>

        <Text variant="titleSmall" style={{ marginTop: 16, marginBottom: 8, color: '#333' }}>
          Biografia
        </Text>
        <RadioButton.Group onValueChange={setBiografia} value={biografia}>
          {BIOGRAFIAS.map((bio) => (
            <RadioButton.Item
              key={bio}
              label={bio}
              value={bio}
              color="#7C3AED"
              style={{ backgroundColor: '#fff', marginBottom: 2, borderRadius: 8 }}
              labelStyle={{ fontSize: 13 }}
            />
          ))}
        </RadioButton.Group>

        <Text variant="titleSmall" style={{ marginTop: 16, marginBottom: 8, color: '#333' }}>
          Gustos Principales
        </Text>
        <TextInput
          label="Gusto Principal 1"
          value={gustoPrincipal1}
          onChangeText={setGustoPrincipal1}
          mode="outlined"
          placeholder="Ej: futbol"
          left={<TextInput.Icon icon="heart" />}
          style={{ marginBottom: 12, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />
        <TextInput
          label="Gusto Principal 2"
          value={gustoPrincipal2}
          onChangeText={setGustoPrincipal2}
          mode="outlined"
          placeholder="Ej: viajes"
          left={<TextInput.Icon icon="heart" />}
          style={{ marginBottom: 12, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />
        <TextInput
          label="Gusto Principal 3"
          value={gustoPrincipal3}
          onChangeText={setGustoPrincipal3}
          mode="outlined"
          placeholder="Ej: musica"
          left={<TextInput.Icon icon="heart" />}
          style={{ marginBottom: 16, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: 12, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secureText}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={secureText ? 'eye-off' : 'eye'}
              onPress={() => setSecureText(!secureText)}
            />
          }
          style={{ marginBottom: 4, backgroundColor: '#fff' }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />

        {error !== '' && (
          <HelperText type="error" visible>
            {error}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleRegistro}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 16, borderRadius: 8, paddingVertical: 4 }}
          buttonColor="#7C3AED"
        >
          Crear Cuenta
        </Button>

        <View className="flex-row justify-center mt-6 mb-4">
          <Text variant="bodyMedium" style={{ color: '#666' }}>
            ¿Ya tienes cuenta?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Text
              variant="bodyMedium"
              style={{ color: '#7C3AED', fontWeight: 'bold' }}
              onPress={() => {}}
            >
              Inicia Sesion
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
