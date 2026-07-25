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
import { useAuth, useSignUp } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { BrandText, PillButton, fonts } from '@/components/ui';
import { radiusPill } from '@/constants/colors';

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
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
      });
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

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  const verifying =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0;

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 48 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      {verifying ? (
        <>
          <BrandText weight="extrabold" style={{ fontSize: 24, textAlign: 'center' }}>
            Check your email
          </BrandText>
          <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14, textAlign: 'center' }}>
            We sent a verification code to {emailAddress}
          </Text>
          <TextInput
            testID="input-code"
            style={inputStyle}
            value={code}
            placeholder="Verification code"
            placeholderTextColor={colors.mutedForeground}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          {errors.fields.code && (
            <Text style={[styles.error, { color: colors.destructive }]}>
              {errors.fields.code.message}
            </Text>
          )}
          <PillButton
            label="Verify"
            testID="button-verify"
            loading={fetchStatus === 'fetching'}
            disabled={!code}
            onPress={handleVerify}
          />
          <PillButton
            label="Send a new code"
            variant="ghost"
            onPress={() => signUp.verifications.sendEmailCode()}
          />
        </>
      ) : (
        <>
          <BrandText weight="extrabold" style={{ fontSize: 24, textAlign: 'center' }}>
            Join The Proven X
          </BrandText>
          <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14, textAlign: 'center' }}>
            Ask questions, share answers, earn reputation
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
          {errors.fields.emailAddress && (
            <Text style={[styles.error, { color: colors.destructive }]}>
              {errors.fields.emailAddress.message}
            </Text>
          )}
          <TextInput
            testID="input-password"
            style={inputStyle}
            value={password}
            placeholder="Password (8+ characters)"
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
            label="Create account"
            testID="button-sign-up"
            disabled={!emailAddress || !password}
            loading={fetchStatus === 'fetching'}
            onPress={handleSubmit}
          />

          <View style={styles.linkRow}>
            <Text style={{ color: colors.mutedForeground, fontFamily: fonts.regular, fontSize: 14 }}>
              Already a member?{' '}
            </Text>
            <Link href="/(auth)/sign-in" replace>
              <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: 14 }}>
                Sign in
              </Text>
            </Link>
          </View>
        </>
      )}

      {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
      <View nativeID="clerk-captcha" />
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
  },
});
