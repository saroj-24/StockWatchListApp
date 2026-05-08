import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

import type { RootNavProp, Stock } from '../types';

interface FormData {
  symbol: string;
  name: string;
  quantity: string;
  purchasePrice: string;
  currentPrice: string;
}

interface FormErrors {
  symbol?: string;
  name?: string;
  quantity?: string;
  purchasePrice?: string;
  currentPrice?: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  placeholder: string;
  autoCapitalize?:
    | 'none'
    | 'sentences'
    | 'words'
    | 'characters';
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'decimal-pad';
}

export const AddPortfolioScreen: React.FC = () => {
  const { theme, isDark } = useTheme();

  const {
    addPortfolioItem,
    addCustomStock,
    allStocks,
  } = useApp();

  const navigation = useNavigation<RootNavProp>();

  const [form, setForm] = useState<FormData>({
    currentPrice: '',
    name: '',
    purchasePrice: '',
    quantity: '',
    symbol: '',
  });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [isKnownStock, setIsKnownStock] =
    useState(false);

  const update =
    (key: keyof FormData) =>
    (value: string) => {
      setForm(prev => ({
        ...prev,
        [key]: value,
      }));

      setErrors(prev => ({
        ...prev,
        [key]: undefined,
      }));

      if (key === 'symbol') {
        const upperSymbol = value.toUpperCase();

        const found = allStocks.find(
          stock => stock.symbol === upperSymbol,
        );

        if (found) {
          setIsKnownStock(true);

          setForm(prev => ({
            ...prev,
            currentPrice: found.price.toString(),
            name: found.name,
            symbol: upperSymbol,
          }));
        } else {
          setIsKnownStock(false);
        }
      }
    };

  const validate = (): boolean => {
    const validationErrors: FormErrors = {};

    if (!form.symbol.trim()) {
      validationErrors.symbol =
        'Symbol is required';
    }

    if (!form.name.trim()) {
      validationErrors.name =
        'Company name is required';
    }

    if (
      !form.quantity ||
      Number.isNaN(Number(form.quantity)) ||
      Number(form.quantity) <= 0
    ) {
      validationErrors.quantity =
        'Enter a valid quantity';
    }

    if (
      !form.purchasePrice ||
      Number.isNaN(Number(form.purchasePrice)) ||
      Number(form.purchasePrice) <= 0
    ) {
      validationErrors.purchasePrice =
        'Enter a valid price';
    }

    if (
      !form.currentPrice ||
      Number.isNaN(Number(form.currentPrice)) ||
      Number(form.currentPrice) <= 0
    ) {
      validationErrors.currentPrice =
        'Enter a valid price';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const symbol = form.symbol.toUpperCase();
    const price = Number(form.currentPrice);

    const stockExists = allStocks.some(
      stock => stock.symbol === symbol,
    );

    if (!isKnownStock && !stockExists) {
      const newStock: Stock = {
        change: 0,
        changePercent: 0,
        color: '#6366f1',
        high: price,
        isCustom: true,
        low: price,
        marketCap: 'N/A',
        name: form.name,
        open: price,
        price,
        priceHistory: [price],
        priceLabels: [
          new Date().toLocaleDateString(
            'en-US',
            {
              day: 'numeric',
              month: 'short',
            },
          ),
        ],
        sector: 'Custom',
        symbol,
        volume: 0,
        volumeHistory: [0],
      };

      addCustomStock(newStock);
    }

    addPortfolioItem({
      currentPrice: price,
      dateOfPurchase:
        date.toISOString().split('T')[0],
      name: form.name,
      purchasePrice: Number(
        form.purchasePrice,
      ),
      quantity: Number(form.quantity),
      symbol,
    });

    navigation.goBack();
  };

  const fields: FieldConfig[] = [
    {
      autoCapitalize: 'characters',
      key: 'symbol',
      label: 'Ticker Symbol',
      placeholder: 'e.g. AAPL',
    },
    {
      key: 'name',
      label: 'Company Name',
      placeholder: 'e.g. Apple Inc.',
    },
    {
      keyboardType: 'numeric',
      key: 'quantity',
      label: 'Quantity',
      placeholder: 'e.g. 10',
    },
    {
      keyboardType: 'decimal-pad',
      key: 'purchasePrice',
      label: 'Purchase Price',
      placeholder: 'e.g. 150.00',
    },
    {
      keyboardType: 'decimal-pad',
      key: 'currentPrice',
      label: 'Current Price',
      placeholder: 'e.g. 175.64',
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.headerBackground,
        },
      ]}
    >
      <StatusBar
        backgroundColor={
          theme.headerBackground
        }
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor:
              theme.headerBackground,
            borderBottomColor:
              theme.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            color={theme.text}
            name="arrow-back"
            size={24}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.text,
            },
          ]}
        >
          Add Portfolio Stock
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={[
          styles.scroll,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        {form.symbol.length >= 1 &&
          !isKnownStock && (
            <View
              style={[
                styles.hintBanner,
                {
                  backgroundColor:
                    `${theme.primary}18`,
                  borderColor:
                    `${theme.primary}40`,
                },
              ]}
            >
              <MaterialIcons
                color={theme.primary}
                name="info-outline"
                size={16}
              />

              <Text
                style={[
                  styles.hintText,
                  {
                    color: theme.primary,
                  },
                ]}
              >
                New symbol — this stock
                will be added to your
                Home list.
              </Text>
            </View>
          )}

        {fields.map(field => {
          const error =
            errors[
              field.key as keyof FormErrors
            ];

          return (
            <View
              key={field.key}
              style={styles.fieldGroup}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                {field.label}
              </Text>

              <TextInput
                autoCapitalize={
                  field.autoCapitalize ??
                  'none'
                }
                keyboardType={
                  field.keyboardType ??
                  'default'
                }
                onChangeText={update(
                  field.key,
                )}
                placeholder={
                  field.placeholder
                }
                placeholderTextColor={
                  theme.textMuted
                }
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      theme.inputBackground,
                    borderColor: error
                      ? theme.danger
                      : theme.border,
                    color: theme.text,
                  },
                ]}
                value={form[field.key]}
              />

              {error && (
                <Text
                  style={[
                    styles.error,
                    {
                      color:
                        theme.danger,
                    },
                  ]}
                >
                  {error}
                </Text>
              )}
            </View>
          );
        })}

        <View style={styles.fieldGroup}>
          <Text
            style={[
              styles.label,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Date of Purchase
          </Text>

          <TouchableOpacity
            onPress={() =>
              setShowDatePicker(true)
            }
            style={[
              styles.datePicker,
              {
                backgroundColor:
                  theme.inputBackground,
                borderColor:
                  theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.dateText,
                {
                  color: theme.text,
                },
              ]}
            >
              {date.toLocaleDateString(
                'en-US',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                },
              )}
            </Text>

            <MaterialIcons
              color={theme.textMuted}
              name="calendar-today"
              size={20}
            />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            maximumDate={new Date()}
            mode="date"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);

              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            value={date}
          />
        )}

        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
        >
          <MaterialIcons
            color="#ffffff"
            name="check"
            size={20}
          />

          <Text style={styles.saveButtonText}>
            Save Stock
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 6,
    padding: 16,
    paddingBottom: 40,
  },

  datePicker: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  dateText: {
    fontSize: 15,
  },

  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  fieldGroup: {
    marginBottom: 12,
  },

  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 55,
  },

  headerSpacer: {
    width: 24,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  hintBanner: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    padding: 12,
  },

  hintText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },

  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  safeArea: {
    flex: 1,
  },

  saveButton: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    marginTop: 8,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  scroll: {
    flex: 1,
  },
});