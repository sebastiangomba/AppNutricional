import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

export default function ChatScreen() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Aquí luego llamamos al backend /chat con Gemini
    console.log("Mensaje enviado:", message);
    setMessage("");
  };

  return (
    <ScreenContainer>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FDF2F8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Chat de soporte</Text>
        <Text style={styles.text}>
          Pregunta tus dudas sobre la app, el plan o los suplementos. Más adelante esto
          se conectará a un asistente con IA (Gemini).
        </Text>

        <ScrollView style={styles.chatBox}>
          <Text style={styles.placeholder}>
            (Aquí luego aparecerá el historial de mensajes.)
          </Text>
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 16,
  },
  chatBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  placeholder: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 12,
    columnGap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#7E22CE",
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});