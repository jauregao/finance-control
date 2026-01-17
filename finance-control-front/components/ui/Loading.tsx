import { loadingStyles } from "@/src/styles/loading.style";
import { ActivityIndicator } from "react-native";
import { ThemedView as View } from '@/components/ui/Themed';


export enum Size {
  SMALL = 'small',
  LARGE = 'large', 
}

type LoadingProps = {
  size?: Size;
};

export function Loading({ size = Size.LARGE }: LoadingProps) {
  return (
    <View style={ loadingStyles.container }>
      <ActivityIndicator size={ size } color={ loadingStyles.activityIndicator.color } />
    </View>
  );
}