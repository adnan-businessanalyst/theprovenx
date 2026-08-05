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

function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 30);
}

function suggestUsernameFrom(email: string, alias: string): string {
  const local = email.includes('@') ? email.split('@')[0] ?? '' : email;
  const source = local.trim() || alias.trim();
  return sanitizeUsername(source);
}

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, isSignedIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [aliasName, setAliasName] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const syncUsernameSuggestion = (nextEmail: string, nextAlias: string) => {
    if (usernameTouched) return;
    setUsername(suggestUsernameFrom(nextEmail, nextAlias));
  };

  const handleSubmit = async () => {
    setError(null);
    const handle = sanitizeUsername(username);
    const alias = aliasName.trim();
    if (handle.length < 3) {
      setError('Username must be at least 3 characters (letters, numbers, _ or -).');
      return;
    }
    if (!alias) {
      setError('Alias name is required.');
      return;
    }
    setLoading(true);
    try {
      await signUp({
        email: emailAddress.trim(),
        password,
        username: handle,
        displayName: alias,
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

      <View style={styles.field}>
        <TextInput
          testID="input-email"
          style={inputStyle}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email address"
          placeholderTextColor={colors.mutedForeground}
          onChangeText={(next) => {
            setEmailAddress(next);
            syncUsernameSuggestion(next, aliasName);
          }}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.field}>
        <TextInput
          testID="input-display-name"
          style={inputStyle}
          value={aliasName}
          placeholder="Alias name"
          placeholderTextColor={colors.mutedForeground}
          onChangeText={(next) => {
            setAliasName(next);
            syncUsernameSuggestion(emailAddress, next);
          }}
        />
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          How your name appears in the community. Not unique — spaces allowed.
        </Text>
      </View>

      <View style={styles.field}>
        <View style={styles.usernameRow}>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: fonts.regular,
              fontSize: 15,
              paddingLeft: 4,
            }}
          >
            @
          </Text>
          <TextInput
            testID="input-username"
            style={[inputStyle, styles.usernameInput]}
            autoCapitalize="none"
            value={username}
            placeholder="username"
            placeholderTextColor={colors.mutedForeground}
            onChangeText={(next) => {
              setUsernameTouched(true);
              setUsername(sanitizeUsername(next));
            }}
          />
        </View>
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          Unique handle for your profile and mentions. No spaces. Suggested from email or alias —
          you can edit it.
        </Text>
      </View>

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
        disabled={!emailAddress || !password || !username || !aliasName.trim()}
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
  field: {
    gap: 6,
  },
  hint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usernameInput: {
    flex: 1,
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
