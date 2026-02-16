import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar, Chip } from 'react-native-paper';
import useAuthStore from '../../store/useAuthStore';
import { crearPost } from '../../api/postApi';
import axios from 'axios';

export default function CrearPostScreen() {
  const [contenido, setContenido] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackError, setSnackError] = useState(false);

  const user = useAuthStore((state) => state.user);

  const agregarHashtags = () => {
    if (!hashtagInput.trim()) return;

    const nuevos = hashtagInput
      .split(/[,\s]+/)
      .map((tag) => tag.replace(/^#/, '').trim())
      .filter((tag) => tag.length > 0 && !hashtags.includes(tag));

    setHashtags([...hashtags, ...nuevos]);
    setHashtagInput('');
  };

  const eliminarHashtag = (tag: string) => {
    setHashtags(hashtags.filter((h) => h !== tag));
  };

  const handlePublicar = async () => {
    if (!contenido.trim()) {
      setSnackError(true);
      setSnackMessage('Escribe algo para publicar');
      setSnackVisible(true);
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await crearPost(contenido.trim(), hashtags, user.id);
      setContenido('');
      setHashtags([]);
      setHashtagInput('');
      setSnackError(false);
      setSnackMessage('Publicacion creada correctamente');
      setSnackVisible(true);
    } catch (err) {
      setSnackError(true);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setSnackMessage(err.response.data?.error || 'Error al crear la publicacion');
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

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12, color: '#333' }}>
          Nueva Publicacion
        </Text>

        <TextInput
          label="¿Que estas pensando?"
          value={contenido}
          onChangeText={setContenido}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={{ marginBottom: 16, backgroundColor: '#fff', minHeight: 120 }}
          outlineColor="#DDD6FE"
          activeOutlineColor="#7C3AED"
        />

        <Text variant="titleSmall" style={{ marginBottom: 8, color: '#333' }}>
          Hashtags
        </Text>

        <View className="flex-row items-center mb-3">
          <TextInput
            label="Escribe hashtags..."
            value={hashtagInput}
            onChangeText={setHashtagInput}
            mode="outlined"
            placeholder="Ej: deporte, musica, viajes"
            style={{ flex: 1, marginRight: 8, backgroundColor: '#fff' }}
            outlineColor="#DDD6FE"
            activeOutlineColor="#7C3AED"
            onSubmitEditing={agregarHashtags}
          />
          <Button
            mode="contained"
            onPress={agregarHashtags}
            buttonColor="#7C3AED"
            compact
            style={{ borderRadius: 8 }}
          >
            Agregar
          </Button>
        </View>

        {hashtags.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-4">
            {hashtags.map((tag, index) => (
              <Chip
                key={`${tag}-${index}`}
                onClose={() => eliminarHashtag(tag)}
                style={{ backgroundColor: '#EDE9FE', marginRight: 4, marginBottom: 4 }}
                textStyle={{ color: '#7C3AED' }}
              >
                #{tag}
              </Chip>
            ))}
          </View>
        )}

        <Button
          mode="contained"
          onPress={handlePublicar}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 8, borderRadius: 8, paddingVertical: 4 }}
          buttonColor="#7C3AED"
          icon="send"
        >
          Publicar
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackError ? '#DC2626' : '#16A34A' }}
      >
        {snackMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}
