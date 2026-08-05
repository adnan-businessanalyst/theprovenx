import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import {
  getGetQuestionQueryKey,
  useAcceptAnswer,
  useCreateAnswer,
  useGetMe,
  useGetQuestion,
  useVoteAnswer,
  useVoteQuestion,
  type Answer,
} from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import {
  Avatar,
  BrandText,
  ErrorState,
  LoadingState,
  PillButton,
  TagPill,
  fonts,
} from '@/components/ui';
import { compactNumber, timeAgo } from '@/lib/format';

export default function QuestionDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [answerText, setAnswerText] = useState('');

  const detailQuery = useGetQuestion(slug ?? '', { query: { enabled: !!slug } as never });
  const meQuery = useGetMe({ query: { enabled: !!isSignedIn } as never });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(slug ?? '') });

  const voteQuestion = useVoteQuestion({ mutation: { onSuccess: invalidate } });
  const voteAnswer = useVoteAnswer({ mutation: { onSuccess: invalidate } });
  const acceptAnswer = useAcceptAnswer({ mutation: { onSuccess: invalidate } });
  const createAnswer = useCreateAnswer({
    mutation: {
      onSuccess: () => {
        setAnswerText('');
        invalidate();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    },
  });

  const requireSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  if (detailQuery.isLoading) return <LoadingState />;
  if (detailQuery.isError || !detailQuery.data)
    return <ErrorState onRetry={() => detailQuery.refetch()} />;

  const { question, answers } = detailQuery.data;
  const isAuthor = !!meQuery.data && meQuery.data.id === question.author.id;

  const onVoteQuestion = (value: 1 | -1) => {
    if (!isSignedIn) return requireSignIn();
    Haptics.selectionAsync();
    voteQuestion.mutate({
      id: question.id,
      data: { value: question.myVote === value ? 0 : value },
    });
  };

  const onVoteAnswer = (answer: Answer, value: 1 | -1) => {
    if (!isSignedIn) return requireSignIn();
    Haptics.selectionAsync();
    voteAnswer.mutate({
      id: answer.id,
      data: { value: answer.myVote === value ? 0 : value },
    });
  };

  const onSubmitAnswer = () => {
    if (!isSignedIn) return requireSignIn();
    createAnswer.mutate({ id: question.id, data: { body: answerText.trim() } });
  };

  const answerValid = answerText.trim().length >= 20;

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <BrandText weight="extrabold" style={{ fontSize: 21, lineHeight: 28 }}>
        {question.title}
      </BrandText>

      <View style={styles.metaRow}>
        <Avatar name={question.author.username} size={26} />
        <Text style={{ color: colors.mutedForeground, fontFamily: fonts.medium, fontSize: 13, flex: 1 }}>
          @{question.author.username} · {timeAgo(question.createdAt)} · {compactNumber(question.viewCount)} views
        </Text>
      </View>

      <View style={styles.tagRow}>
        {question.category ? (
          <View style={[styles.categoryPill, { backgroundColor: colors.accent }]}>
            <Text style={{ color: colors.accentForeground, fontFamily: fonts.semibold, fontSize: 12 }}>
              {question.category.name}
            </Text>
          </View>
        ) : null}
        {question.tags.map((t) => (
          <TagPill key={t} tag={t} />
        ))}
      </View>

      <Text style={{ color: colors.foreground, fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 }}>
        {question.body}
      </Text>

      <VoteBar
        score={question.score}
        myVote={question.myVote ?? 0}
        onUp={() => onVoteQuestion(1)}
        onDown={() => onVoteQuestion(-1)}
        colors={colors}
        testIDPrefix={`question-${question.id}`}
      />

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <BrandText weight="bold" style={{ fontSize: 17 }}>
        {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
      </BrandText>

      {answers.map((answer) => (
        <View
          key={answer.id}
          style={[
            styles.answerCard,
            {
              backgroundColor: answer.isAccepted ? colors.accent : colors.card,
              borderColor: answer.isAccepted ? colors.primary : colors.border,
              borderRadius: colors.radius + 4,
            },
          ]}
        >
          {answer.isAccepted ? (
            <View style={styles.acceptedRow}>
              <Feather name="check-circle" size={14} color={colors.primary} />
              <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: 12 }}>
                Accepted answer
              </Text>
            </View>
          ) : null}
          <View style={styles.metaRow}>
            <Avatar name={answer.author.displayName} size={24} />
            <Text style={{ color: colors.mutedForeground, fontFamily: fonts.medium, fontSize: 12, flex: 1 }}>
              {answer.author.displayName} · {timeAgo(answer.createdAt)}
            </Text>
          </View>
          <Text style={{ color: colors.foreground, fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 }}>
            {answer.body}
          </Text>
          <View style={styles.answerActions}>
            <VoteBar
              score={answer.score}
              myVote={answer.myVote ?? 0}
              onUp={() => onVoteAnswer(answer, 1)}
              onDown={() => onVoteAnswer(answer, -1)}
              colors={colors}
              small
              testIDPrefix={`answer-${answer.id}`}
            />
            {isAuthor && !answer.isAccepted && !question.hasAcceptedAnswer ? (
              <PillButton
                small
                variant="outline"
                icon="check"
                label="Accept"
                loading={acceptAnswer.isPending}
                onPress={() => acceptAnswer.mutate({ id: answer.id })}
                testID={`button-accept-${answer.id}`}
              />
            ) : null}
          </View>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <BrandText weight="bold" style={{ fontSize: 17 }}>
        Your answer
      </BrandText>
      {isSignedIn ? (
        <>
          <TextInput
            testID="input-answer"
            value={answerText}
            onChangeText={setAnswerText}
            multiline
            placeholder="Share what you know (at least 20 characters)…"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.answerInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius + 4,
                color: colors.foreground,
                fontFamily: fonts.regular,
              },
            ]}
          />
          <PillButton
            label="Post answer"
            icon="send"
            disabled={!answerValid}
            loading={createAnswer.isPending}
            onPress={onSubmitAnswer}
            testID="button-post-answer"
          />
        </>
      ) : (
        <PillButton label="Sign in to answer" variant="outline" onPress={requireSignIn} />
      )}
    </KeyboardAwareScrollView>
  );
}

function VoteBar({
  score,
  myVote,
  onUp,
  onDown,
  colors,
  small,
  testIDPrefix,
}: {
  score: number;
  myVote: number;
  onUp: () => void;
  onDown: () => void;
  colors: ReturnType<typeof useColors>;
  small?: boolean;
  testIDPrefix: string;
}) {
  const size = small ? 16 : 20;
  return (
    <View style={[voteStyles.bar, { backgroundColor: colors.muted }]}>
      <Pressable
        testID={`${testIDPrefix}-upvote`}
        onPress={onUp}
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Feather name="arrow-up" size={size} color={myVote === 1 ? colors.primary : colors.mutedForeground} />
      </Pressable>
      <Text
        style={{
          color: colors.foreground,
          fontFamily: fonts.bold,
          fontSize: small ? 13 : 15,
          minWidth: 24,
          textAlign: 'center',
        }}
      >
        {compactNumber(score)}
      </Text>
      <Pressable
        testID={`${testIDPrefix}-downvote`}
        onPress={onDown}
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Feather name="arrow-down" size={size} color={myVote === -1 ? colors.destructive : colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

const voteStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  answerCard: {
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  acceptedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  answerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  answerInput: {
    borderWidth: 1,
    minHeight: 120,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as never } : {}),
  },
});
