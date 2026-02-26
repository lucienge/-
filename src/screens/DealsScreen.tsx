import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import DealCard from '../components/DealCard';
import FilterBar from '../components/FilterBar';
import {
  continueSearchItems,
  filterChips,
  generateDealsPage,
  heroBanners,
  hotLimitedItems,
  promoTiles,
  quickMenus,
  type DealItem,
  type HotLimitedItem,
} from '../mock/deals';

type UiListItem =
  | { type: 'top' }
  | { type: 'filter' }
  | { type: 'deal'; payload: DealItem };

type ListStatus = 'loading' | 'success' | 'empty' | 'error';

const AUTO_PLAY_MS = 3200;

const formatPrice = (value: number) =>
  `NT$ ${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value)}`;

const countdown = (endAt: string) => {
  const remainMs = Math.max(0, new Date(endAt).getTime() - Date.now());
  const totalSec = Math.floor(remainMs / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${d}天 ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
};

const SkeletonCards = () => (
  <View style={styles.sectionContainer}>
    {Array.from({ length: 3 }).map((_, idx) => (
      <View key={`skeleton-${idx}`} style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonLineLong} />
      </View>
    ))}
  </View>
);

export const DealsScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState(filterChips[0].key);
  const [currentHero, setCurrentHero] = useState(0);
  const [currentHot, setCurrentHot] = useState<HotLimitedItem>(hotLimitedItems[0]);
  const [ticker, setTicker] = useState(() => countdown(hotLimitedItems[0].endAt));
  const [status, setStatus] = useState<ListStatus>('loading');
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const heroScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => {
        const next = (prev + 1) % heroBanners.length;
        heroScrollRef.current?.scrollTo({ x: next * 328, animated: true });
        return next;
      });
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTicker(countdown(currentHot.endAt)), 1000);
    return () => clearInterval(timer);
  }, [currentHot]);

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      const initial = generateDealsPage(0);
      setDeals(initial);
      setPage(1);
      setStatus(initial.length ? 'success' : 'empty');
    }, 900);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const loadMore = useCallback(() => {
    if (status !== 'success' || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setTimeout(() => {
      if (page >= 4) {
        setIsLoadingMore(false);
        return;
      }
      const nextBatch = generateDealsPage(page);
      setDeals((prev) => [...prev, ...nextBatch]);
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore, page, status]);

  const listItems = useMemo<UiListItem[]>(() => {
    const top: UiListItem[] = [{ type: 'top' }, { type: 'filter' }];
    if (status === 'success') {
      return [...top, ...deals.map((payload) => ({ type: 'deal' as const, payload }))];
    }
    return top;
  }, [deals, status]);

  const onHeroScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / 328);
    if (!Number.isNaN(next)) {
      setCurrentHero(next);
    }
  };

  const renderTopContent = () => (
    <View style={styles.topContent}>
      <View style={styles.logoRow}>
        <Text style={styles.logoMain}>易飛旅遊 eTravel</Text>
        <Text style={styles.logoMeta}>🔔 ☰</Text>
      </View>

      <View style={styles.sectionContainer}>
        <ScrollView
          ref={heroScrollRef}
          horizontal
          pagingEnabled
          onScroll={onHeroScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {heroBanners.map((banner) => (
            <Pressable key={banner.id} style={styles.heroCard}>
              <Image source={{ uri: banner.image }} style={styles.heroImage} />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{banner.title}</Text>
                <Text style={styles.heroSubtitle}>{banner.subtitle}</Text>
                <View style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>{banner.cta}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.dotsRow}>
          {heroBanners.map((item, index) => (
            <View
              key={item.id}
              style={[styles.dot, index === currentHero && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.quickRow}>
        {quickMenus.map((menu) => (
          <Pressable key={menu.id} style={styles.quickItem}>
            <Text style={styles.quickIcon}>{menu.icon}</Text>
            <Text style={styles.quickLabel}>{menu.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.searchBox}>
          <TextInput
            editable={false}
            placeholder="想去哪裡玩？"
            placeholderTextColor="#9AA8BA"
            style={styles.searchInput}
          />
          <Pressable style={styles.searchButton}>
            <Text style={styles.searchButtonText}>搜尋</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>主題推薦</Text>
        <View style={styles.promoGrid}>
          <Pressable style={styles.promoLarge}>
            <Image source={{ uri: promoTiles[0].image }} style={styles.promoImage} />
            <Text style={styles.promoTitle}>{promoTiles[0].title}</Text>
          </Pressable>
          <View style={styles.promoSmallColumn}>
            {[promoTiles[1], promoTiles[2]].map((tile) => (
              <Pressable key={tile.id} style={styles.promoSmallCard}>
                <Image source={{ uri: tile.image }} style={styles.promoImage} />
                <Text style={styles.promoTitle}>{tile.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.promoBottomRow}>
          {[promoTiles[3], promoTiles[4]].map((tile) => (
            <Pressable key={tile.id} style={styles.promoBottomCard}>
              <Image source={{ uri: tile.image }} style={styles.promoImage} />
              <Text style={styles.promoTitle}>{tile.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>繼續搜尋</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {continueSearchItems.map((item) => (
            <Pressable key={item.id} style={styles.historyCard}>
              <Text style={styles.historyKeyword}>{item.keyword}</Text>
              <Text style={styles.historyPeriod}>{item.period}</Text>
              {item.price ? <Text style={styles.historyPrice}>{item.price}</Text> : null}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>熱門限定</Text>
          <Text style={styles.timer}>{ticker}</Text>
        </View>
        <Pressable style={styles.hotCard}>
          <Image source={{ uri: currentHot.image }} style={styles.hotImage} />
          <View style={styles.hotBody}>
            <Text style={styles.hotTitle}>{currentHot.title}</Text>
            <Text style={styles.hotOrigin}>{`原價 ${formatPrice(currentHot.originPrice)}`}</Text>
            <Text style={styles.hotPrice}>{`限時 ${formatPrice(currentHot.salePrice)}`}</Text>
          </View>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {hotLimitedItems.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.hotSwitcher, item.id === currentHot.id && styles.hotSwitcherActive]}
              onPress={() => setCurrentHot(item)}
            >
              <Text style={styles.hotSwitcherText}>{item.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>熱門行程</Text>
      </View>
    </View>
  );

  const renderListState = () => {
    if (status === 'loading') {
      return <SkeletonCards />;
    }

    if (status === 'empty') {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateTitle}>目前暫無資料</Text>
          <Text style={styles.stateDesc}>請切換篩選或稍後再試。</Text>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateTitle}>載入失敗</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setStatus('loading');
              setTimeout(() => {
                setDeals(generateDealsPage(0));
                setPage(1);
                setStatus('success');
              }, 600);
            }}
          >
            <Text style={styles.retryText}>重試</Text>
          </Pressable>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listItems}
        keyExtractor={(item, index) => (item.type === 'deal' ? item.payload.id : `${item.type}-${index}`)}
        stickyHeaderIndices={[1]}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => {
          if (item.type === 'top') {
            return renderTopContent();
          }

          if (item.type === 'filter') {
            return (
              <FilterBar
                filters={filterChips}
                activeKey={activeFilter}
                onChange={(key) => {
                  if (key === 'coupon') {
                    setStatus('error');
                    return;
                  }

                  if (key === 'theme') {
                    setStatus('empty');
                  } else {
                    setStatus('loading');
                  }
                  setActiveFilter(key);
                }}
              />
            );
          }

          return (
            <View style={styles.sectionContainer}>
              <DealCard deal={item.payload} />
            </View>
          );
        }}
        ListFooterComponent={
          status === 'success' ? (
            <View style={styles.footerWrap}>
              {isLoadingMore ? <Text style={styles.footerText}>載入更多中...</Text> : <Text style={styles.footerText}>下滑載入更多</Text>}
            </View>
          ) : (
            renderListState()
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F8FD',
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#F5F8FD',
    paddingBottom: 32,
  },
  topContent: {
    backgroundColor: '#F5F8FD',
  },
  logoRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoMain: {
    color: '#0088DA',
    fontSize: 18,
    fontWeight: '800',
  },
  logoMeta: {
    color: '#52657D',
    fontSize: 18,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heroCard: {
    borderRadius: 14,
    height: 176,
    marginRight: 10,
    overflow: 'hidden',
    width: 328,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.34)',
    bottom: 0,
    left: 0,
    padding: 12,
    position: 'absolute',
    right: 0,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#EFF6FF',
    fontSize: 12,
    marginTop: 4,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E9BFF',
    borderRadius: 14,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  dotsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    backgroundColor: '#C8D3E2',
    borderRadius: 3,
    height: 6,
    marginHorizontal: 3,
    width: 6,
  },
  dotActive: {
    backgroundColor: '#1B82E8',
    width: 18,
  },
  quickRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  quickItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickIcon: {
    fontSize: 24,
  },
  quickLabel: {
    color: '#3D4D64',
    fontSize: 12,
    marginTop: 5,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E6F6',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#2E9BFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#10233B',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  promoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  promoLarge: {
    borderRadius: 12,
    flex: 1,
    overflow: 'hidden',
  },
  promoSmallColumn: {
    flex: 1,
    gap: 8,
  },
  promoSmallCard: {
    borderRadius: 12,
    flex: 1,
    overflow: 'hidden',
  },
  promoBottomRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  promoBottomCard: {
    borderRadius: 12,
    flex: 1,
    overflow: 'hidden',
  },
  promoImage: {
    height: 92,
    width: '100%',
  },
  promoTitle: {
    backgroundColor: '#FFFFFF',
    color: '#14314E',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  horizontalRow: {
    gap: 10,
    paddingBottom: 2,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minHeight: 84,
    padding: 10,
    width: 170,
  },
  historyKeyword: {
    color: '#16304E',
    fontSize: 13,
    fontWeight: '700',
  },
  historyPeriod: {
    color: '#6D8098',
    fontSize: 12,
    marginTop: 6,
  },
  historyPrice: {
    color: '#D62839',
    fontSize: 12,
    marginTop: 6,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timer: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  hotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
  },
  hotImage: {
    height: 160,
    width: '100%',
  },
  hotBody: {
    padding: 10,
  },
  hotTitle: {
    color: '#10243D',
    fontSize: 15,
    fontWeight: '700',
  },
  hotOrigin: {
    color: '#93A0B1',
    fontSize: 12,
    marginTop: 4,
    textDecorationLine: 'line-through',
  },
  hotPrice: {
    color: '#DE2E3C',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  hotSwitcher: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  hotSwitcherActive: {
    backgroundColor: '#E9F5FF',
    borderColor: '#89C7FF',
    borderWidth: 1,
  },
  hotSwitcherText: {
    color: '#2B425C',
    fontSize: 12,
    fontWeight: '600',
  },
  stateWrap: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  stateTitle: {
    color: '#2B3F58',
    fontSize: 16,
    fontWeight: '700',
  },
  stateDesc: {
    color: '#7488A1',
    fontSize: 13,
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: '#2C95F8',
    borderRadius: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerWrap: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  footerText: {
    color: '#7690AD',
    fontSize: 12,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    padding: 10,
  },
  skeletonImage: {
    backgroundColor: '#ECF2FA',
    borderRadius: 10,
    height: 180,
    marginBottom: 10,
  },
  skeletonLineShort: {
    backgroundColor: '#ECF2FA',
    borderRadius: 6,
    height: 14,
    marginBottom: 8,
    width: '45%',
  },
  skeletonLineLong: {
    backgroundColor: '#ECF2FA',
    borderRadius: 6,
    height: 14,
    width: '75%',
  },
});

export default DealsScreen;
