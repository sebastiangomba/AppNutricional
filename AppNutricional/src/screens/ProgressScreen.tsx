import { useEffect, useState } from "react";
import { StyleSheet, Text, ActivityIndicator, View, ScrollView } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { apiGet } from "../api";

interface Metric {
  id: number;
  date: string;
  weight: number;
  body_fat: number;
  notes: string;
}

export default function ProgressScreen() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await apiGet("/metrics/1");
        setMetrics(data);
      } catch (err) {
        console.error("Error cargando métricas:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#BE185D" />
        <Text style={{ marginTop: 12, color: "#7E22CE" }}>
          Cargando tus métricas...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Tu progreso</Text>

      <ScrollView style={{ marginTop: 16 }}>
        {metrics.map((m) => (
          <View key={m.id} style={styles.card}>
            <Text style={styles.date}>{m.date}</Text>

            <Text style={styles.metric}>
              Peso: <Text style={styles.value}>{m.weight} kg</Text>
            </Text>

            <Text style={styles.metric}>
              Grasa corporal: <Text style={styles.value}>{m.body_fat}%</Text>
            </Text>

            {m.notes ? (
              <Text style={styles.notes}>Notas: {m.notes}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#BE185D",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7E22CE",
    marginBottom: 8,
  },
  metric: {
    fontSize: 15,
    marginBottom: 4,
    color: "#4B5563",
  },
  value: {
    fontWeight: "700",
    color: "#BE185D",
  },
  notes: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#6B7280",
  },
});