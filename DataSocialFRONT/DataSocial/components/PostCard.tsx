import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Post } from '../types';
import HashtagChips from './HashtagChips';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const fechaFormateada = new Date(post.fechaCreacion).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card style={{ marginBottom: 12, borderRadius: 12 }} elevation={2}>
      <Card.Content>
        {post.autor && (
          <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {post.autor}
          </Text>
        )}
        <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
          {post.contenido}
        </Text>
        {post.hashtags && post.hashtags.length > 0 && <HashtagChips hashtags={post.hashtags} />}
        <Text variant="bodySmall" style={{ color: '#888', marginTop: 8 }}>
          {fechaFormateada}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
