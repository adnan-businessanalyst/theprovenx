import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import type { Question } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { Avatar, BrandText, TagPill, fonts } from '@/components/ui';
import { compactNumber, timeAgo } from '@/lib/format';

export function QuestionCard({ question }: { question: Question }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      testID={`question-card-${question.id}`}
      onPress={() => router.push(`/question/${question.slug}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius + 4,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {question.isFeatured ? (
        <View style={styles.featuredRow}>
          <Feather name="star" size={12} color={colors.secondary} />
          <Text style={{ color: colors.secondaryForeground === '#3a2c00' ? '#b8860b' : colors.secondary, fontFamily: fonts.semibold, fontSize: 11 }}>
            Featured
          </Text>
        </View>
      ) : null}

      <BrandText weight="bold" style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={2}>
        {question.title}
      </BrandText>

      <Text
        numberOfLines={2}
        style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 }}
      >
        {question.body}
      </Text>

      <View style={styles.tagRow}>
        {question.category ? (
          <View style={[styles.categoryPill, { backgroundColor: colors.accent }]}>
            <Text style={{ color: colors.accentForeground, fontFamily: fonts.semibold, fontSize: 12 }}>
              {question.category.name}
            </Text>
          </View>
        ) : null}
        {question.tags.slice(0, 3).map((t) => (
          <TagPill key={t} tag={t} />
        ))}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.authorRow}>
          <Avatar name={question.author.displayName} size={22} />
          <Text style={{ color: colors.mutedForeground, fontFamily: fonts.medium, fontSize: 12 }} numberOfLines={1}>
            {question.author.displayName} · {timeAgo(question.createdAt)}
          </Text>
        </View>
        <View style={styles.statsRow}>
          <Stat icon="arrow-up" value={question.score} colors={colors} />
          <Stat
            icon="message-circle"
            value={question.answerCount}
            colors={colors}
            highlight={question.hasAcceptedAnswer}
          />
          <Stat icon="eye" value={question.viewCount} colors={colors} />
        </View>
      </View>
    </Pressable>
  );
}

function Stat({
  icon,
  value,
  colors,
  highlight,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: number;
  colors: ReturnType<typeof useColors>;
  highlight?: boolean;
}) {
  const color = highlight ? colors.primary : colors.mutedForeground;
  return (
    <View style={styles.stat}>
      <Feather name={highlight ? 'check-circle' : icon} size={13} color={color} />
      <Text style={{ color, fontFamily: fonts.medium, fontSize: 12 }}>{compactNumber(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
