import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../context/ThemeContext';
import { AddPortfolioScreen } from '../screen/AddPortfolioScreen';
import { EditPortfolioScreen } from '../screen/EditPortfolioScreen';
import { HomeScreen } from '../screen/HomeScreen';
import { PortfolioScreen } from '../screen/PortfolioScreen';
import { SettingsScreen } from '../screen/SettingsScreen';
import { StockDetailScreen } from '../screen/StockDetailScreen';
import { WatchlistScreen } from '../screen/WatchlistScreen';
import type { RootStackParamList, TabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<
  string,
  {
    active: string;
    inactive: string;
  }
> = {
  Home: {
    active: 'home',
    inactive: 'home',
  },
  Watchlist: {
    active: 'star',
    inactive: 'star-border',
  },
  Portfolio: {
    active: 'account-balance-wallet',
    inactive: 'account-balance-wallet',
  },
  Settings: {
    active: 'settings',
    inactive: 'settings',
  },
};

const MainTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;

          return (
            <MaterialIcons
              color={color}
              name={iconName}
              size={size}
            />
          );
        },

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,

        tabBarStyle: [
          styles.tabBarStyle,
          {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.border,
          },
        ],

        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        component={HomeScreen}
        name="Home"
      />

      <Tab.Screen
        component={WatchlistScreen}
        name="Watchlist"
      />

      <Tab.Screen
        component={PortfolioScreen}
        name="Portfolio"
      />

      <Tab.Screen
        component={SettingsScreen}
        name="Settings"
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,

        colors: {
          background: theme.background,
          border: theme.border,
          card: theme.surface,
          notification: theme.danger,
          primary: theme.primary,
          text: theme.text,
        },

        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },

          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },

          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },

          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}
      >
        <Stack.Screen
          component={MainTabs}
          name="MainTabs"
        />

        <Stack.Screen
          component={StockDetailScreen}
          name="StockDetail"
        />

        <Stack.Screen
          component={AddPortfolioScreen}
          name="AddPortfolio"
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        <Stack.Screen
          component={EditPortfolioScreen}
          name="EditPortfolio"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  tabBarStyle: {
    borderTopWidth: 0.5,
    height: 62,
    paddingBottom: Platform.OS === 'ios' ? 12 : 6,
    paddingTop: 6,
  },
});