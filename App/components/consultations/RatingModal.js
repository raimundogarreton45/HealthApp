import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useLanguage } from "../LanguageContext";

export default function RatingModal({ open, onClose, consultation, onSubmit, isLoading }) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(consultation?.rating || 0);
  const [review, setReview] = useState(consultation?.review || "");
  const [hoveredStar, setHoveredStar] = useState(0); // No tiene efecto en móvil, pero lo dejamos para lógica

  const handleSubmit = () => {
    onSubmit({ rating, review });
  };

  return (
    <Modal visible={open} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
      }}>
        <View style={{
          width: '100%',
          maxHeight: '90%',
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16
        }}>
          <ScrollView>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
              {t('rateYourSession')}
            </Text>

            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}>
              {t('howWasSession')} {consultation?.expert_name}?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={{
                    fontSize: 32,
                    color: star <= (hoveredStar || rating) ? '#FACC15' : '#D1D5DB'
                  }}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <Text style={{ textAlign: 'center', color: '#6B7280', marginBottom: 12 }}>
                {rating === 1 && t('rating1')}
                {rating === 2 && t('rating2')}
                {rating === 3 && t('rating3')}
                {rating === 4 && t('rating4')}
                {rating === 5 && t('rating5')}
              </Text>
            )}

            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
              {t('shareExperience')} ({t('optional')})
            </Text>
            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder={t('writeReview')}
              multiline
              style={{
                height: 100,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                padding: 8,
                marginBottom: 16,
                textAlignVertical: 'top'
              }}
            />

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={onClose}
                disabled={isLoading}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: '#F9FAFB'
                }}
              >
                <Text>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={rating === 0 || isLoading}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: '#7C3AED'
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {isLoading ? t('submitting') : t('submitRating')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
// End of RatingModal.js