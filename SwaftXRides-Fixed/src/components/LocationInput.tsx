// src/components/LocationInput.tsx
// React Native port of the web LocationInput component

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Location, searchLocations } from '../lib/locations';

interface Props {
  label: string;
  value: Location | null;
  onChange: (loc: Location | null) => void;
  icon: 'pickup' | 'drop';
  showCurrentLocation?: boolean;
}

const LocationInput = ({ label, value, onChange, icon, showCurrentLocation }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    setResults(searchLocations(text));
  };

  const handleSelect = (loc: Location) => {
    onChange(loc);
    setQuery('');
    setResults([]);
    setModalVisible(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setResults([]);
  };

  const iconColor = icon === 'pickup' ? COLORS.primary : COLORS.destructive;
  const iconBg = icon === 'pickup' ? 'rgba(0,217,255,0.12)' : 'rgba(239,68,68,0.12)';

  return (
    <>
      {/* Trigger row */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.75}
      >
        {/* Icon dot */}
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <View style={[styles.dot, { backgroundColor: iconColor }]} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.labelText}>{label}</Text>
          {value ? (
            <Text style={styles.valueText} numberOfLines={1}>
              {value.name}, {value.city}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>Search {label.toLowerCase()} location…</Text>
          )}
        </View>

        {value && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Search modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <View style={styles.searchBar}>
            <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
              <View style={[styles.dot, { backgroundColor: iconColor }]} />
            </View>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={handleSearch}
              placeholder={`Search ${label.toLowerCase()} location…`}
              placeholderTextColor={COLORS.muted}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              showCurrentLocation ? (
                <TouchableOpacity style={styles.resultRow} activeOpacity={0.7}>
                  <View style={[styles.resultIcon, { backgroundColor: 'rgba(0,217,255,0.12)' }]}>
                    <Text style={{ fontSize: 14 }}>📍</Text>
                  </View>
                  <View>
                    <Text style={[styles.resultName, { color: COLORS.primary }]}>
                      {isLocating ? 'Locating…' : 'Use Current Location'}
                    </Text>
                    <Text style={styles.resultArea}>Via GPS</Text>
                  </View>
                  {isLocating && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.resultIcon}>
                  <Text style={{ fontSize: 14 }}>📌</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.resultArea} numberOfLines={1}>{item.area}, {item.city}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              query.length >= 2 ? (
                <Text style={styles.emptyText}>No locations found</Text>
              ) : (
                <Text style={styles.emptyText}>Type at least 2 characters to search</Text>
              )
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  labelText: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  placeholderText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  clearBtn: {
    fontSize: 14,
    color: COLORS.muted,
    paddingHorizontal: 4,
  },
  // Modal styles
  modal: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  modalClose: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    margin: SPACING.md,
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.foreground,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30,41,59,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  resultArea: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md + 36 + SPACING.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 13,
    marginTop: SPACING.xl,
  },
});

export default LocationInput;
