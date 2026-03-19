import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { AppCard } from "../components/AppCard";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

const NEWS = [
  { id: "n1", title: "Новые заявки по Москве", text: "В сервисе увеличился поток заявок в пиковые часы." },
  { id: "n2", title: "Обновлены тарифы", text: "Добавили удобную оплату по отдельным категориям техники." },
  { id: "n3", title: "Стабильность сервиса", text: "Улучшили скорость обновления ленты заявок." }
];

export function NewsScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {NEWS.map((item) => (
        <AppCard key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </AppCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 80 },
  card: { padding: spacing.md, gap: 8 },
  title: { fontSize: 16, color: colors.textPrimary, fontWeight: "700" },
  text: { fontSize: 14, color: colors.textSecondary }
});

