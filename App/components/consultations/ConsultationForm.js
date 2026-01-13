import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from "../LanguageContext";

const specializations = [
  { value: "anxiety", label: "Anxiety", emoji: "🌸" },
  { value: "depression", label: "Depression", emoji: "🌙" },
  { value: "stress_management", label: "Stress Management", emoji: "🌊" },
  { value: "self_esteem", label: "Self-Esteem", emoji: "⭐" },
  { value: "relationships", label: "Relationships", emoji: "💕" },
  { value: "trauma", label: "Trauma", emoji: "🛡️" },
  { value: "general", label: "General", emoji: "💚" },
];

export default function ConsultationForm({ open, onClose, onSubmit, consultation, expert, isLoading }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    expert_id: "",
    expert_name: "",
    specialization: "general",
    date: "",
    time: "",
    notes: "",
    meeting_link: "",
  });

  useEffect(() => {
    if (consultation) {
      setFormData(consultation);
    } else if (expert) {
      setFormData({
        expert_id: expert.id,
        expert_name: expert.name,
        specialization: expert.specialization,
        date: "",
        time: "",
        notes: "",
        meeting_link: "",
      });
    } else {
      setFormData({
        expert_id: "",
        expert_name: "",
        specialization: "general",
        date: "",
        time: "",
        notes: "",
        meeting_link: "",
      });
    }
  }, [consultation, expert]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <Modal visible={open} animationType="slide" transparent={false} onRequestClose={onClose}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        {consultation ? t('editConsultation') : t('bookConsultation')}
      </Text>

      {!expert && (
        <View style={{ marginBottom: 15 }}>
          <Text>{t('expertName')}</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginTop: 5,
            }}
            value={formData.expert_name}
            onChangeText={(text) => setFormData({ ...formData, expert_name: text })}
            placeholder={t('enterExpertName')}
          />
        </View>
      )}

      {expert && (
        <View style={{ marginBottom: 15, padding: 10, backgroundColor: "#F3E8FF", borderRadius: 8 }}>
          <Text style={{ fontSize: 14, color: "#555" }}>{t('bookingWith')}</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#6B21A8" }}>{expert.name}</Text>
          <Text style={{ fontSize: 14, color: "#555" }}>
            {expert.specialization.replace(/_/g, " ")}
          </Text>
        </View>
      )}

      {!expert && (
        <View style={{ marginBottom: 15 }}>
          <Text>{t('specialization')}</Text>
          {specializations.map((spec) => (
            <TouchableOpacity
              key={spec.value}
              onPress={() => setFormData({ ...formData, specialization: spec.value })}
              style={{
                padding: 10,
                marginTop: 5,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: formData.specialization === spec.value ? "#6B21A8" : "#ccc",
                backgroundColor: formData.specialization === spec.value ? "#E9D5FF" : "#fff",
              }}
            >
              <Text>{spec.emoji} {spec.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ marginBottom: 15 }}>
        <Text>{t('date')}</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginTop: 5,
          }}
          value={formData.date}
          placeholder="YYYY-MM-DD"
          onChangeText={(text) => setFormData({ ...formData, date: text })}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text>{t('time')}</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginTop: 5,
          }}
          value={formData.time}
          placeholder="HH:MM"
          onChangeText={(text) => setFormData({ ...formData, time: text })}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text>{t('meetingLink')} ({t('optional')})</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginTop: 5,
          }}
          value={formData.meeting_link}
          placeholder="https://zoom.us/..."
          onChangeText={(text) => setFormData({ ...formData, meeting_link: text })}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text>{t('notes')} ({t('optional')})</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginTop: 5,
            height: 100,
            textAlignVertical: "top",
          }}
          value={formData.notes}
          multiline
          placeholder={t('consultationNotesPlaceholder')}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
        />
      </View>

    </ScrollView>
    <SafeAreaView edges={["bottom"]} style={{ padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', backgroundColor: '#F9FAFB' }}
          onPress={onClose}
        >
          <Text>{t('cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#6B21A8' }}
          onPress={handleSubmit}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>{isLoading ? t('saving') : consultation ? t('update') : t('bookSession')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </View>
    </KeyboardAvoidingView>
    </Modal>
  );
}
