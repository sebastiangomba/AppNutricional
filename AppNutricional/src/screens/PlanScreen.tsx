import { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { apiGet } from "../api";

interface Plan {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function PlanScreen() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await apiGet("/plan/1");
        setPlan(data);
      } catch (err) {
        console.error("Error cargando plan:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#BE185D" />
        <Text style={{ marginTop: 12, color: "#7E22CE" }}>
          Cargando tu plan nutricional...
        </Text>
      </ScreenContainer>
    );
  }

  if (!plan) {
    return (
      <ScreenContainer>
        <Text style={styles.error}>No se encontró un plan nutricional.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.date}>Última actualización: {plan.created_at}</Text>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.text}>{plan.description}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 8,
  },
  date: {
    color: "#7E22CE",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7E22CE",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});