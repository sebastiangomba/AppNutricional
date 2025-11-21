import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

interface Props {
  children: ReactNode;
}

export default function ScreenContainer({ children }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F8",
    paddingTop: 60, 
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});