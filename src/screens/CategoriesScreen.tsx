import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function CategoriesScreen() {
  const { state, actions } = useApp();
  const [draft, setDraft] = useState<string[]>(state.categories.selected);

  const toggle = (category: string) => {
    setDraft((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.card}>
          <Text style={styles.title}>Категории техники</Text>
          <Text style={styles.subtitle}>Выберите категории, которые хотите получать</Text>
          <View style={styles.list}>
            {state.categories.all.map((item) => {
              const checked = draft.includes(item);
              return (
                <Pressable key={item} onPress={() => toggle(item)} style={styles.row}>
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <Text style={styles.check}>✓</Text> : null}
                  </View>
                  <Text style={styles.rowText}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </AppCard>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Сохранить" onPress={() => actions.setSelectedCategories(draft)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 90 },
  card: { padding: spacing.md },
  title: { fontSize: 20, fontWeight: "700", color: colors.title },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  list: { marginTop: spacing.md, gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  checkboxChecked: {
    borderColor: colors.blue,
    backgroundColor: "#e8f4fb"
  },
  check: { color: colors.blue, fontWeight: "700" },
  rowText: { fontSize: 15, color: colors.textPrimary, fontWeight: "600" },
  footer: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md
  }
});

