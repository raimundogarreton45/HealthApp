// components/exercises/ExerciseModal.js
import React, { useEffect, useState, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const categoryColors = {
  anxiety: "#C4B5FD", // purple-100
  stress: "#BFDBFE",  // blue-100
  self_esteem: "#D1FAE5" // green-100
};

const difficultyColors = {
  beginner: "#DCFCE7", // green-50
  intermediate: "#FEF9C3", // yellow-50
  advanced: "#FFEDD5" // orange-50
};

export default function ExerciseModal({ exercise, visible, onClose, language = "es" }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    // reset on exercise change
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
  }, [exercise]);

  if (!exercise) return null;

  const title = exercise[`title_${language}`] || exercise.title_es || exercise.title || "";
  const description = exercise[`description_${language}`] || exercise.description_es || exercise.description || "";
  const benefits = exercise[`benefits_${language}`] || exercise.benefits_es || exercise.benefits || [];
  const audioUrl = exercise[`audio_url_${language}`] || exercise.audio_url_es || "";

  const togglePlayPause = async () => {
    if (!audioUrl) return;

    if (!sound) {
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, volume },
        updateStatus
      );
      setSound(newSound);
      setIsPlaying(true);
      setDuration(status.durationMillis / 1000);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const updateStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      if (status.didJustFinish) setIsPlaying(false);
    }
  };

  const handleSeek = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value * 1000);
      setPosition(value);
    }
  };

  const handleRestart = async () => {
    if (sound) {
      await sound.setPositionAsync(0);
      setPosition(0);
      setIsPlaying(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          {exercise.category && (
            <View style={[styles.badge, { backgroundColor: categoryColors[exercise.category] || "#E5E7EB" }]}>
              <Text style={styles.badgeText}>{exercise.category}</Text>
            </View>
          )}
          {exercise.difficulty && (
            <View style={[styles.badge, { backgroundColor: difficultyColors[exercise.difficulty] || "#E5E7EB" }]}>
              <Text style={styles.badgeText}>{exercise.difficulty}</Text>
            </View>
          )}
          {exercise.duration && (
            <View style={[styles.badge, { backgroundColor: "#F3F4F6", flexDirection: "row", alignItems: "center" }]}>
              <Feather name="clock" size={16} color="#374151" />
              <Text style={[styles.badgeText, { marginLeft: 4 }]}>{exercise.duration} min</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {description ? (
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        ) : null}

        {/* Benefits */}
        {benefits.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.sectionTitle}>Beneficios</Text>
            {benefits.map((b, idx) => (
              <View key={idx} style={styles.benefit}>
                <MaterialIcons name="check-circle" size={20} color="#10B981" style={{ marginRight: 8 }} />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Audio Player */}
        {audioUrl ? (
          <View style={styles.audioContainer}>
            <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.timeText}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>

            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={duration || 1}
              value={position}
              onValueChange={handleSeek}
              minimumTrackTintColor="#7C3AED"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#7C3AED"
            />

            <View style={styles.controls}>
              <TouchableOpacity onPress={handleRestart} style={styles.controlButton}>
                <Feather name="rotate-ccw" size={24} color="#7C3AED" />
              </TouchableOpacity>

              <View style={styles.volumeContainer}>
                <Feather name="volume-2" size={20} color="#7C3AED" />
                <Slider
                  style={{ flex: 1, marginLeft: 8 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  onValueChange={setVolume}
                  minimumTrackTintColor="#7C3AED"
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor="#7C3AED"
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Feather name="volume-2" size={40} color="#C4B5FD" />
            <Text style={{ color: "#6B7280", marginTop: 8, textAlign: "center" }}>
              Audio guiado próximamente
            </Text>
          </View>
        )}

        {/* Note */}
        <View style={styles.note}>
          <Text style={{ color: "#7C3AED" }}>💜 Recuerda seguir tu propio ritmo</Text>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", color: "#374151", flex: 1 },
  metadata: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#374151" },
  description: { fontSize: 14, color: "#4B5563" },
  benefit: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  benefitText: { fontSize: 14, color: "#4B5563" },
  audioContainer: { marginVertical: 20, padding: 16, borderRadius: 16, backgroundColor: "#F3F4F6" },
  playButton: { backgroundColor: "#7C3AED", width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 12 },
  timeText: { textAlign: "center", marginBottom: 8, fontWeight: "600", color: "#374151" },
  controls: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  controlButton: { padding: 8 },
  volumeContainer: { flexDirection: "row", alignItems: "center", flex: 1, marginLeft: 12 },
  note: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: "#EDE9FE", borderRadius: 12, backgroundColor: "#F5F3FF", alignItems: "center" }
});
