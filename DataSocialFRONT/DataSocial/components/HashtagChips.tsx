import React from 'react';
import { View, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';

interface HashtagChipsProps {
  hashtags: string[];
  color?: string;
  onDelete?: (hashtag: string) => void;
}

const HashtagChips: React.FC<HashtagChipsProps> = ({ hashtags, color = '#7C3AED', onDelete }) => {
  if (!hashtags || hashtags.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row flex-wrap gap-1 py-1">
        {hashtags.map((tag, index) => (
          <Chip
            key={`${tag}-${index}`}
            style={{ backgroundColor: color + '20', marginRight: 4 }}
            textStyle={{ color, fontSize: 12 }}
            compact
            onClose={onDelete ? () => onDelete(tag) : undefined}
          >
            #{tag}
          </Chip>
        ))}
      </View>
    </ScrollView>
  );
};

export default HashtagChips;
