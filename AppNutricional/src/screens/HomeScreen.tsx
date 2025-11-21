import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenid@</Text>
      <Text style={styles.subtitle}>App Dra. Laura Rozo</Text>
      <Text style={styles.text}>
        Aquí vas a ver tu plan nutricional, tu progreso, tu calendario y la nuestros suplementos seleccionados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F8", // rosa pastel
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#BE185D", // rosa fuerte
    marginBottom: 8

  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#7E22CE", // púrpura
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
  },
});