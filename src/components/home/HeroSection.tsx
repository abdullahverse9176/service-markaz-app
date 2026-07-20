import {
  View, Text, TextInput, TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/format';
import { styles } from './HeroSection.styles';

interface HeroSectionProps {
  search: string;
  setSearch: (text: string) => void;
  handleSearch: () => void;
  onClearSearch: () => void;
}

export default function HeroSection({
  search,
  setSearch,
  handleSearch,
  onClearSearch
}: HeroSectionProps) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <View>
      <View style={styles.heroBackground}>
        {/* Top Navbar */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.brandTitle}>
              <Text style={styles.brandTextWhite}>Service </Text>
              <Text style={styles.brandTextGreen}>Markaz</Text>
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.locationText}>Islamabad, PK</Text>
              <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.6)" style={{ marginLeft: 2 }} />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.avatarButton}
            onPress={() => router.push(isAuthenticated ? '/(customer)/profile' : '/(auth)/login')}
            activeOpacity={0.8}
          >
            {isAuthenticated ? (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user?.name ?? '')}</Text>
              </View>
            ) : (
              <View style={[styles.avatar, styles.guestAvatar]}>
                <Ionicons name="person-outline" size={20} color={Colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Welcome Tagline */}
        <View style={styles.welcomeMainRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={styles.greetingText}>
              {isAuthenticated ? `Salam, ${user?.name.split(' ')[0]}` : 'Salam, Guest'}
            </Text>
            <Ionicons name="hand-right" size={15} color="#F59E0B" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.heroTitle}>Find Trusted Service Providers Near You</Text>
        </View>

        {/* Overlapping Search Box */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What service do you need today?"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={onClearSearch} style={styles.clearSearchBtn}>
              <Ionicons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Spacer to handle the search box offset */}
      <View style={styles.searchSpacer} />
    </View>
  );
}
