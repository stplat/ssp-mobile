import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function AuthScreen() {
  const { actions } = useApp();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const canContinuePhone = useMemo(() => phone.trim().length >= 7, [phone]);
  const canVerifyOtp = useMemo(() => otp.trim().length >= 4, [otp]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Вход</Text>
      <Text style={styles.subtitle}>StroyMechBot</Text>

      {step === "phone" ? (
        <>
          <Text style={styles.label}>Телефон</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+7..."
            keyboardType="phone-pad"
            autoComplete="tel"
            style={styles.input}
          />
          <View style={styles.spacer} />
          <AppButton
            title="Получить OTP"
            onPress={() => {
              if (!canContinuePhone) {
                Alert.alert("Введите телефон");
                return;
              }
              setStep("otp");
            }}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>OTP</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Код"
            keyboardType="number-pad"
            style={styles.input}
          />
          <View style={styles.row}>
            <AppButton title="Назад" variant="secondary" onPress={() => setStep("phone")} />
            <View style={styles.rowSpacer} />
            <AppButton
              title="Войти"
              onPress={async () => {
                if (!canVerifyOtp) {
                  Alert.alert("Введите код");
                  return;
                }
                await actions.authStubVerifyOtp(phone, otp);
              }}
            />
          </View>
          <View style={styles.help}>
            <Text style={styles.helpText}>OTP — заглушка для MVP.</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.md, gap: spacing.xs, justifyContent: "center", backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: "700", color: colors.title },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  label: { fontSize: 14, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: colors.surface
  },
  spacer: { height: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowSpacer: { width: 12 },
  help: { marginTop: 10 },
  helpText: { fontSize: 12, color: colors.muted }
});

