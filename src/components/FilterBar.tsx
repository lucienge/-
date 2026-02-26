import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface FilterItem {
  key: string;
  label: string;
  isNew?: boolean;
}

interface FilterBarProps {
  filters: FilterItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, activeKey, onChange }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {filters.map((filter) => {
          const active = filter.key === activeKey;
          return (
            <Pressable
              key={filter.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(filter.key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{filter.label}</Text>
              {filter.isNew ? (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E9EEF7',
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  content: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: '#F2F5FA',
    borderRadius: 18,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: '#E6F3FF',
  },
  chipText: {
    color: '#344056',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#0575E6',
  },
  newBadge: {
    backgroundColor: '#FF4D4F',
    borderRadius: 9,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default FilterBar;
