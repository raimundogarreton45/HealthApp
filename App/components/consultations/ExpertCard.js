import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useLanguage } from "../LanguageContext";

const specializationEmojis = {
  anxiety: "🌸",
  depression: "🌙",
  stress_management: "🌊",
  self_esteem: "⭐",
  relationships: "💕",
  trauma: "🛡️",
  general: "💚"
};

export default function ExpertCard({ expert, onBook, onView }) {
  const { t } = useLanguage();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i <= rating ? "#FACC15" : "#D1D5DB", fontSize: 16 }}>
          ★
        </Text>
      );
    }
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        {stars}
        <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>
          ({expert.total_ratings || 0})
        </Text>
      </View>
    );
  };

  return (
    <View style={{
      borderWidth: 1,
      borderColor: "#DDD6FE",
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "white",
      marginBottom: 16,
      padding: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 }
    }}>
      <TouchableOpacity onPress={() => onView && onView(expert)} style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        {expert.photo_url ? (
          <Image
            source={{ uri: expert.photo_url }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        ) : (
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#7C3AED",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Text style={{ color: "white", fontSize: 24 }}>👤</Text>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
            {expert.name}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {specializationEmojis[expert.specialization]} {t(expert.specialization)}
          </Text>
        </View>
      </TouchableOpacity>

      {expert.average_rating > 0 && <View style={{ marginBottom: 8 }}>{renderStars(expert.average_rating)}</View>}

      {expert.credentials && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Text style={{ fontSize: 14 }}>🏆</Text>
          <Text style={{ fontSize: 14, color: "#374151" }}>{expert.credentials}</Text>
        </View>
      )}

      {/* Removed separate languages display to keep info in bio */}

      <Text style={{ fontSize: 14, color: "#4B5563", marginBottom: 8 }} numberOfLines={3}>
        {expert.bio}
      </Text>

      {/* Availability removed for cleaner professional preview */}

      <TouchableOpacity
        onPress={() => onBook(expert)}
        style={{
          backgroundColor: "#7C3AED",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>{t('bookSession')}</Text>
      </TouchableOpacity>
    </View>
  );
}
