import React from 'react';
import { View } from 'react-native';
import { Card, Text, Badge } from 'react-native-paper';
import { AfinidadResult } from '../types';
import HashtagChips from './HashtagChips';

interface AfinidadCardProps {
  resultado: AfinidadResult;
  posicion: number;
}

const AfinidadCard: React.FC<AfinidadCardProps> = ({ resultado, posicion }) => {
  return (
    <Card style={{ marginBottom: 12, borderRadius: 12 }} elevation={2}>
      <Card.Content>
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <View
              className="items-center justify-center mr-3"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#7C3AED',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{posicion}</Text>
            </View>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {resultado.nombre} {resultado.apellidos}
            </Text>
          </View>
          <Badge size={32} style={{ backgroundColor: '#7C3AED' }}>
            {resultado.puntuacionAfinidad}
          </Badge>
        </View>

        {resultado.gustosComunes.length > 0 && (
          <View className="mb-1">
            <Text variant="bodySmall" style={{ color: '#666', marginBottom: 2 }}>
              Gustos en comun:
            </Text>
            <HashtagChips hashtags={resultado.gustosComunes} color="#2563EB" />
          </View>
        )}

        {resultado.hashtagsComunes.length > 0 && (
          <View className="mb-1">
            <Text variant="bodySmall" style={{ color: '#666', marginBottom: 2 }}>
              Hashtags en comun:
            </Text>
            <HashtagChips hashtags={resultado.hashtagsComunes} color="#16A34A" />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default AfinidadCard;
