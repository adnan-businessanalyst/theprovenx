import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, useClerk } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMe } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import {
  Avatar,
  BrandText,
  EmptyState,
  ErrorState,
  LoadingState,
  PillButton,
  fonts,
} from '@/components/ui';
import { compactNumber } from '@/lib/format';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const meQuery = useGetMe({ query: { enabled: !!isSignedIn } as never });

  if (!isSignedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset + 12 }]}>
        <BrandText weight="extrabold" style={{ fontSize: 24, paddingHorizontal: 16 }}>
          Profile
        </BrandText>
        <EmptyState
          icon="user"
          title="Join The Proven X"
          subtitle="Sign in to ask questions, answer, vote, and build your reputation."
        />
        <View style={styles.authButtons}>
          <PillButton label="Sign in" onPress={() => router.push('/(auth)/sign-in')} testID="button-go-sign-in" />
          <PillButton
            label="Create account"
            variant="outline"
            onPress={() => router.push('/(auth)/sign-up')}
            testID="button-go-sign-up"
          />
        </View>
      </View>
    );
  }

  const me = meQuery.data;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12 }]}
    >
      <BrandText weight="extrabold" style={{ fontSize: 24 }}>
        Profile
      </BrandText>

      {meQuery.isLoading ? (
        <LoadingState />
      ) : meQuery.isError || !me ? (
        <ErrorState onRetry={() => meQuery.refetch()} />
      ) : (
        <>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius + 6 },
            ]}
          >
            <Avatar name={me.displayName} size={64} />
            <BrandText weight="bold" style={{ fontSize: 20 }}>
              {me.displayName}
            </BrandText>
            <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14 }}>
              @{me.username}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={{ color: colors.accentForeground, fontFamily: fonts.semibold, fontSize: 12 }}>
                  {me.role === 'admin' ? 'Admin' : me.role === 'moderator' ? 'Moderator' : 'Member'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: me.plan === 'pro' ? colors.secondary : colors.muted }]}>
                <Text
                  style={{
                    color: me.plan === 'pro' ? colors.secondaryForeground : colors.mutedForeground,
                    fontFamily: fonts.semibold,
                    fontSize: 12,
                  }}
                >
                  {me.plan === 'pro' ? 'Pro' : 'Free plan'}
                </Text>
              </View>
            </View>
            {me.bio ? (
              <Text
                style={{
                  color: colors.foreground,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                {me.bio}
              </Text>
            ) : null}
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Reputation" value={me.reputation} colors={colors} />
            <StatCard label="Questions" value={me.questionCount} colors={colors} />
            <StatCard label="Answers" value={me.answerCount} colors={colors} />
            <StatCard label="Accepted" value={me.acceptedAnswerCount} colors={colors} />
          </View>

          <PillButton
            label="Sign out"
            variant="outline"
            icon="log-out"
            testID="button-sign-out"
            onPress={async () => {
              await signOut();
              queryClient.clear();
            }}
          />
        </>
      )}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius + 4 },
      ]}
    >
      <Text style={{ color: colors.primary, fontFamily: fonts.extrabold, fontSize: 20 }}>
        {compactNumber(value)}
      </Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: fonts.medium, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 140,
  },
  authButtons: {
    gap: 12,
    paddingHorizontal: 48,
  },
  card: {
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    padding: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    paddingVertical: 16,
  },
});
