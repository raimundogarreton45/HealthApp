import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';

const categories = [
  { value: "relaxation", label: "🌊 Relaxation" },
  { value: "meditation", label: "🧘 Meditation" },
  { value: "sleep", label: "🌙 Sleep" },
  { value: "focus", label: "🎯 Focus" },
  { value: "anxiety_relief", label: "🌸 Anxiety Relief" },
  { value: "mood_boost", label: "☀️ Mood Boost" },
  { value: "nature_sounds", label: "🌿 Nature Sounds" },
];

export default function PlaylistForm({ open, onClose, onSubmit, playlist, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "relaxation",
    spotify_url: "",
    cover_image: "",
    duration: ""
  });

  useEffect(() => {
    if (playlist) {
      setFormData(playlist);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "relaxation",
        spotify_url: "",
        cover_image: "",
        duration: ""
      });
    }
  }, [playlist, open]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Modal visible={open} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, maxHeight: '90%' }}>
          <ScrollView>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
              {playlist ? "Edit Playlist" : "Add Spotify Playlist"}
            </Text>

            {/* Title */}
            <Text style={{ marginBottom: 4 }}>Playlist Title</Text>
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Calming Piano Music"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 8, marginBottom: 12 }}
            />

            {/* Spotify URL */}
            <Text style={{ marginBottom: 4 }}>Spotify Playlist URL</Text>
            <TextInput
              value={formData.spotify_url}
              onChangeText={(text) => setFormData({ ...formData, spotify_url: text })}
              placeholder="https://open.spotify.com/playlist/..."
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 8, marginBottom: 4 }}
            />
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
              Open Spotify → Find playlist → Share → Copy link
            </Text>

            {/* Category */}
            <Text style={{ marginBottom: 4 }}>Category</Text>
            <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 12 }}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                ))}
              </Picker>
            </View>

            {/* Description */}
            <Text style={{ marginBottom: 4 }}>Description (Optional)</Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Peaceful piano melodies to help you unwind..."
              multiline
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 8, marginBottom: 12, textAlignVertical: 'top', height: 80 }}
            />

            {/* Duration */}
            <Text style={{ marginBottom: 4 }}>Duration (Optional)</Text>
            <TextInput
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="2 hours"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 8, marginBottom: 12 }}
            />

            {/* Cover Image */}
            <Text style={{ marginBottom: 4 }}>Cover Image URL (Optional)</Text>
            <TextInput
              value={formData.cover_image}
              onChangeText={(text) => setFormData({ ...formData, cover_image: text })}
              placeholder="https://images.unsplash.com/..."
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 8, marginBottom: 4 }}
            />
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
              Use an image from Unsplash or any public URL
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={onClose}
                disabled={isLoading}
                style={{ flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, alignItems: 'center', backgroundColor: '#F9FAFB' }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#7C3AED' }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {isLoading ? "Saving..." : playlist ? "Update" : "Add Playlist"}
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
// End of PlaylistForm.js