import AsyncStorage from '@react-native-async-storage/async-storage';
import { exercises as initialExercises, experts as initialExperts } from './mockData';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to simulate async delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const storage = {
  auth: {
    // We now rely on Firebase Auth for the actual session, 
    // but we keep user profile data in AsyncStorage for the app's logic.
    async getProfile() {
      const name = await AsyncStorage.getItem('nickname');
      const role = await AsyncStorage.getItem('user-role');
      const bio = await AsyncStorage.getItem('user-bio');
      return { full_name: name, role: role || 'client', bio };
    },
    async updateProfile(data) {
      if (data.full_name || data.nickname) await AsyncStorage.setItem('nickname', data.nickname || data.full_name);
      if (data.role) await AsyncStorage.setItem('user-role', data.role);
      if (data.bio) await AsyncStorage.setItem('user-bio', data.bio);
      return data;
    },
    async logout() {
      await AsyncStorage.multiRemove(['nickname', 'user-role', 'user-bio', 'auth-token']);
    }
  },
  
  // Generic Entity Manager (Local)
  entity: (collectionName) => ({
    async list(orderBy) {
      await delay(200); // Simulate network
      const json = await AsyncStorage.getItem(`db_${collectionName}`);
      let items = json ? JSON.parse(json) : [];
      
      // Load initial mock data if empty and we have it
      if (items.length === 0) {
          if (collectionName === 'Exercise') items = initialExercises;
          if (collectionName === 'Expert') items = initialExperts;
          // Persist initial data
          if (items.length > 0) await AsyncStorage.setItem(`db_${collectionName}`, JSON.stringify(items));
      }

      // Basic sorting
      if (orderBy === '-created_date') {
          items.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
      }
      return items;
    },
    async create(data) {
      await delay(200);
      const json = await AsyncStorage.getItem(`db_${collectionName}`);
      const items = json ? JSON.parse(json) : [];
      const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
      items.push(newItem);
      await AsyncStorage.setItem(`db_${collectionName}`, JSON.stringify(items));
      return newItem;
    },
    async update(id, data) {
      await delay(200);
      const json = await AsyncStorage.getItem(`db_${collectionName}`);
      let items = json ? JSON.parse(json) : [];
      const idx = items.findIndex(i => i.id === id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...data };
        await AsyncStorage.setItem(`db_${collectionName}`, JSON.stringify(items));
        return items[idx];
      }
      return null;
    }
  }),

  // Chat Conversations
  conversations: {
    async list() {
        const json = await AsyncStorage.getItem('db_conversations');
        return json ? JSON.parse(json) : [];
    },
    async get(id) {
        const list = await this.list();
        return list.find(c => c.id === id) || { id, messages: [] };
    },
    async create(metadata) {
        const list = await this.list();
        const newConv = { 
            id: generateId(), 
            metadata, 
            messages: [], 
            created_date: new Date().toISOString() 
        };
        list.push(newConv);
        await AsyncStorage.setItem('db_conversations', JSON.stringify(list));
        return newConv;
    },
    async addMessage(conversationId, message) {
        const list = await this.list();
        const idx = list.findIndex(c => c.id === conversationId);
        if (idx !== -1) {
            if (!list[idx].messages) list[idx].messages = [];
            list[idx].messages.push(message);
            await AsyncStorage.setItem('db_conversations', JSON.stringify(list));
            return message;
        }
        return null;
    }
  }
};
