import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Image, Alert, Linking
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useBusiness } from '@/hooks/useBusinesses';
import type { Business } from '@/types/business';

const DUMMY_PROVIDERS: Business[] = [
  {
    _id: 'dummy-1',
    owner: 'owner-1',
    name: 'Ali Electric Works',
    email: 'ali@example.com',
    phone: '+923001234567',
    whatsapp: '+923001234567',
    title: 'Senior Electrician Specialist',
    category: 'Electrician',
    city: 'Rawalpindi',
    area: 'Rawalpindi',
    about: 'Expert electrical installation, repairs and emergency services. 10+ years of experience in residential and commercial wiring, appliances repair, DB box installation and short circuit troubleshooting. Available 24/7 for emergency electrical issues.',
    services: ['Home Wiring', 'Appliance Repair', 'AC Installation', 'Ceiling Fan Fix', 'UPS Installation', 'Short Circuit Fix'],
    experience: 10,
    completedProjects: 132,
    specializations: ['Industrial Panels', 'Home Automation', 'Safety Auditing'],
    serviceAreas: ['Saddar', 'Westridge', 'Adyala', 'Bahria Town'],
    pricing: { calloutFee: '500', hourlyRate: '1000', minCharge: '500' },
    availability: 'Available',
    responseTime: '5 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    rating: 4.9,
    reviewsCount: 132,
    verification: true,
    featured: true,
    viewCount: 1200,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'dummy-2',
    owner: 'owner-2',
    name: 'A1 Plumbing Services',
    email: 'plumber@example.com',
    phone: '+923007654321',
    whatsapp: '+923007654321',
    title: 'Professional Plumbing & Leakage Fixes',
    category: 'Plumber',
    city: 'Rawalpindi',
    area: 'Islamabad',
    about: 'Professional plumbing services for homes and offices. We specialize in water tank cleaning, pipeline leakage repair, washroom renovation, faucet installation, water pump installation and geyser repairs. Reliable service with quality guarantees.',
    services: ['Leakage Repair', 'Bathroom Renovations', 'Water Pump Repair', 'Drain Cleaning', 'Geyser Service', 'Tank Cleaning'],
    experience: 8,
    completedProjects: 156,
    specializations: ['Kitchen Fitting', 'Commercial Sewage', 'Hydraulic Systems'],
    serviceAreas: ['Blue Area', 'F-6', 'G-11', 'Rawal Town', 'Saddar'],
    pricing: { calloutFee: '400', hourlyRate: '800', minCharge: '400' },
    availability: 'Available',
    responseTime: '7 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    rating: 4.8,
    reviewsCount: 98,
    verification: true,
    featured: false,
    viewCount: 850,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'dummy-3',
    owner: 'owner-3',
    name: 'Cool Care AC Services',
    email: 'ac@example.com',
    phone: '+923001122334',
    whatsapp: '+923001122334',
    title: 'AC Maintenance & Air Conditioning Repair',
    category: 'AC Repair',
    city: 'Rawalpindi',
    area: 'Saddar, Rawalpindi',
    about: 'Your trusted partner for all cooling needs. We install, repair, and service split units, window ACs, and inverter models. Special services include gas top-up, deep pressure washing, compressor replacements, and cooling coil repairs. Super fast response.',
    services: ['AC Servicing', 'Gas Charging', 'Inverter AC Repair', 'Split AC Installation', 'Compressor Fix', 'Leaks Check'],
    experience: 12,
    completedProjects: 112,
    specializations: ['Inverter Diagnostics', 'Central Chillers', 'Thermostat Setup'],
    serviceAreas: ['Lalkurti', 'Saddar', 'Chaklala Scheme', 'Peshawar Road'],
    pricing: { calloutFee: '600', hourlyRate: '1200', minCharge: '600' },
    availability: 'Available',
    responseTime: '10 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    rating: 4.7,
    reviewsCount: 76,
    verification: true,
    featured: true,
    viewCount: 940,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'dummy-4',
    owner: 'owner-4',
    name: 'Sparkle Cleaners',
    email: 'cleaners@example.com',
    phone: '+923004455667',
    whatsapp: '+923004455667',
    title: 'Premium Home & Office Cleaning Solutions',
    category: 'Cleaning',
    city: 'Rawalpindi',
    area: 'Bahria Town, Rawalpindi',
    about: 'Expert cleaning crew ready to make your space shine. We provide deep house cleaning, post-construction cleaning, office janitorial services, sofa and carpet dry cleaning, glass window cleaning, and customized hygienic disinfection protocols.',
    services: ['Deep House Clean', 'Sofa Washing', 'Carpet Vacuuming', 'Office Janitor', 'Disinfection Service', 'Window Wash'],
    experience: 5,
    completedProjects: 84,
    specializations: ['Post-Construction Clean', 'Deep Sanitization', 'Upholstery Care'],
    serviceAreas: ['Bahria Town', 'DHA Phase 1-5', 'PWD', 'Media Town'],
    pricing: { calloutFee: '300', hourlyRate: '600', minCharge: '300' },
    availability: 'Available',
    responseTime: '15 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    rating: 4.6,
    reviewsCount: 64,
    verification: true,
    featured: false,
    viewCount: 512,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
  }
];

interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
}

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  
  const isDummy = id?.startsWith('dummy-');
  const dummyBusiness = isDummy ? DUMMY_PROVIDERS.find(b => b._id === id) : null;
  const { data: liveData } = useBusiness(isDummy ? '' : (id ?? ''));
  const business = isDummy ? dummyBusiness : liveData?.data;

  const businessName = business?.name ?? name ?? 'Specialist';
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        _id: 'welcome-1',
        text: `Salam! Main ${businessName} se baat kar raha hoon. Aapko kis service ki zaroorat hai?`,
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        user: { _id: 'provider', name: businessName },
      }
    ]);
  }, [businessName]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      _id: Math.random().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: { _id: 'customer', name: 'You' },
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Trigger simulated reply after a delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: Message = {
        _id: Math.random().toString(),
        text: `Ji bilkul, main is kaam ke liye available hoon. Aap apna address aur convenience timing share kar dein, main jaldi physical inspection ke liye visit kar leta hoon.`,
        createdAt: new Date(),
        user: { _id: 'provider', name: businessName },
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 2500);
  };

  // Scroll to bottom when messages list updates
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.user._id === 'customer';
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowRight : styles.messageRowLeft]}>
        {!isMe && (
          <View style={styles.avatarWrap}>
            {business?.profileImage ? (
              <Image source={{ uri: business.profileImage }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{businessName.charAt(0).toUpperCase()}</Text>
            )}
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextRight : styles.messageTextLeft]}>
            {item.text}
          </Text>
          <View style={styles.bubbleFooter}>
            <Text style={[styles.timeText, isMe ? styles.timeTextRight : styles.timeTextLeft]}>
              {formatMessageTime(item.createdAt)}
            </Text>
            {isMe && <Ionicons name="checkmark-done" size={13} color="rgba(255,255,255,0.8)" style={{ marginLeft: 2 }} />}
          </View>
        </View>
      </View>
    );
  };

  const handleCall = () => {
    if (!business?.phone) {
      Alert.alert('Call', 'Initiating call with provider...');
      return;
    }
    Linking.openURL(`tel:${business.phone}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <View style={styles.headerAvatar}>
            {business?.profileImage ? (
              <Image source={{ uri: business.profileImage }} style={styles.headerAvatarImg} />
            ) : (
              <Text style={styles.headerAvatarText}>{businessName.charAt(0).toUpperCase()}</Text>
            )}
            <View style={styles.pulseDot} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName} numberOfLines={1}>{businessName}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.headerStatus}>Active Now</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.headerCallBtn} onPress={handleCall}>
          <Ionicons name="call" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area */}
      <KeyboardAvoidingView 
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>TODAY</Text>
            </View>
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <View style={styles.avatarWrap}>
                  {business?.profileImage ? (
                    <Image source={{ uri: business.profileImage }} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.avatarText}>{businessName.charAt(0).toUpperCase()}</Text>
                  )}
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.dotBubble}>
                    <View style={[styles.typingDot, styles.dot1]} />
                    <View style={[styles.typingDot, styles.dot2]} />
                    <View style={[styles.typingDot, styles.dot3]} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    height: Platform.OS === 'ios' ? 64 : 68,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: Platform.OS === 'android' ? 12 : 0,
    ...Shadow.sm,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: 4,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  pulseDot: {
    position: 'absolute',
    bottom: 0,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  headerName: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    maxWidth: 180,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  headerStatus: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  headerCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  keyboard: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 24,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginVertical: Spacing.md,
  },
  dateSeparatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: Spacing.xs,
    maxWidth: '100%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    paddingRight: 64, // Enforces 64px spacing from the right edge
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    paddingLeft: 64, // Enforces 64px spacing from the left edge
  },
  avatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    ...Shadow.sm,
    flexShrink: 1,
  },
  bubbleLeft: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleRight: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: Typography.fontSize.xs + 1,
    lineHeight: 19,
    fontFamily: Typography.fontFamily.regular,
  },
  messageTextLeft: {
    color: Colors.textPrimary,
  },
  messageTextRight: {
    color: Colors.white,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.regular,
  },
  timeTextLeft: {
    color: Colors.textMuted,
  },
  timeTextRight: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  typingBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
  },
  dotBubble: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    height: 12,
    justifyContent: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  dot1: { opacity: 0.8 },
  dot2: { opacity: 0.5 },
  dot3: { opacity: 0.3 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: Spacing.sm,
    ...Shadow.md,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.55,
  },
});
