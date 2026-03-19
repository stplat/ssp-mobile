import React from "react";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

async function openUrl(url: string) {
  const ok = await Linking.canOpenURL(url);
  if (!ok) {
    Alert.alert("Не удалось открыть ссылку");
    return;
  }
  await Linking.openURL(url);
}

export function FeedbackScreen() {
  return (
    <View style={styles.root}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Обратная связь</Text>
        <Text style={styles.subtitle}>Свяжитесь с нами удобным способом</Text>
        <View style={styles.buttons}>
          <AppButton title="Написать в Telegram" onPress={() => openUrl("https://t.me/triartsm")} />
          <AppButton title="Написать на email" variant="secondary" onPress={() => openUrl("mailto:triartssm@mail.ru")} />
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  card: { padding: spacing.md, gap: spacing.sm },
  title: { fontSize: 20, fontWeight: "700", color: colors.title },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  buttons: { gap: spacing.sm, marginTop: spacing.xs }
});

