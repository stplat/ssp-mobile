import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import type { RootStackParamList } from "../navigation/types";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { formatDateTime } from "../ui/format";

export function ProfileScreen() {
  const { state, actions } = useApp();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const subText = useMemo(() => {
    const until = state.me.subscriptionActiveUntil;
    if (!until || new Date(until).getTime() < Date.now()) return "Не активна";
    return `Активна до ${formatDateTime(until)}`;
  }, [state.me.subscriptionActiveUntil]);

  if (!state.session.isAuthed) {
    return (
      <View style={styles.root}>
        <View style={styles.guestHero} />
        <AppCard style={styles.guestCard}>
          <Text style={styles.guestTitle}>Вы не авторизованы</Text>
          <Text style={styles.guestText}>
            Войдите в профиль, чтобы сохранить проекты, получать доступ к данным и использовать все возможности
          </Text>
        </AppCard>
        <AppButton title="Войти в профиль" onPress={() => navigation.navigate("AuthEmail")} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.line}>Username: {state.me.username}</Text>
        <Text style={styles.line}>Email: {state.session.email ?? "—"}</Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.title}>Доступ</Text>
        <Text style={styles.line}>Подписка: {subText}</Text>
        <Text style={styles.line}>Бесплатные просмотры: {state.me.freeContactViewsLeft}/3</Text>
      </AppCard>

      <View style={styles.menu}>
        <AppButton title="Тарифы" onPress={() => navigation.navigate("Paywall")} />
        <AppButton
          title="Оплата по категориям"
          variant="secondary"
          onPress={() => navigation.navigate("CategoryPayments")}
        />
        <AppButton title="Новости" variant="secondary" onPress={() => navigation.navigate("News")} />
        <AppButton
          title="Обратная связь"
          variant="secondary"
          onPress={() => navigation.navigate("Feedback")}
        />
        <AppButton title="Выйти" variant="secondary" onPress={actions.logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: spacing.md, gap: spacing.sm },
  guestHero: {
    marginTop: spacing.lg,
    height: 240,
    borderRadius: 24,
    backgroundColor: "#edf0f6"
  },
  guestCard: { marginTop: -42, padding: spacing.md, gap: 6 },
  guestTitle: { fontSize: 34, lineHeight: 38, fontWeight: "800", color: colors.title },
  guestText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.xs },
  card: { padding: spacing.md, gap: 6 },
  title: { fontSize: 18, fontWeight: "700", color: colors.title, marginBottom: 3 },
  line: { fontSize: 14, color: colors.textSecondary },
  menu: { marginTop: spacing.xs, gap: spacing.xs }
});

