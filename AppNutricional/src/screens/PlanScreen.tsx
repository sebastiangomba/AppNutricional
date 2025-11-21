import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

type MealKey = "desayuno" | "almuerzo" | "cena" | "snacks";

const meals: { key: MealKey; title: string; items: string[] }[] = [
  {
    key: "desayuno",
    title: "Desayuno",
    items: [
      "Avena con leche vegetal",
      "Frutas frescas (fresas, banano, arándanos)",
      "1 porción de proteína (huevo, yogurt griego, etc.)",
    ],
  },
  {
    key: "almuerzo",
    title: "Almuerzo",
    items: [
      "Proteína magra (pollo, pavo, pescado o tofu)",
      "Mitad del plato en vegetales",
      "Carbohidrato complejo (quinoa, arroz integral o papa)",
    ],
  },
  {
    key: "cena",
    title: "Cena",
    items: [
      "Ensalada ligera con proteína",
      "Grasas saludables (aguacate, aceite de oliva)",
      "Evitar comidas muy pesadas o muy tarde",
    ],
  },
  {
    key: "snacks",
    title: "Snacks recomendados",
    items: [
      "Frutos secos (porción pequeña)",
      "Yogurt griego + fruta",
      "Palitos de zanahoria / pepino con hummus",
    ],
  },
];

export default function HomeScreen() {
  const [openMeal, setOpenMeal] = useState<MealKey | null>(null);

  const toggleMeal = (key: MealKey) => {
    setOpenMeal((prev) => (prev === key ? null : key));
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con imagen */}
        <View style={styles.headerCard}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Hola, paciente demo 👋</Text>
            <Text style={styles.headerSubtitle}>
              Este es tu espacio de acompañamiento nutricional con la Dra. Laura
              Rozo.
            </Text>
          </View>
        </View>

        {/* Bloque de resumen */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Vista rápida de hoy</Text>
          <Text style={styles.sectionText}>
            Revisa tu estructura general del día según tu plan nutricional.
            Recuerda que estas son guías generales y cualquier cambio debe ser
            validado con la doctora.
          </Text>
        </View>

        {/* Acordeones de comidas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Comidas del día</Text>

          {meals.map((meal) => {
            const isOpen = openMeal === meal.key;
            return (
              <View key={meal.key} style={styles.mealContainer}>
                <TouchableOpacity
                  style={styles.mealHeader}
                  onPress={() => toggleMeal(meal.key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                  <Text style={styles.mealToggle}>{isOpen ? "−" : "+"}</Text>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.mealContent}>
                    {meal.items.map((item, idx) => (
                      <Text key={idx} style={styles.mealItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Recordatorio final */}
        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>Recordatorio</Text>
          <Text style={styles.reminderText}>
            Esta app no reemplaza una consulta médica. Usa el chat y tus
            controles para complementar el acompañamiento directo con la Dra.
            Laura Rozo.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
    height: 180,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(190, 24, 93, 0.35)", // overlay rosado
  },
  headerTextContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#F9FAFB",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#4B5563",
  },
  mealContainer: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  mealToggle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#BE185D",
  },
  mealContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  mealItem: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  reminderCard: {
    marginTop: 4,
    marginBottom: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FCE7F3",
    borderWidth: 1,
    borderColor: "#F9A8D4",
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 13,
    color: "#4B5563",
  },
});