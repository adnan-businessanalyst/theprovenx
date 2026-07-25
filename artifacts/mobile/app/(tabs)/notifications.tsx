import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListNotifications,
  useMarkNotificationsRead,
  type NotificationItem,
} from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import {
  BrandText,
  EmptyState,
  ErrorState,
  LoadingState,
  PillButton,
  fonts,
} from '@/components/ui';
import { timeAgo } from '@/lib/format';

const ICONS: Record<NotificationItem['type'], keyof typeof Feather.glyphMap> = {
  new_answer: 'message-circle',
  new_comment: 'message-square',
  answer_accepted: 'check-circle',
  mention: 'at-sign',
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const notificationsQuery = useListNotifications(
    { limit: 50 },
    { query: { enabled: !!isSignedIn } as never },
  );
  const markRead = useMarkNotificationsRead({
    mutation: { onSuccess: () => queryClient.invalidateQueries() },
  });

  const openNotification = (item: NotificationItem) => {
    if (!item.isRead) {
      markRead.mutate({ data: { ids: [item.id] } });
    }
    const match = item.link.match(/\/questions\/([^/?#]+)/);
    if (match) {
      router.push(`/question/${match[1]}`);
    }
  };

  if (!isSignedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset + 12 }]}>
        <BrandText weight="extrabold" style={{ fontSize: 24, paddingHorizontal: 16 }}>
          Alerts
        </BrandText>
        <EmptyState
          icon="bell"
          title="Sign in to see alerts"
          subtitle="Get notified when someone answers or accepts your posts."
        />
        <View style={{ alignItems: 'center' }}>
          <PillButton label="Sign in" onPress={() => router.push('/(auth)/sign-in')} />
        </View>
      </View>
    );
  }

  const unread = notificationsQuery.data?.unreadCount ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <BrandText weight="extrabold" style={{ fontSize: 24 }}>
          Alerts
        </BrandText>
        {unread > 0 ? (
          <PillButton
            small
            variant="outline"
            label="Mark all read"
            loading={markRead.isPending}
            onPress={() => markRead.mutate({ data: {} })}
            testID="button-mark-all-read"
          />
        ) : null}
      </View>

      {notificationsQuery.isLoading ? (
        <LoadingState />
      ) : notificationsQuery.isError ? (
        <ErrorState onRetry={() => notificationsQuery.refetch()} />
      ) : (
        <FlatList
          data={notificationsQuery.data?.items ?? []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          scrollEnabled={(notificationsQuery.data?.items.length ?? 0) > 0}
          refreshControl={
            <RefreshControl
              refreshing={notificationsQuery.isRefetching}
              onRefresh={() => notificationsQuery.refetch()}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="bell-off"
              title="No alerts yet"
              subtitle="Answers and mentions will show up here."
            />
          }
          renderItem={({ item }) => (
            <Pressable
              testID={`notification-${item.id}`}
              onPress={() => openNotification(item)}
              style={({ pressed }) => [
                styles.item,
                {
                  backgroundColor: item.isRead ? colors.card : colors.accent,
                  borderColor: colors.border,
                  borderRadius: colors.radius + 4,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.itemIcon, { backgroundColor: colors.primary }]}>
                <Feather name={ICONS[item.type]} size={16} color={colors.primaryForeground} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    color: colors.foreground,
                    fontFamily: item.isRead ? fonts.regular : fonts.semibold,
                    fontSize: 14,
                    lineHeight: 19,
                  }}
                >
                  {item.message}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 12 }}>
                  {timeAgo(item.createdAt)}
                </Text>
              </View>
              {!item.isRead ? (
                <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
              ) : null}
            </Pressable>
          )}
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
  list: {
    gap: 10,
    padding: 16,
    paddingBottom: 120,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    padding: 14,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
});
