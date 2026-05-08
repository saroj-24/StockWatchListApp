import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, SafeAreaView, Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { RootNavProp, EditPortfolioRouteProp } from '../types';

export const EditPortfolioScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { editPortfolioItem } = useApp();
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<EditPortfolioRouteProp>();
  const { item } = route.params;

  const [form, setForm] = useState({
    symbol: item.symbol,
    name: item.name,
    quantity: item.quantity.toString(),
    purchasePrice: item.purchasePrice.toString(),
    currentPrice: item.currentPrice.toString(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date(item.dateOfPurchase));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const update = (key: string) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) e.quantity = 'Enter a valid quantity';
    if (!form.purchasePrice || isNaN(Number(form.purchasePrice))) e.purchasePrice = 'Enter a valid price';
    if (!form.currentPrice || isNaN(Number(form.currentPrice))) e.currentPrice = 'Enter a valid price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;
    editPortfolioItem({
      ...item,
      name: form.name,
      quantity: Number(form.quantity),
      purchasePrice: Number(form.purchasePrice),
      currentPrice: Number(form.currentPrice),
      dateOfPurchase: date.toISOString().split('T')[0],
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.headerBackground} />
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Portfolio Stock</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Symbol (read-only) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Ticker Symbol</Text>
          <View style={[styles.readOnly, { backgroundColor: theme.border }]}>
            <Text style={[styles.readOnlyText, { color: theme.text }]}>{form.symbol}</Text>
          </View>
        </View>

        {([
          { key: 'name', label: 'Company Name', placeholder: '' },
          { key: 'quantity', label: 'Quantity', placeholder: '', keyboardType: 'numeric' },
          { key: 'purchasePrice', label: 'Purchase Price', placeholder: '', keyboardType: 'decimal-pad' },
          { key: 'currentPrice', label: 'Current Price', placeholder: '', keyboardType: 'decimal-pad' },
        ] as any[]).map(field => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{field.label}</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.inputBackground, color: theme.text,
                borderColor: errors[field.key] ? theme.danger : theme.border,
              }]}
              value={form[field.key as keyof typeof form]}
              onChangeText={update(field.key)}
              keyboardType={field.keyboardType || 'default'}
              placeholder={field.placeholder}
              placeholderTextColor={theme.textMuted}
            />
            {errors[field.key] ? <Text style={[styles.error, { color: theme.danger }]}>{errors[field.key]}</Text> : null}
          </View>
        ))}

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Date of Purchase</Text>
          <TouchableOpacity
            style={[styles.datePicker, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            <MaterialIcons name="calendar-today" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, d) => { setShowDatePicker(false); if (d) setDate(d); }}
          />
        )}

        <TouchableOpacity style={[styles.updateBtn, { backgroundColor: theme.primary }]} onPress={handleUpdate}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.updateBtnText}>Update Stock</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 55,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 6,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readOnly: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  datePicker: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 15,
  },
  updateBtn: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  updateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});