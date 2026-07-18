import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

// Simple icon components using text (can replace with a proper icon lib)
const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <View>
      {/* Using emoji as placeholder — replace with lucide-react-native if desired */}
    </View>
  </View>
);

export default function CustomerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIconEmoji emoji="🏠" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabIconEmoji emoji="🔍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Near Me',
          tabBarIcon: ({ color }) => <TabIconEmoji emoji="📍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: 'My Leads',
          tabBarIcon: ({ color }) => <TabIconEmoji emoji="📋" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIconEmoji emoji="👤" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIconEmoji({ emoji, color }: { emoji: string; color: string }) {
  return (
    <View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: 4,
    height: 60,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryMuted,
  },
});
