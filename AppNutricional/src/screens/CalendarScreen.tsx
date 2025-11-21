import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  ScrollView,
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { apiGet } from "../api";

interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  type: string;
}

export default function CalendarScreen() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const data = await apiGet<CalendarEvent[]>("/calendar/1");
        setEvents(data);
      } catch (err) {
        console.error("Error cargando calendario:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCalendar();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#BE185D" />
        <Text style={{ marginTop: 12, color: "#7E22CE" }}>
          Cargando tu calendario...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Calendario</Text>

      <ScrollView style={{ marginTop: 16 }}>
        {events.map((ev) => (
          <View key={ev.id} style={styles.card}>
            <Text style={styles.date}>{ev.date}</Text>
            <Text style={styles.eventTitle}>{ev.title}</Text>
            <Text style={styles.type}>Tipo: {ev.type}</Text>
          </View>
        ))}

        {!events.length && (
          <Text style={styles.empty}>No tienes eventos próximos.</Text>
        )}
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
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 6,
  },
  type: {
    fontSize: 13,
    color: "#6B7280",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#4B5563",
  },
});