// pages/Consultations.js
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Linking, useWindowDimensions, Alert, Modal, Image } from "react-native";
let consultationsIntroShown = false;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "../api/storage";
import { useLanguage } from "../components/LanguageContext";
import ConsultationForm from "../components/consultations/ConsultationForm";
import RatingModal from "../components/consultations/RatingModal";
import ExpertCard from "../components/consultations/ExpertCard";
import Layout from "../components/Layout";

const statusColors = {
  pending: "#FEF3C7",
  confirmed: "#DCFCE7",
  completed: "#E5E7EB",
  cancelled: "#FEE2E2"
};

const specializationEmojis = {
  anxiety: "🌸",
  depression: "🌙",
  stress_management: "🌊",
  self_esteem: "⭐",
  relationships: "💕",
  trauma: "🛡️",
  general: "💚"
};

export default function Consultations() {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;
  const [activeTab, setActiveTab] = useState("experts");
  const [showForm, setShowForm] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [ratingConsultation, setRatingConsultation] = useState(null);
  const queryClient = useQueryClient();

  const { data: experts = [], isLoading: expertsLoading } = useQuery({
    queryKey: ['experts'],
    queryFn: () => storage.entity('Expert').list(),
    initialData: [],
  });

  const { data: consultations = [], isLoading: consultationsLoading } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => storage.entity('Consultation').list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => storage.entity('Consultation').create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      setShowForm(false);
      setEditingConsultation(null);
      setSelectedExpert(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => storage.entity('Consultation').update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      setShowForm(false);
      setEditingConsultation(null);
      setRatingConsultation(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingConsultation) {
      updateMutation.mutate({ id: editingConsultation.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleRatingSubmit = ({ rating, review }) => {
    if (!ratingConsultation) return;
    const updatedData = { ...ratingConsultation, rating, review };
    updateMutation.mutate({ id: ratingConsultation.id, data: updatedData });
  };

  const handleBookExpert = (expert) => {
    setSelectedExpert(expert);
    setShowForm(true);
  };
  const handleViewExpert = (expert) => {
    setSelectedExpert(expert);
    setShowPreview(true);
  };

  const upcomingConsultations = consultations.filter(c => c.status === 'confirmed' || c.status === 'pending');
  const pastConsultations = consultations.filter(c => c.status === 'completed' || c.status === 'cancelled');

  useEffect(() => {
    if (!consultationsIntroShown) {
      consultationsIntroShown = true;
      Alert.alert(t('consultationsTitle'), t('consultationsDesc'), [{ text: 'OK' }]);
    }
  }, []);

  return (
    <Layout>
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, maxWidth: 800, alignSelf: 'center' }}>
      {/* Header */}
      <View style={[styles.header, isNarrow && styles.headerNarrow]}>
        <View>
          <Text style={styles.title}>{t('expertConsultations')}</Text>
          <Text style={styles.subtitle}>{t('consultationsSubtitle')}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, isNarrow && { alignSelf: 'flex-start', marginTop: 8 }]}
          onPress={() => { setEditingConsultation(null); setSelectedExpert(null); setShowForm(true); }}
        >
          <Text style={styles.bookButtonText}>{t('bookConsultation')}</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['experts','appointments'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.tabActive]}
          >
            <Text style={styles.tabText}>{t(tab)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Experts Tab */}
      {activeTab === 'experts' && (
        <View>
          {expertsLoading ? (
            <Text>Cargando...</Text>
          ) : experts.length > 0 ? (
            <FlatList
              data={experts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <ExpertCard expert={item} onBook={handleBookExpert} onView={handleViewExpert} />}
              scrollEnabled={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          ) : (
            <Text>{t('noExperts')}</Text>
          )}
        </View>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <View>
          <Text style={styles.sectionTitle}>{t('upcomingSessions')}</Text>
          {upcomingConsultations.length === 0 ? <Text>{t('noUpcoming')}</Text> : (
            upcomingConsultations.map(c => (
              <View key={c.id} style={styles.card}>
                <Text style={styles.cardTitle}>{c.expert_name}</Text>
                <Text>{specializationEmojis[c.specialization]} {t(c.specialization)}</Text>
                <Text>{c.date} {c.time}</Text>
                {c.meeting_link && (
                  <TouchableOpacity onPress={() => Linking.openURL(c.meeting_link)}>
                    <Text style={styles.link}>{t('joinSession')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

          <Text style={styles.sectionTitle}>{t('pastSessions')}</Text>
          {pastConsultations.length === 0 ? <Text>{t('noPast')}</Text> : (
            pastConsultations.map(c => (
              <View key={c.id} style={styles.card}>
                <Text style={styles.cardTitle}>{c.expert_name}</Text>
                <Text>{t(c.specialization)}</Text>
                <Text>{c.date} {c.time}</Text>
                {c.rating ? <Text>{t('yourRating')}: {c.rating}</Text> : null}
              </View>
            ))
          )}
        </View>
      )}

      {/* Modals */}
      {showPreview && selectedExpert && (
        <Modal visible={showPreview} animationType="slide" onRequestClose={() => setShowPreview(false)}>
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {selectedExpert.photo_url ? (
                <Image source={{ uri: selectedExpert.photo_url }} style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E5E7EB' }} />
              ) : (
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: '#7C3AED' }}>{(selectedExpert.name || 'G').charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>{selectedExpert.name}</Text>
                {!!selectedExpert.degree && <Text style={{ color: '#6B7280' }}>{selectedExpert.degree}</Text>}
                {!!selectedExpert.credentials && <Text style={{ color: '#6B7280' }}>{selectedExpert.credentials}</Text>}
              </View>
            </View>
            {!!selectedExpert.bio && <Text style={{ color: '#374151', fontSize: 14 }}>{selectedExpert.bio}</Text>}
            {!!selectedExpert.cv_url && (
              <TouchableOpacity onPress={() => Linking.openURL(selectedExpert.cv_url)} style={{ marginTop: 12 }}>
                <Text style={{ color: '#7C3AED', fontWeight: '600' }}>CV</Text>
              </TouchableOpacity>
            )}
            <View style={{ marginTop: 24 }}>
              <TouchableOpacity
                onPress={() => { setShowPreview(false); handleBookExpert(selectedExpert); }}
                style={{ backgroundColor: '#7C3AED', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>{t('bookConsultation')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowPreview(false)}
                style={{ marginTop: 10, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', backgroundColor: '#FFFFFF' }}
              >
                <Text style={{ fontWeight: '600', color: '#374151' }}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      )}

      {showForm && (
        <ConsultationForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          consultation={editingConsultation}
          expert={selectedExpert}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {ratingConsultation && (
        <RatingModal
          open={!!ratingConsultation}
          onClose={() => setRatingConsultation(null)}
          consultation={ratingConsultation}
          onSubmit={handleRatingSubmit}
          isLoading={updateMutation.isPending}
        />
      )}
    </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerNarrow: { flexDirection: 'column', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  bookButton: { backgroundColor: '#7C3AED', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  bookButtonText: { color: '#fff', fontWeight: '600' },
  tabs: { flexDirection: 'row', marginBottom: 16 },
  tabButton: { flex:1, paddingVertical: 8, alignItems: 'center', backgroundColor: '#E5E7EB', marginHorizontal: 2, borderRadius: 6 },
  tabActive: { backgroundColor: '#C7D2FE' },
  tabText: { fontWeight: '600', color: '#374151' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginVertical: 8 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 }
});
