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
  ActivityIndicator,
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { apiPost } from "../api";

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { from: "user", text: message.trim() };
    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await apiPost<{ reply: string }>("/chat", {
        message: userMessage.text,
      });

      const botMessage: Message = { from: "bot", text: res.reply };
      setHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        from: "bot",
        text: "Hubo un problema al conectar con la IA. Intenta nuevamente.",
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Soporte y dudas frecuentes</Text>
          <Text style={styles.text}>
            Pregunta tus dudas sobre la app, el plan o los suplementos.
          </Text>

          <ScrollView
            style={styles.chatBox}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {history.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.bubble,
                  msg.from === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={
                    msg.from === "user" ? styles.userText : styles.botText
                  }
                >
                  {msg.text}
                </Text>
              </View>
            ))}

            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#BE185D" />
                <Text style={styles.loadingText}>Escribiendo...</Text>
              </View>
            )}

            {!history.length && !loading && (
              <Text style={styles.placeholder}>
                (Aquí aparecerá el historial de mensajes.)
              </Text>
            )}
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
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#BE185D",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
  },
  userText: {
    color: "white",
  },
  botText: {
    color: "#111827",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    columnGap: 6,
  },
  loadingText: {
    fontSize: 12,
    color: "#6B7280",
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