import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Linking, StyleSheet } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "../api/storage";
import { useLanguage } from "../components/LanguageContext";
import PlaylistForm from "../components/playlists/PlaylistForm";
import { Ionicons } from '@expo/vector-icons';
import Layout from "../components/Layout";

const categoryEmojis = {
  relaxation: "🌊",
  meditation: "🧘",
  sleep: "🌙",
  focus: "🎯",
  anxiety_relief: "🌸",
  mood_boost: "☀️",
  nature_sounds: "🌿"
};

export default function Playlists() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => storage.entity('Playlist').list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => storage.entity('Playlist').create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setShowForm(false);
      setEditingPlaylist(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => storage.entity('Playlist').update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setShowForm(false);
      setEditingPlaylist(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingPlaylist) {
      updateMutation.mutate({ id: editingPlaylist.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredPlaylists = selectedCategory === "all" 
    ? playlists 
    : playlists.filter(p => p.category === selectedCategory);

  return (
    <Layout>
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('relaxationPlaylists')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.buttonText}>{t('addPlaylist')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {['all','relaxation','meditation','sleep','anxiety_relief'].map(cat => (
          <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.tab, selectedCategory === cat && styles.tabActive]}>
            <Text style={styles.tabText}>{cat === 'all' ? t('all') : categoryEmojis[cat] + ' ' + t(cat)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? <Text>Cargando...</Text> : (
        filteredPlaylists.length === 0 ? <Text>{t('noPlaylists')}</Text> : (
          <FlatList
            data={filteredPlaylists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {item.cover_image ? (
                  <Image source={{ uri: item.cover_image }} style={styles.cover} />
                ) : (
                  <View style={[styles.cover, styles.coverPlaceholder]}>
                    <Ionicons name="musical-notes" size={40} color="#fff" />
                  </View>
                )}
                <View style={{ padding: 8 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
                  <View style={styles.cardButtons}>
                    {item.spotify_url && (
                      <TouchableOpacity style={[styles.playButton]} onPress={() => Linking.openURL(item.spotify_url)}>
                        <Ionicons name="play" size={16} color="#fff" />
                        <Text style={styles.playButtonText}>{t('playOnSpotify')}</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.editButton} onPress={() => { setEditingPlaylist(item); setShowForm(true); }}>
                      <Ionicons name="pencil" size={16} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )
      )}

      {showForm && (
        <PlaylistForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingPlaylist(null); }}
          onSubmit={handleSubmit}
          playlist={editingPlaylist}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  button: { flexDirection: 'row', backgroundColor: '#7C3AED', padding: 8, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', marginLeft: 4 },
  tab: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E5E7EB', borderRadius: 20, marginRight: 8 },
  tabActive: { backgroundColor: '#C7D2FE' },
  tabText: { fontWeight: '600', color: '#374151' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cover: { width: '100%', height: 160 },
  coverPlaceholder: { backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playButton: { flexDirection: 'row', backgroundColor: '#10B981', padding: 6, borderRadius: 6, alignItems: 'center' },
  playButtonText: { color: '#fff', marginLeft: 4 },
  editButton: { padding: 6, borderRadius: 6, backgroundColor: '#E5E7EB' }
});
