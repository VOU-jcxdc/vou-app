import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '~/components/navigation/TabBarIcon';
import { Colors } from '~/constants/Colors';
import { useAuth } from '~/context/AuthContext';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href='/sign-in' />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name='(events)'
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='(favorite-events)'
        options={{
          title: 'Favorite Events',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name='(vouchers)'
        options={{
          title: 'Vouchers',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'ticket' : 'ticket-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name='(items)'
        options={{
          title: 'Items',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'construct' : 'construct-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='(profile)'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
