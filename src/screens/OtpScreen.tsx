import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppButton } from "../components/AppButton";
import type { RootStackParamList } from "../navigation/types";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "AuthOtp">;

const RESEND_COOLDOWN_SEC = 30;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function mapErrorMessage(message: string) {
  if (message === "INVALID_CODE") return "Неверный код";
  if (message === "CODE_EXPIRED") return "Код истек, запросите новый";
  if (message === "CODE_NOT_SENT") return "Сначала запросите код";
  return "Не удалось подтвердить код";
}

export function OtpScreen({ navigation, route }: Props) {
  const { actions } = useApp();
  const [email, setEmail] = useState(route.params.email);
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SEC);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const canResend = secondsLeft <= 0;
  const isEmailValid = useMemo(() => isValidEmail(email), [email]);
  const isCodeComplete = useMemo(() => code.length === 6, [code]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!isCodeComplete || loadingVerify || !isEmailValid) return;
    void (async () => {
      try {
        setLoadingVerify(true);
        await actions.verifyEmailCode(email, code);
        navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
      } catch (error) {
        const message = error instanceof Error ? mapErrorMessage(error.message) : "Неверный код";
        Alert.alert("Ошибка", message);
        setCode("");
      } finally {
        setLoadingVerify(false);
      }
    })();
  }, [actions, code, email, isCodeComplete, isEmailValid, loadingVerify, navigation]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Введите код{`\n`}из email</Text>
      <Text style={styles.subtitle}>Мы отправили 6-значный код на</Text>
      <TextInput
        value={email}
        onChangeText={(value) => setEmail(value.trim().toLowerCase())}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.emailInput}
      />
      <Pressable style={styles.otpWrap}>
        <TextInput
          value={code}
          onChangeText={(v) => setCode(normalizeCode(v))}
          placeholder=""
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus
        />
        {Array.from({ length: 6 }).map((_, idx) => {
          const val = code[idx] ?? "";
          const active = idx === code.length && code.length < 6;
          return (
            <View key={idx} style={[styles.otpCell, active && styles.otpCellActive]}>
              <Text style={styles.otpCellText}>{val}</Text>
            </View>
          );
        })}
      </Pressable>

      <Text style={styles.timerText}>
        {canResend ? "Можно отправить код повторно" : `Отправить повторно через 0:${String(secondsLeft).padStart(2, "0")}`}
      </Text>
      <View style={styles.linkRow}>
        <Text style={styles.changeLink} onPress={() => navigation.navigate("AuthEmail")}>
          Изменить email
        </Text>
      </View>

      <AppButton
        title="Отправить повторно"
        variant="secondary"
        disabled={!canResend || !isEmailValid}
        loading={loadingResend}
        onPress={async () => {
          if (!isEmailValid) {
            Alert.alert("Введите корректный email");
            return;
          }
          try {
            setLoadingResend(true);
            await actions.sendEmailCode(email);
            setSecondsLeft(RESEND_COOLDOWN_SEC);
          } catch {
            Alert.alert("Ошибка", "Не удалось отправить код");
          } finally {
            setLoadingResend(false);
          }
        }}
      />
      <Text style={styles.hint}>Тестовый код: 123456</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: spacing.lg, gap: spacing.xs, justifyContent: "center", backgroundColor: colors.bg },
  title: { fontSize: 38, lineHeight: 42, fontWeight: "800", color: colors.title },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm },
  emailInput: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: colors.surface
  },
  otpWrap: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm, marginBottom: spacing.xs },
  hiddenInput: { position: "absolute", opacity: 0, width: 1, height: 1 },
  otpCell: {
    width: 46,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  otpCellActive: { borderColor: colors.orange },
  otpCellText: { fontSize: 22, fontWeight: "700", color: colors.title },
  timerText: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  linkRow: { alignItems: "flex-start", marginBottom: spacing.sm },
  changeLink: { fontSize: 13, color: colors.orangeDark, textDecorationLine: "underline" },
  hint: { fontSize: 12, color: colors.muted, marginTop: spacing.xs, textAlign: "center" }
});
