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

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, isSignedIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUp({
        email: emailAddress.trim(),
        password,
        username: username.trim(),
        displayName: (displayName || username).trim(),
      });
      router.dismissAll();
      router.replace('/' as Href);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message.replace(/^HTTP \d+ [^:]+:\s*/, '')
          : 'Could not create account. Please try again.',
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

  if (isSignedIn) return null;

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 48 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <BrandText weight="extrabold" style={{ fontSize: 24, textAlign: 'center' }}>
        Create account
      </BrandText>
      <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14, textAlign: 'center' }}>
        Join The Proven X community
      </Text>

      <TextInput
        testID="input-display-name"
        style={inputStyle}
        value={displayName}
        placeholder="Display name"
        placeholderTextColor={colors.mutedForeground}
        onChangeText={setDisplayName}
      />
      <TextInput
        testID="input-username"
        style={inputStyle}
        autoCapitalize="none"
        value={username}
        placeholder="Username"
        placeholderTextColor={colors.mutedForeground}
        onChangeText={setUsername}
      />
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
        placeholder="Password (min 8 characters)"
        placeholderTextColor={colors.mutedForeground}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
      ) : null}

      <PillButton
        label="Create account"
        testID="button-sign-up"
        disabled={!emailAddress || !password || !username}
        loading={loading}
        onPress={handleSubmit}
      />

      <View style={styles.linkRow}>
        <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14 }}>
          Already have an account?{' '}
        </Text>
        <Link href="/(auth)/sign-in" replace>
          <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: 14 }}>
            Sign in
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
    flexWrap: 'wrap',
  },
});
