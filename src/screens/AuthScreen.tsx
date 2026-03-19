import React, { useMemo, useState } from "react";
import { Alert, ImageBackground, Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

import { AppButton } from "../components/AppButton";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import type { RootStackParamList } from "../navigation/types";
import Logo from "../assets/images/logo.svg";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function AuthScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { actions } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const canContinue = useMemo(() => isValidEmail(email), [email]);

  return (
    <ImageBackground
      source={require("../assets/images/main-bg.png")}
      style={styles.root}
      imageStyle={styles.bgImage}
    >
      <View style={styles.header}>
        <Logo width={120} height={32} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Добро пожаловать</Text>
        <Text style={styles.subtitle}>Войдите, чтобы получить доступ ко всем возможностям</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Введите ваш email"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          style={styles.input}
        />
        <View style={styles.spacer} />
        <AppButton
          title="Продолжить"
          loading={loading}
          disabled={!canContinue}
          onPress={async () => {
            if (!canContinue) {
              Alert.alert("Введите корректный email");
              return;
            }
            try {
              setLoading(true);
              await actions.sendEmailCode(email);
              navigation.navigate("AuthOtp", { email: email.trim().toLowerCase() });
            } catch {
              Alert.alert("Не удалось отправить код", "Попробуйте позже");
            } finally {
              setLoading(false);
            }
          }}
        />
        <View style={styles.spacer} />
        <AppButton
          title="Пропустить"
          variant="secondary"
          onPress={() => {
            actions.startGuestSession();
            navigation.navigate("MainTabs");
          }}
        />
        <View style={styles.links}>
          <Text style={styles.termsText}>Нажимая "Продолжить", вы соглашаетесь с</Text>
        </View>
        <View style={styles.links}>
          <Text style={styles.link} onPress={() => void Linking.openURL("https://example.com/terms")}>
            Условиями использования
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.link} onPress={() => void Linking.openURL("https://example.com/privacy")}>
            Политикой конфиденциальности
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg,
    justifyContent: "flex-end"
  },
  bgImage: {
    resizeMode: "cover",
    opacity: 0.9
  },
  header: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg
  },
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.xs
  },
  title: { fontSize: 38, lineHeight: 42, fontWeight: "800", color: colors.title },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.md },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    fontSize: 16,
    backgroundColor: colors.surface
  },
  spacer: { height: spacing.xs },
  links: { marginTop: 2, flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "center" },
  termsText: { fontSize: 12, color: colors.textSecondary },
  link: { color: colors.title, fontSize: 12, textDecorationLine: "underline" },
  dot: { color: colors.textSecondary, fontSize: 12 }
});

