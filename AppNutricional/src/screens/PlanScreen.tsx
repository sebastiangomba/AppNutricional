import { StyleSheet, Text, ScrollView } from "react-native";
import ScreenContainer from "../components/ScreenContainer";

export default function PlanScreen() {
  return (
    <ScreenContainer>
      <ScrollView>
        <Text style={styles.title}>Tu plan nutricional</Text>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <Text style={styles.text}>
          Aquí verás el plan personalizado que la Dra. Laura Rozo ha diseñado para ti.
        </Text>

        <Text style={styles.sectionTitle}>Ejemplo (dummy)</Text>
        <Text style={styles.text}>
          Desayuno: avena con frutas y proteína.
          {"\n"}Almuerzo: proteína magra + vegetales.
          {"\n"}Cena: ligera, alta en fibra.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7E22CE",
    marginTop: 12,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
  },
});