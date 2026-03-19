import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/types";
import { useApp } from "../state/AppState";
import { formatDateTime } from "../ui/format";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

export function PaywallScreen({ navigation, route }: Props) {
  const { state, actions } = useApp();

  const until = state.me.subscriptionActiveUntil;
  const isActive = until ? new Date(until).getTime() > Date.now() : false;

  return (
    <View style={styles.root}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Безлимит контактов</Text>
        <Text style={styles.subtitle}>Подписка на 30 дней</Text>
        <View style={styles.box}>
          <Text style={styles.small}>3 бесплатных открытия, затем подписка</Text>
          {isActive ? (
            <Text style={styles.active}>Подписка активна до {formatDateTime(until)}</Text>
          ) : (
            <Text style={styles.small}>Подписка не активна</Text>
          )}
        </View>
      </AppCard>

      <AppButton
        title="Оплатить"
        onPress={() => {
          actions.activateSubscriptionStub30d();
          const returnToLeadId = route.params?.returnToLeadId;
          if (returnToLeadId) {
            navigation.replace("LeadDetails", { id: returnToLeadId });
            return;
          }
          navigation.goBack();
        }}
      />
      <AppButton
        title="Оплата по категориям"
        variant="secondary"
        onPress={() => navigation.navigate("CategoryPayments")}
      />
      <View style={styles.hintWrap}>
        <Text style={styles.hint}>Что получаю: открытие контактов без лимита</Text>
        {isActive && <Text style={styles.hint}>Статус: активна</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.bg,
    gap: spacing.sm,
    justifyContent: "center"
  },
  card: { padding: spacing.lg, backgroundColor: "#fff8e3", borderColor: "#f5c24f" },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", color: colors.title },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: "center", marginTop: 3 },
  box: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#f1d38a",
    borderRadius: 12,
    padding: 12,
    gap: 6
  },
  small: { fontSize: 13, color: colors.textSecondary, textAlign: "center" },
  active: { fontSize: 13, fontWeight: "700", textAlign: "center", color: colors.blueDark },
  hintWrap: { marginTop: spacing.xs, alignItems: "center", gap: 2 },
  hint: { fontSize: 12, color: colors.muted }
});

