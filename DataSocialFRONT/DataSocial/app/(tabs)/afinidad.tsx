import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import { AfinidadResult } from '../../types';
import { obtenerAfinidad } from '../../api/userApi';
import AfinidadCard from '../../components/AfinidadCard';

export default function AfinidadScreen() {
  const [resultados, setResultados] = useState<AfinidadResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((state) => state.user);

  const cargarAfinidad = async () => {
    if (!user) return;
    try {
      const data = await obtenerAfinidad(user.id);
      setResultados(data);
    } catch {
      setResultados([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      cargarAfinidad();
    }, [user?.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarAfinidad();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F5F5' }}>
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <AfinidadCard resultado={item} posicion={index + 1} />}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text variant="bodyLarge" style={{ color: '#999' }}>
              No se encontraron usuarios afines
            </Text>
          </View>
        }
      />
    </View>
  );
}
