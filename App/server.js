require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Ensure fetch is available in all Node versions
const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for potential base64 images

// Prevent server from crashing on unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// --- Database Helper ---
const getDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { users: [], experts: [], consultations: [], playlists: [], exercises: [], conversations: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('Database read error:', e);
    return { users: [], experts: [], consultations: [], playlists: [], exercises: [], conversations: [] };
  }
};

const saveDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Database write error:', e);
  }
};

// --- Auth Routes ---

app.post('/auth/register', (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const db = getDB();
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
      id: 'u_' + Date.now(),
      email,
      password, // In a real app, hash this!
      full_name: full_name || email.split('@')[0],
      role: 'client',
      created_at: new Date().toISOString()
    };
    
    db.users.push(newUser);
    saveDB(db);
    
    const { password: _, ...userWithoutPass } = newUser;
    res.json({ user: userWithoutPass, token: newUser.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const { password: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token: user.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/auth/google', (req, res) => {
  try {
    // In a real app, verify the token with Google
    // For this demo/local setup, we trust the client sends the email/name after "mock" or client-side auth
    const { email, name, photoUrl } = req.body;
    
    if (!email) return res.status(400).json({ error: 'Email required for Google login' });

    const db = getDB();
    let user = db.users.find(u => u.email === email);
    
    let isNewUser = false;
    
    if (!user) {
      // Create new user from Google
      isNewUser = true;
      user = {
        id: 'u_google_' + Date.now(),
        email,
        full_name: name || email.split('@')[0],
        photo_url: photoUrl,
        role: 'client',
        provider: 'google',
        created_at: new Date().toISOString()
      };
      db.users.push(user);
      saveDB(db);
    }

    const { password: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token: user.id, isNewUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === token);
    if (userIndex === -1) return res.status(401).json({ error: 'Invalid token' });
    
    // Update fields
    const { full_name, role, nickname, bio } = req.body;
    if (typeof full_name === 'string' && full_name.trim().length > 0) {
      db.users[userIndex].full_name = full_name.trim();
    }
    if (typeof role === 'string') {
      const normalized = role === 'both' ? 'expert' : role; // align with client mapping
      if (['client', 'expert'].includes(normalized)) {
        db.users[userIndex].role = normalized;
      }
    }
    if (typeof nickname === 'string') {
      db.users[userIndex].nickname = nickname.trim();
    }
    if (typeof bio === 'string') {
      db.users[userIndex].bio = bio;
    }
    
    saveDB(db);
    
    const { password: _, ...userWithoutPass } = db.users[userIndex];
    res.json(userWithoutPass);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Basic health check endpoint for debugging
app.get('/health', (_req, res) => {
  try {
    const db = getDB();
    res.json({ status: 'ok', users: db.users.length, conversations: (db.conversations || []).length });
  } catch {
    res.status(200).json({ status: 'ok' });
  }
});

app.get('/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', ''); // Simple token = userId
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const db = getDB();
    const user = db.users.find(u => u.id === token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    
    const { password: _, ...userWithoutPass } = user;
    res.json(userWithoutPass);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Generic Entity Routes (replacing base44) ---

const entityMap = {
  'Expert': 'experts',
  'Consultation': 'consultations',
  'Playlist': 'playlists',
  'Exercise': 'exercises'
};

app.get('/entities/:type', (req, res) => {
  const type = req.params.type;
  const collection = entityMap[type];
  if (!collection) return res.status(404).json({ error: 'Unknown entity type' });
  
  const db = getDB();
  const list = db[collection] || [];
  
  // Simple sort support ?order_by=-created_date
  const orderBy = req.query.order_by;
  if (orderBy === '-created_date' || orderBy === '-average_rating') {
    // Basic sort implementation
    list.sort((a, b) => {
        if (orderBy === '-created_date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        if (orderBy === '-average_rating') return (b.average_rating || 0) - (a.average_rating || 0);
        return 0;
    });
  }
  
  res.json(list);
});

app.post('/entities/:type', (req, res) => {
  const type = req.params.type;
  const collection = entityMap[type];
  if (!collection) return res.status(404).json({ error: 'Unknown entity type' });
  
  const db = getDB();
  const newItem = {
    id: (collection.charAt(0)) + '_' + Date.now(),
    ...req.body,
    created_at: new Date().toISOString()
  };
  
  // If creating an expert, ensure unique per user email if provided
  if (type === 'Expert' && newItem.email) {
    const existing = db.experts.findIndex(e => e.email === newItem.email);
    if (existing >= 0) {
       db.experts[existing] = { ...db.experts[existing], ...newItem, id: db.experts[existing].id };
       saveDB(db);
       return res.json(db.experts[existing]);
    }
  }

  if (!db[collection]) db[collection] = [];
  db[collection].push(newItem);
  saveDB(db);
  res.json(newItem);
});

app.put('/entities/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const collection = entityMap[type];
  if (!collection) return res.status(404).json({ error: 'Unknown entity type' });
  
  const db = getDB();
  const idx = db[collection].findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  db[collection][idx] = { ...db[collection][idx], ...req.body };
  saveDB(db);
  res.json(db[collection][idx]);
});

// --- Agent/Conversation Routes ---

app.get('/agents/:agent_name/conversations', (req, res) => {
  const { agent_name } = req.params;
  const db = getDB();
  const conversations = (db.conversations || []).filter(c => c.agent_name === agent_name);
  res.json(conversations);
});

app.post('/agents/:agent_name/conversations', (req, res) => {
  const { agent_name } = req.params;
  const { metadata } = req.body;
  const db = getDB();
  const newConv = {
    id: 'c_' + Date.now(),
    agent_name,
    metadata,
    messages: [],
    created_date: new Date().toISOString()
  };
  if (!db.conversations) db.conversations = [];
  db.conversations.push(newConv);
  saveDB(db);
  res.json(newConv);
});

app.get('/conversations/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const conv = (db.conversations || []).find(c => c.id === id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conv);
});

app.post('/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  const message = req.body; // { role, content }
  const db = getDB();
  const idx = (db.conversations || []).findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Conversation not found' });
  
  if (!db.conversations[idx].messages) db.conversations[idx].messages = [];
  const newMessage = { ...message, timestamp: new Date().toISOString() };
  db.conversations[idx].messages.push(newMessage);
  saveDB(db);
  res.json(newMessage);
});

// --- AI Proxy ---

app.get('/', (_req, res) => {
  res.status(200).send('MindfulSpace AI proxy running');
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(400).json({ error: 'Missing OPENAI_API_KEY on server' });
    }
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const model = req.body?.model || 'gpt-4o-mini';
    const temperature = typeof req.body?.temperature === 'number' ? req.body.temperature : 0.7;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages, temperature })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error || data });
    }
    const content = data?.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err?.message });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy & Auth server listening at http://localhost:${PORT}/`);
});
