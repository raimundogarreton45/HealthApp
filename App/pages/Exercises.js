// pages/Exercises.js
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
let exercisesIntroShown = false;
import { useQuery } from "@tanstack/react-query";
import { storage } from "../api/storage";
import { useLanguage } from "../components/LanguageContext";
import ExerciseModal from "../components/exercises/ExerciseModal";
import Layout from "../components/Layout";

const categoryEmojis = {
  anxiety: "🌸",
  stress: "🌊",
  self_esteem: "⭐"
};

const categoryColors = {
  anxiety: "#E9D5FF",
  stress: "#DBEAFE",
  self_esteem: "#DCFCE7"
};

const difficultyColors = {
  beginner: "#DCFCE7",
  intermediate: "#FEF3C7",
  advanced: "#FFE8D6"
};

export default function Exercises() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => storage.entity('Exercise').list(),
    initialData: [],
  });

  const filteredExercises = selectedCategory === "all" 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  useEffect(() => {
    if (!exercisesIntroShown) {
      exercisesIntroShown = true;
      Alert.alert(t('exercisesTitle'), t('exercisesDesc'), [{ text: 'OK' }]);
    }
  }, []);

  return (
    <Layout>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('guidedExercises')}</Text>
        <Text style={styles.subtitle}>{t('exercisesSubtitle')}</Text>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {['all','anxiety','stress','self_esteem'].map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, selectedCategory === cat && styles.categorySelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={styles.categoryText}>
                {cat !== 'all' ? categoryEmojis[cat] + " " : ""}{t(cat)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercises */}
        {isLoading ? (
          <Text>Cargando...</Text>
        ) : filteredExercises.length === 0 ? (
          <Text style={styles.noExercises}>{t('noExercises')}</Text>
        ) : (
          <FlatList
            data={filteredExercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => setSelectedExercise(item)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.emoji}>{categoryEmojis[item.category]}</Text>
                  <Text style={[styles.categoryBadge, {backgroundColor: categoryColors[item.category]}]}>{t(item.category)}</Text>
                </View>
                <Text style={styles.cardTitle}>{item[`title_${language}`] || item.title_es || item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item[`description_${language}`] || item.description_es || item.description}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>

      {/* Exercise Modal */}
      {selectedExercise && (
        <ExerciseModal 
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  categories: { flexDirection: 'row', marginBottom: 16 },
  categoryBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E5E7EB', marginRight: 8 },
  categorySelected: { backgroundColor: '#C7D2FE' },
  categoryText: { fontSize: 12, fontWeight: '500', color: '#374151' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' },
  emoji: { fontSize: 22 },
  categoryBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12, fontSize: 10, color: '#111827' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#111827' },
  cardDesc: { fontSize: 12, color: '#6B7280' },
  noExercises: { textAlign: 'center', marginTop: 40, color: '#6B7280', fontSize: 14 },
});
