import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Markdown from 'react-native-markdown-display';

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || 'Function';
  const status = toolCall?.status || 'pending';
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try { return typeof results === 'string' ? JSON.parse(results) : results; }
    catch { return results; }
  })();

  const isError = results && (
    (typeof results === 'string' && /error|failed/i.test(results)) ||
    (parsedResults?.success === false)
  );

  const statusConfig = {
    pending: { icon: Ionicons, iconName: 'time-outline', color: '#94A3B8', text: 'Pending' },
    running: { icon: MaterialIcons, iconName: 'autorenew', color: '#7C3AED', text: 'Running...' },
    completed: isError ? 
      { icon: MaterialIcons, iconName: 'error-outline', color: '#DC2626', text: 'Failed' } :
      { icon: MaterialIcons, iconName: 'check-circle-outline', color: '#16A34A', text: 'Success' },
  }[status] || { icon: Feather, iconName: 'zap', color: '#7C3AED', text: '' };

  const Icon = statusConfig.icon;

  return (
    <View style={{ marginTop: 4 }}>
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={[styles.funcButton, expanded && { backgroundColor: '#F3E8FF' }]}
      >
        <Icon name={statusConfig.iconName} size={16} color={statusConfig.color} />
        <Text style={styles.funcText}>{name.split('.').reverse().join(' ').toLowerCase()}</Text>
        {statusConfig.text ? <Text style={[styles.funcStatus, isError && { color: '#DC2626' }]}> • {statusConfig.text}</Text> : null}
      </TouchableOpacity>

      {expanded && parsedResults && (
        <View style={styles.funcContent}>
          {toolCall.arguments_string && (
            <View style={{ marginBottom: 4 }}>
              <Text style={styles.label}>Parameters:</Text>
              <ScrollView horizontal>
                <Text style={styles.code}>
                  {toolCall.arguments_string}
                </Text>
              </ScrollView>
            </View>
          )}
          <View>
            <Text style={styles.label}>Result:</Text>
            <ScrollView horizontal>
              <Text style={styles.code}>
                {typeof parsedResults === 'object' ? JSON.stringify(parsedResults, null, 2) : parsedResults}
              </Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.bubbleContainer, isUser ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>AI</Text>
        </View>
      )}
      <View style={{ maxWidth: '85%' }}>
        {message.content && (
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            {isUser ? (
              <Text style={styles.userText}>{message.content}</Text>
            ) : (
              <Markdown style={{ body: { color: '#374151', fontSize: 14 } }}>
                {message.content}
              </Markdown>
            )}
          </View>
        )}

        {message.tool_calls?.length > 0 && (
          <View style={{ marginTop: 4 }}>
            {message.tool_calls.map((toolCall, idx) => (
              <FunctionDisplay key={idx} toolCall={toolCall} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: { flexDirection: 'row', marginVertical: 4, gap: 8 },
  aiAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
  bubble: { borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  userBubble: { backgroundColor: '#7C3AED' },
  aiBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#EDE9FE' },
  userText: { color: '#fff', fontSize: 14 },
  funcButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EDE9FE' },
  funcText: { color: '#374151', fontSize: 12 },
  funcStatus: { color: '#6B7280', fontSize: 12 },
  funcContent: { marginTop: 4, marginLeft: 8, paddingLeft: 8, borderLeftWidth: 2, borderColor: '#DDD', gap: 4 },
  label: { fontSize: 10, color: '#6B7280', marginBottom: 2 },
  code: { fontFamily: 'monospace', backgroundColor: '#F3E8FF', padding: 4, fontSize: 12, borderRadius: 4 }
});
// End of MessageBubble.js