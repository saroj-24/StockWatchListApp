import React from 'react';
import {
  View, Text, Switch, StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
  color?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, title, subtitle, right, color }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: (color || theme.primary) + '20' }]}>
        <MaterialIcons name={icon} size={20} color={color || theme.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
};

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.headerBackground} />
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <SettingRow
            icon="dark-mode"
            title="Dark Mode"
            subtitle={isDark ? 'Dark theme active' : 'Light theme active'}
            color={isDark ? '#7C6AF7' : '#FF9800'}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: theme.primaryLight }}
                thumbColor={isDark ? theme.primary : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* App Info Section */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <SettingRow
            icon="info-outline"
            title="Version"
            subtitle="1.0.0"
            right={<Text style={[styles.rightText, { color: theme.textMuted }]}>1.0.0</Text>}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 54,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rightText: {
    fontSize: 14,
  },
  symbolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symbolChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  symbolChipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});