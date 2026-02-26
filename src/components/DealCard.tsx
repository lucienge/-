import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { DealItem } from '../mock/deals';

interface DealCardProps {
  deal: DealItem;
  onPress?: (deal: DealItem) => void;
}

const currency = (value: number) =>
  `NT$ ${new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0,
  }).format(value)}`;

export const DealCard: React.FC<DealCardProps> = ({ deal, onPress }) => (
  <Pressable style={styles.card} onPress={() => onPress?.(deal)}>
    <Image source={{ uri: deal.image }} style={styles.cover} />
    <View style={styles.body}>
      <View style={styles.tagsRow}>
        {deal.tags.map((tag) => (
          <View key={`${deal.id}-${tag}`} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {deal.title}
      </Text>
      <Text style={styles.meta}>{`${deal.destination}・${deal.days}`}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceHint}>每人起</Text>
        <Text style={styles.price}>{currency(deal.price)}</Text>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#0E2A47',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cover: {
    height: 180,
    width: '100%',
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#EAF5FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: '#1E79D8',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#0F1F33',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  meta: {
    color: '#6E7E95',
    fontSize: 12,
    marginTop: 6,
  },
  priceRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  priceHint: {
    color: '#8A98AB',
    fontSize: 11,
    marginRight: 6,
  },
  price: {
    color: '#E63946',
    fontSize: 22,
    fontWeight: '800',
  },
});

export default DealCard;
