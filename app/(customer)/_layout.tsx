import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  color: any;
  focused: boolean;
}

function TabBarIcon({ name, focusedName, color, focused }: TabBarIconProps) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={focused ? focusedName : name} size={20} color={color} />
    </View>
  );
}

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
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="home-outline" 
              focusedName="home" 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="search-outline" 
              focusedName="search" 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Near Me',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="location-outline" 
              focusedName="location" 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          href: null,
          title: 'My Leads',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="document-text-outline" 
              focusedName="document-text" 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="person-outline" 
              focusedName="person" 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryMuted,
  },
});
