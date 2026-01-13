import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Layout from "../components/Layout";
import MessageBubble from "../components/chat/MessageBubble";
import { useLanguage } from "../components/LanguageContext";
import { sendMessageToAI } from "../services/api"; // <-- nuestro api.js

let introShown = false;

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Mostrar intro una sola vez
  useEffect(() => {
    if (!introShown) {
      introShown = true;
      Alert.alert(
        t("aiCompanionTitle"),
        "Este espacio ofrece acompañamiento emocional y orientación general. No reemplaza atención profesional."
      );
    }
  }, []);

  // Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Llamar al backend Render
    const reply = await sendMessageToAI(userMsg.content);

    const aiMsg = { role: "assistant", content: reply };
    setMessages((prev) => [...prev, aiMsg]);

    setLoading(false);
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={scrollRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t("shareThoughts")}
            value={input}
            onChangeText={setInput}
            multiline
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={sendMessage}
            disabled={loading || !input.trim()}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  sendBtnText: { color: "#fff", fontWeight: "bold" },
});
