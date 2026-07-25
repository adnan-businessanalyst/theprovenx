import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { radiusPill } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export function BrandText({
  children,
  weight = 'regular',
  style,
  numberOfLines,
}: {
  children: React.ReactNode;
  weight?: keyof typeof fonts;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}) {
  const colors = useColors();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontFamily: fonts[weight], color: colors.foreground }, style]}
    >
      {children}
    </Text>
  );
}

export function PillButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  small,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  testID?: string;
}) {
  const colors = useColors();
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';
  const fg =
    variant === 'primary'
      ? colors.primaryForeground
      : variant === 'secondary'
        ? colors.secondaryForeground
        : colors.primary;

  return (
    <Pressable
      testID={testID}
      disabled={disabled || loading}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.pillButton,
        small && styles.pillButtonSmall,
        {
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: colors.primary,
          opacity: disabled || loading ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={small ? 14 : 17} color={fg} /> : null}
          <Text
            style={{
              color: fg,
              fontFamily: fonts.semibold,
              fontSize: small ? 13 : 15,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.accent,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? colors.primaryForeground : colors.accentForeground,
          fontFamily: fonts.medium,
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function TagPill({ tag }: { tag: string }) {
  const colors = useColors();
  return (
    <View style={[styles.tagPill, { backgroundColor: colors.muted }]}>
      <Text style={{ color: colors.mutedForeground, fontFamily: fonts.medium, fontSize: 12 }}>
        {tag}
      </Text>
    </View>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const colors = useColors();
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontFamily: fonts.bold,
          fontSize: size * 0.38,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.accent }]}>
        <Feather name={icon} size={26} color={colors.accentForeground} />
      </View>
      <BrandText weight="semibold" style={{ fontSize: 16, textAlign: 'center' }}>
        {title}
      </BrandText>
      {subtitle ? (
        <Text
          style={{
            color: colors.mutedForeground,
            fontFamily: fonts.regular,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function ErrorState({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <View style={styles.empty}>
      <EmptyState
        icon="alert-circle"
        title="Something went wrong"
        subtitle={message ?? 'Could not load data. Check your connection and try again.'}
      />
      <PillButton label="Retry" icon="refresh-cw" variant="outline" onPress={onRetry} small />
    </View>
  );
}

export function LoadingState() {
  const colors = useColors();
  return (
    <View style={styles.empty}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radiusPill,
  },
  pillButtonSmall: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radiusPill,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radiusPill,
  },
  empty: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
