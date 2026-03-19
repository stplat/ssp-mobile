import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

const PRICE = 800;

export function CategoryPaymentsScreen() {
  const { state } = useApp();
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {state.categories.all.map((category) => {
        const active = state.categories.selected.includes(category);
        return (
          <AppCard key={category} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{category}</Text>
                <Text style={styles.price}>{PRICE} ₽ / 30 дней</Text>
              </View>
              <View style={[styles.statusBadge, active ? styles.active : styles.inactive]}>
                <Text style={styles.statusText}>{active ? "Активна" : "Не активна"}</Text>
              </View>
            </View>
            <AppButton title="Оплатить" onPress={() => {}} />
          </AppCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 80 },
  card: { padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: 16, color: colors.textPrimary, fontWeight: "700" },
  price: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  active: { backgroundColor: "#e7f6ea" },
  inactive: { backgroundColor: "#f2f4f7" },
  statusText: { fontSize: 12, color: colors.blueDark, fontWeight: "700" }
});

