import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useListTags, useSearchQuestions } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { QuestionCard } from '@/components/QuestionCard';
import { BrandText, Chip, EmptyState, ErrorState, LoadingState, fonts } from '@/components/ui';
import { radiusPill } from '@/constants/colors';

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | undefined>(undefined);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 350);
    return () => clearTimeout(t);
  }, [input]);

  const enabled = query.length >= 2;
  const searchQuery = useSearchQuestions(
    { q: query, tag, pageSize: 30 },
    { query: { enabled } as never },
  );
  const tagsQuery = useListTags();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: topInset + 12, paddingHorizontal: 16, gap: 12 }}>
        <BrandText weight="extrabold" style={{ fontSize: 24 }}>
          Search
        </BrandText>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            testID="input-search"
            value={input}
            onChangeText={setInput}
            placeholder="Search questions and answers"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            returnKeyType="search"
            style={[styles.input, { color: colors.foreground, fontFamily: fonts.regular }]}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <Chip label="All tags" selected={!tag} onPress={() => setTag(undefined)} />
          {(tagsQuery.data ?? []).slice(0, 15).map((t) => (
            <Chip
              key={t.slug}
              label={t.name}
              selected={tag === t.slug}
              onPress={() => setTag(tag === t.slug ? undefined : t.slug)}
            />
          ))}
        </ScrollView>
      </View>

      {!enabled ? (
        <EmptyState
          icon="search"
          title="Find answers fast"
          subtitle="Type at least two characters to search the community."
        />
      ) : searchQuery.isLoading ? (
        <LoadingState />
      ) : searchQuery.isError ? (
        <ErrorState onRetry={() => searchQuery.refetch()} />
      ) : (
        <FlatList
          data={searchQuery.data?.items ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <QuestionCard question={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={(searchQuery.data?.items.length ?? 0) > 0}
          ListEmptyComponent={
            <EmptyState
              icon="inbox"
              title="No results"
              subtitle={`Nothing matched “${query}”. Try different keywords.`}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: radiusPill,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'android' ? 8 : 0,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 8,
  },
  list: {
    gap: 12,
    padding: 16,
    paddingBottom: 120,
  },
});
