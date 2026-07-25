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
import { type Href, Link, useRouter } from 'expo-router';
import { ApiError } from '@workspace/api-client-react';
import { useAuth } from '@/lib/auth';
import { useColors } from '@/hooks/useColors';
import { BrandText, PillButton, fonts } from '@/components/ui';
import { radiusPill } from '@/constants/colors';

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(emailAddress.trim(), password);
      router.dismissAll();
      router.replace('/' as Href);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message.replace(/^HTTP \d+ [^:]+:\s*/, '')
          : 'Sign in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.foreground,
      fontFamily: fonts.regular,
    },
  ];

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 48 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={[styles.logoDot, { backgroundColor: colors.primary }]}>
        <Text style={{ color: colors.secondary, fontFamily: fonts.extrabold, fontSize: 24 }}>X</Text>
      </View>
      <BrandText weight="extrabold" style={{ fontSize: 24, textAlign: 'center' }}>
        Welcome back
      </BrandText>
      <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14, textAlign: 'center' }}>
        Sign in to ask, answer, and vote
      </Text>

      <TextInput
        testID="input-email"
        style={inputStyle}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email address"
        placeholderTextColor={colors.mutedForeground}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        testID="input-password"
        style={inputStyle}
        value={password}
        placeholder="Password"
        placeholderTextColor={colors.mutedForeground}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
      ) : null}

      <PillButton
        label="Sign in"
        testID="button-sign-in"
        disabled={!emailAddress || !password}
        loading={loading}
        onPress={handleSubmit}
      />

      <View style={styles.linkRow}>
        <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14 }}>
          New here?{' '}
        </Text>
        <Link href="/(auth)/sign-up" replace>
          <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: 14 }}>
            Create an account
          </Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 14,
  },
  logoDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: radiusPill,
    paddingHorizontal: 18,
    paddingVertical: 13,
    fontSize: 15,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as never } : {}),
  },
  error: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
