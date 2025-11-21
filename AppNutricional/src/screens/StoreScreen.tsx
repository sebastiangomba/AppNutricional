import { View, Text, StyleSheet } from "react-native";
import ScreenContainer from "../components/ScreenContainer";

export default function StoreScreen() {
  return (
    <ScreenContainer>
        <View style={styles.container}>
        <Text style={styles.title}>Tienda de suplementos</Text>
        <Text style={styles.text}>
            Aquí verás los suplementos recomendados por la Dra. Laura Rozo, con descripciones y precios.
        </Text>
        <Text style={styles.placeholder}>
            (Después conectamos esta pantalla al endpoint de productos.)
        </Text>
        </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
  },
  placeholder: {
    marginTop: 16,
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});