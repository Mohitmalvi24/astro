import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { chatApi, ChatMessageItem } from '../api/chat';
import { AstroLogo } from '../components/AstroLogo';

// Line-style up arrow icon for send button
const SendIcon = ({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

export const ChatScreen = () => {
  const { user, logout } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await chatApi.getHistory();
      setMessages(data.results || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    setInputText('');
    
    // Optimistically add user message to list
    const tempUserMsg: ChatMessageItem = {
      id: Date.now(),
      sender_type: 'user',
      message: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await chatApi.sendMessage(text);
      // Replace optimistic state with server response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...filtered, res.user_message, res.astro_message];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessageItem }) => {
    const isUser = item.sender_type === 'user';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.astroRow]}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.astroBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.astroMessageText]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AstroLogo size={32} />
          <Text style={styles.headerTitle}>Astro</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatArea}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoadingHistory ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListFooterComponent={
              isSending ? (
                <View style={[styles.messageRow, styles.astroRow]}>
                  <View style={[styles.bubble, styles.astroBubble, styles.typingBubble]}>
                    <ActivityIndicator size="small" color={theme.colors.textSecondary} />
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Bottom Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.pillInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask Astro anything about space & stars..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.disabledSendButton,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
            activeOpacity={0.8}
          >
            <SendIcon color={theme.colors.background} size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  signOutText: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 13,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 6,
  },
  chatArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  astroRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.card,
  },
  // Outgoing messages: terracotta bubble (#B0472B) with cream text, right-aligned, sharp bottom-right
  userBubble: {
    backgroundColor: theme.colors.chatBubbleOutgoingBg,
    borderBottomRightRadius: 2,
  },
  // Incoming messages: light beige bubble (#EDE7DA), left-aligned, sharp bottom-left
  astroBubble: {
    backgroundColor: theme.colors.chatBubbleIncoming,
    borderBottomLeftRadius: 2,
  },
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: theme.colors.chatBubbleOutgoingText,
  },
  astroMessageText: {
    color: theme.colors.textPrimary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 10,
  },
  pillInput: {
    flex: 1,
    backgroundColor: theme.colors.chatBubbleIncoming,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 15,
    color: theme.colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: theme.borderRadius.circular,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    opacity: 0.5,
  },
});
