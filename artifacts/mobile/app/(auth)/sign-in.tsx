import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { type Href, Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSignIn, useSSO } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { BrandText, PillButton, fonts } from '@/components/ui';
import { radiusPill } from '@/constants/colors';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  useWarmUpBrowser();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [ssoLoading, setSsoLoading] = useState(false);

  const finishNavigate = useCallback(
    ({ session, decorateUrl }: { session?: { currentTask?: unknown } | null; decorateUrl: (url: string) => string }) => {
      if (session?.currentTask) {
        console.log(session.currentTask);
        return;
      }
      const url = decorateUrl('/');
      if (url.startsWith('http') && Platform.OS === 'web') {
        window.location.href = url;
      } else {
        router.dismissAll();
        router.replace(url as Href);
      }
    },
    [router],
  );

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: finishNavigate });
    }
  };

  const onGooglePress = useCallback(async () => {
    setSsoLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
          navigate: async (args) => finishNavigate(args),
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setSsoLoading(false);
    }
  }, [startSSOFlow, finishNavigate]);

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

      <Pressable
        testID="button-google"
        onPress={onGooglePress}
        disabled={ssoLoading}
        style={({ pressed }) => [
          styles.googleButton,
          { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed || ssoLoading ? 0.7 : 1 },
        ]}
      >
        {ssoLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <Feather name="chrome" size={18} color={colors.foreground} />
            <Text style={{ color: colors.foreground, fontFamily: fonts.semibold, fontSize: 15 }}>
              Continue with Google
            </Text>
          </>
        )}
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 12 }}>or</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

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
      {errors.fields.identifier && (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {errors.fields.identifier.message}
        </Text>
      )}
      <TextInput
        testID="input-password"
        style={inputStyle}
        value={password}
        placeholder="Password"
        placeholderTextColor={colors.mutedForeground}
        secureTextEntry
        onChangeText={setPassword}
      />
      {errors.fields.password && (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {errors.fields.password.message}
        </Text>
      )}
      {(errors?.global?.length ?? 0) > 0 && (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {errors?.global?.[0]?.message}
        </Text>
      )}

      <PillButton
        label="Sign in"
        testID="button-sign-in"
        disabled={!emailAddress || !password}
        loading={fetchStatus === 'fetching'}
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: radiusPill,
    paddingVertical: 13,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
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
