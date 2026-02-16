import React, { useState } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import axios from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureText, setSecureText] = useState(true);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.error || 'Credenciales incorrectas');
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 200, height: 200, marginBottom: 16 }}
              resizeMode="contain"
            />
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#7C3AED' }}>
              DataSocial
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>
              Conecta con tus intereses
            </Text>
          </View>

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
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{ marginTop: 16, borderRadius: 8, paddingVertical: 4 }}
            buttonColor="#7C3AED"
          >
            Iniciar Sesion
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text variant="bodyMedium" style={{ color: '#666' }}>
              ¿No tienes cuenta?{' '}
            </Text>
            <Link href="/(auth)/registro" asChild>
              <Text
                variant="bodyMedium"
                style={{ color: '#7C3AED', fontWeight: 'bold' }}
                onPress={() => {}}
              >
                Registrate
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
