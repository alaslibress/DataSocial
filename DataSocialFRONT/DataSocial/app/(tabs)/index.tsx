import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { Post } from '../../types';
import { obtenerPosts } from '../../api/postApi';
import PostCard from '../../components/PostCard';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarPosts = async () => {
    try {
      const data = await obtenerPosts();
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      cargarPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarPosts();
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
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text variant="bodyLarge" style={{ color: '#999' }}>
              No hay publicaciones todavia
            </Text>
          </View>
        }
      />
    </View>
  );
}
