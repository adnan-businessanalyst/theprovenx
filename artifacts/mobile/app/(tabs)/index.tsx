import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import * as Haptics from 'expo-haptics';
import {
  useListCategories,
  useListQuestions,
  type ListQuestionsParams,
} from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { QuestionCard } from '@/components/QuestionCard';
import { BrandText, Chip, EmptyState, ErrorState, LoadingState, fonts } from '@/components/ui';

const SORTS: { key: NonNullable<ListQuestionsParams['sort']>; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'active', label: 'Active' },
  { key: 'votes', label: 'Top voted' },
  { key: 'unanswered', label: 'Unanswered' },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [sort, setSort] = useState<NonNullable<ListQuestionsParams['sort']>>('newest');
  const [category, setCategory] = useState<string | undefined>(undefined);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const questionsQuery = useListQuestions({ sort, category, pageSize: 30 });
  const categoriesQuery = useListCategories();

  const onAsk = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(isSignedIn ? '/ask' : '/(auth)/sign-in');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoDot, { backgroundColor: colors.primary }]}>
            <Text style={{ color: colors.secondary, fontFamily: fonts.extrabold, fontSize: 15 }}>
              X
            </Text>
          </View>
          <BrandText weight="extrabold" style={{ fontSize: 20 }}>
            The Proven X
          </BrandText>
        </View>
        <Pressable
          testID="button-ask"
          onPress={onAsk}
          style={({ pressed }) => [
            styles.askButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="plus" size={16} color={colors.primaryForeground} />
          <Text style={{ color: colors.primaryForeground, fontFamily: fonts.semibold, fontSize: 14 }}>
            Ask
          </Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {SORTS.map((s) => (
            <Chip
              key={s.key}
              label={s.label}
              selected={sort === s.key}
              onPress={() => setSort(s.key)}
              testID={`chip-sort-${s.key}`}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <Chip label="All topics" selected={!category} onPress={() => setCategory(undefined)} />
          {(categoriesQuery.data ?? []).map((c) => (
            <Chip
              key={c.slug}
              label={c.name}
              selected={category === c.slug}
              onPress={() => setCategory(category === c.slug ? undefined : c.slug)}
              testID={`chip-category-${c.slug}`}
            />
          ))}
        </ScrollView>
      </View>

      {questionsQuery.isLoading ? (
        <LoadingState />
      ) : questionsQuery.isError ? (
        <ErrorState onRetry={() => questionsQuery.refetch()} />
      ) : (
        <FlatList
          data={questionsQuery.data?.items ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <QuestionCard question={item} />}
          contentContainerStyle={styles.list}
          scrollEnabled={(questionsQuery.data?.items.length ?? 0) > 0}
          refreshControl={
            <RefreshControl
              refreshing={questionsQuery.isRefetching}
              onRefresh={() => questionsQuery.refetch()}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="message-square"
              title="No questions yet"
              subtitle="Be the first to ask the community."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  filters: {
    gap: 8,
    paddingBottom: 8,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: 16,
  },
  list: {
    gap: 12,
    padding: 16,
    paddingBottom: 120,
  },
});
