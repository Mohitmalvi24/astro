import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';
import { chatApi, ChatMessageItem } from '../api/chat';

const BackIcon = ({ color = '#0F172A', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const MoreVerticalIcon = ({ color = '#0F172A', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="5" r="1.5" fill={color} />
    <Circle cx="12" cy="19" r="1.5" fill={color} />
  </Svg>
);

const ClockIcon = ({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const SendUpIcon = ({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

const PlusIcon = ({ color = '#64748B', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const UserAvatarPlaceholder = ({ size = 40, color = '#DBEAFE', iconColor = '#2563EB' }: { size?: number; color?: string; iconColor?: string }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  </View>
);

interface Message {
  id: string;
  sender: 'user' | 'astrologer';
  text: string;
  time: string;
  status?: string;
}

const formatMessageTime = (dateString?: string) => {
  const d = dateString ? new Date(dateString) : new Date();
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const SUGGESTIONS = [
  'Shaadi kab hogi?',
  'Koi upay batayein',
  'Paisa kab aayega?',
  'Health kaisa rahega?',
];

export const ChatRoomScreen = ({ route, navigation }: any) => {
  const astrologerName = route?.params?.astrologerName || 'Meera';
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await chatApi.getHistory();
      if (data && data.results) {
        const loaded: Message[] = data.results.map((item: ChatMessageItem) => ({
          id: item.id.toString(),
          sender: item.sender_type === 'user' ? 'user' : 'astrologer',
          text: item.message,
          time: formatMessageTime(item.timestamp),
          status: item.sender_type === 'user' ? 'Seen' : undefined,
        }));
        setMessages(loaded);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const tempId = Date.now().toString();
    const newMsg: Message = {
      id: tempId,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: 'Sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await chatApi.sendMessage(text);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        const serverUserMsg: Message = {
          id: res.user_message.id.toString(),
          sender: 'user',
          text: res.user_message.message,
          time: formatMessageTime(res.user_message.timestamp),
          status: 'Seen',
        };
        const serverAstroMsg: Message = {
          id: res.astro_message.id.toString(),
          sender: 'astrologer',
          text: res.astro_message.message,
          time: formatMessageTime(res.astro_message.timestamp),
        };
        return [...filtered, serverUserMsg, serverAstroMsg];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <UserAvatarPlaceholder size={40} color="#DBEAFE" iconColor="#2563EB" />
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.astrologerInfo}>
          <Text style={styles.astrologerName}>{astrologerName}</Text>
          <Text style={[styles.typingSubtext, !isTyping && styles.onlineSubtext]}>
            {isTyping ? 'typing...' : 'Online'}
          </Text>
        </View>

        {/* Pricing / Wallet Pill */}
        <View style={styles.pricingPill}>
          <Text style={styles.rateText}>₹xx/min</Text>
          <Text style={styles.walletText}>Wallet ₹xx</Text>
        </View>

        <TouchableOpacity style={styles.menuBtn}>
          <MoreVerticalIcon size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Red Countdown Banner */}
      <View style={styles.countdownBanner}>
        <View style={styles.bannerLeft}>
          <ClockIcon size={18} color="#FFFFFF" />
          <Text style={styles.bannerText}>Time left <Text style={styles.boldTimer}>04:32</Text></Text>
        </View>
        <TouchableOpacity style={styles.endChatButton} onPress={() => navigation.goBack()}>
          <Text style={styles.endChatText}>End chat</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Today Divider Pill */}
          <View style={styles.dateBadgeContainer}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>Today</Text>
            </View>
          </View>

          {/* User Birth Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsHeader}>YOUR DETAILS</Text>
            <View style={styles.detailsRow}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Born</Text>
                <Text style={styles.detailValue}>DD Mon YYYY</Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>HH:MM</Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Place</Text>
                <Text style={styles.detailValue}>City</Text>
              </View>
            </View>
          </View>

          {/* Loading indicator */}
          {isLoadingHistory && (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          )}

          {/* Messages */}
          {messages.map((item) => {
            const isUser = item.sender === 'user';
            return (
              <View key={item.id} style={[styles.messageRow, isUser ? styles.userRow : styles.astrologerRow]}>
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.astrologerBubble]}>
                  <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.astrologerMessageText]}>
                    {item.text}
                  </Text>
                </View>
                <View style={[styles.metaRow, isUser ? styles.userMeta : styles.astroMeta]}>
                  <Text style={styles.metaTime}>{item.time}</Text>
                  {isUser && item.status && (
                    <Text style={styles.metaStatus}> · {item.status}</Text>
                  )}
                </View>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.typingCard}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          )}
        </ScrollView>

        {/* Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionScroll}>
            {SUGGESTIONS.map((chip, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chipButton}
                onPress={() => handleSend(chip)}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Bar */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.plusIconBtn}>
            <PlusIcon size={22} color="#64748B" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your question..."
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <SendUpIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  astrologerInfo: {
    flex: 1,
  },
  astrologerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  typingSubtext: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  onlineSubtext: {
    color: '#10B981',
    fontWeight: '500',
  },
  pricingPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  rateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  walletText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
  },
  menuBtn: {
    padding: 6,
  },
  countdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C91C36', // Crimson Red
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  boldTimer: {
    fontWeight: '800',
    fontSize: 16,
  },
  endChatButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  endChatText: {
    color: '#C91C36',
    fontWeight: '700',
    fontSize: 12,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  dateBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateBadgeText: {
    color: '#4338CA',
    fontSize: 11,
    fontWeight: '600',
  },
  detailsCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  detailsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  messageRow: {
    marginBottom: 14,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  astrologerRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#2563EB', // Royal Blue
    borderBottomRightRadius: 4,
  },
  astrologerBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  astrologerMessageText: {
    color: '#0F172A',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  userMeta: {
    justifyContent: 'flex-end',
  },
  astroMeta: {
    justifyContent: 'flex-start',
  },
  metaTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  metaStatus: {
    fontSize: 11,
    color: '#94A3B8',
  },
  typingCard: {
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
    marginBottom: 10,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#475569',
  },
  suggestionsContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  suggestionScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chipButton: {
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  plusIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
