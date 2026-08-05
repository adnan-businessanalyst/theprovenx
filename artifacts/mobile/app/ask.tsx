import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import {
  useCreateQuestion,
  useListCategories,
  useListTags,
} from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { BrandText, Chip, PillButton, fonts } from '@/components/ui';

export default function AskScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoriesQuery = useListCategories();
  const tagsQuery = useListTags();
  const showOptionalTag = categorySlug === 'other';

  const createQuestion = useCreateQuestion({
    mutation: {
      onSuccess: (question) => {
        queryClient.invalidateQueries();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace(`/question/${question.slug}`);
      },
      onError: (err: unknown) => {
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Could not post your question. Please try again.';
        setErrorMessage(message);
      },
    },
  });

  const toggleTag = (slug: string) => {
    setTags((prev) => {
      if (prev.includes(slug)) return prev.filter((t) => t !== slug);
      return [slug];
    });
  };

  const selectCategory = (slug: string) => {
    setCategorySlug(slug);
    if (slug !== 'other') setTags([]);
  };

  const valid =
    title.trim().length >= 10 &&
    body.trim().length >= 20 &&
    !!categorySlug;

  const submit = () => {
    if (!valid || !categorySlug) return;
    setErrorMessage(null);
    createQuestion.mutate({
      data: {
        title: title.trim(),
        body: body.trim(),
        tags: categorySlug === 'other' ? tags.slice(0, 1) : [],
        categorySlug,
      },
    });
  };

  const inputStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: colors.radius + 4,
    color: colors.foreground,
    fontFamily: fonts.regular,
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={styles.field}>
        <BrandText weight="semibold" style={{ fontSize: 14 }}>
          Title
        </BrandText>
        <TextInput
          testID="input-title"
          value={title}
          onChangeText={setTitle}
          placeholder="Be specific — at least 10 characters"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, inputStyle]}
          maxLength={200}
        />
      </View>

      <View style={styles.field}>
        <BrandText weight="semibold" style={{ fontSize: 14 }}>
          Details
        </BrandText>
        <TextInput
          testID="input-body"
          value={body}
          onChangeText={setBody}
          multiline
          placeholder="Explain the context and what you've tried (at least 20 characters)"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, styles.bodyInput, inputStyle]}
          maxLength={30000}
        />
      </View>

      <View style={styles.field}>
        <BrandText weight="semibold" style={{ fontSize: 14 }}>
          Topic
        </BrandText>
        <View style={styles.chipWrap}>
          {(categoriesQuery.data ?? []).map((c) => (
            <Chip
              key={c.slug}
              label={c.name}
              selected={categorySlug === c.slug}
              onPress={() => selectCategory(c.slug)}
              testID={`ask-category-${c.slug}`}
            />
          ))}
        </View>
      </View>

      {showOptionalTag ? (
        <View style={styles.field}>
          <BrandText weight="semibold" style={{ fontSize: 14 }}>
            Tag{' '}
            <Text
              style={{
                color: colors.mutedForeground,
                fontFamily: fonts.regular,
                fontSize: 12,
              }}
            >
              (optional — pick one)
            </Text>
          </BrandText>
          <View style={styles.chipWrap}>
            {(tagsQuery.data ?? []).map((t) => (
              <Chip
                key={t.slug}
                label={t.name}
                selected={tags.includes(t.slug)}
                onPress={() => toggleTag(t.slug)}
                testID={`ask-tag-${t.slug}`}
              />
            ))}
          </View>
        </View>
      ) : null}

      {errorMessage ? (
        <Text style={{ color: colors.destructive, fontFamily: fonts.medium, fontSize: 13 }}>
          {errorMessage}
        </Text>
      ) : null}

      <PillButton
        label="Post question"
        icon="send"
        disabled={!valid}
        loading={createQuestion.isPending}
        onPress={submit}
        testID="button-post-question"
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    gap: 18,
  },
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as never } : {}),
  },
  bodyInput: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
