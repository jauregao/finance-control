import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

type HeaderRightButtonProps = {
  color: string;
  onPress?: () => void;
};

export const HeaderRightButton = ({ color }: HeaderRightButtonProps) => (
  <Link href="/modal" asChild>
    <Pressable>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={25}
          color={color}
          style={{
            marginRight: 15,
            opacity: pressed ? 0.5 : 1,
          }}
        />
      )}
    </Pressable>
  </Link>
);
