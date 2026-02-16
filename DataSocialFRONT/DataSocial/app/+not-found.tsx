import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text className="text-xl font-bold">Esta pantalla no existe.</Text>
      <Link href="/" className="mt-4 pt-4">
        <Text className="text-base text-[#7C3AED]">Volver al inicio</Text>
      </Link>
    </View>
  );
}
