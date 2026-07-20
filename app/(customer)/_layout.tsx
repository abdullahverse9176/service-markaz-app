import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface TabBarItemProps {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

function TabBarItem({ name, focusedName, label, focused }: TabBarItemProps) {
  return (
    <View style={styles.tabItemContainer}>
      <Ionicons 
        name={focused ? focusedName : name} 
        size={20} 
        color={focused ? Colors.primary : Colors.textSecondary} 
      />
      <Text style={[styles.tabLabelText, { color: focused ? Colors.primary : Colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

export default function CustomerLayout() {
  return (
    <Tabs
      safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        },
        tabBarIconStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarItem 
              name="home-outline" 
              focusedName="home" 
              label="Home"
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabBarItem 
              name="search-outline" 
              focusedName="search" 
              label="Search"
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          href: null,
          title: 'Services',
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Near Me',
          tabBarIcon: ({ focused }) => (
            <TabBarItem 
              name="location-outline" 
              focusedName="location" 
              label="Near Me"
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
          tabBarIcon: ({ focused }) => (
            <TabBarItem 
              name="document-text-outline" 
              focusedName="document-text" 
              label="My Leads"
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarItem 
              name="person-outline" 
              focusedName="person" 
              label="Profile"
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
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    height: 68,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 70,
  },
  tabLabelText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    fontFamily: 'Inter-Bold',
  },
});
