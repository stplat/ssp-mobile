import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

import { AppCard } from "../components/AppCard";
import { useApp } from "../state/AppState";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { formatDateTime } from "../ui/format";
import type { RootStackParamList } from "../navigation/types";

export function MyLeadsScreen() {
  const { state, actions } = useApp();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const revealed = useMemo(() => {
    return state.leads.items.filter((item) => state.leads.revealedContactByLeadId[item.id]);
  }, [state.leads.items, state.leads.revealedContactByLeadId]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {revealed.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Пока нет заявок</Text>
          <Text style={styles.emptyText}>Откройте контакт в ленте, и заявка появится здесь</Text>
        </View>
      ) : null}
      {revealed.map((lead) => {
        const status = state.leads.workStatusByLeadId[lead.id] ?? "new";
        return (
          <AppCard key={lead.id} style={styles.card}>
            <Pressable onPress={() => navigation.navigate("LeadDetails", { id: lead.id })}>
              <Text style={styles.title}>{lead.category_title}</Text>
              <Text style={styles.meta}>{formatDateTime(lead.created_at)} • {lead.location_text}</Text>
              <Text style={styles.phone}>{lead.contact.phone}</Text>
            </Pressable>
            <View style={styles.statusRow}>
              <Pressable
                onPress={() => actions.setLeadStatus(lead.id, "new")}
                style={[styles.statusChip, status === "new" && styles.statusChipActive]}
              >
                <Text style={styles.statusText}>Новый</Text>
              </Pressable>
              <Pressable
                onPress={() => actions.setLeadStatus(lead.id, "in_progress")}
                style={[styles.statusChip, status === "in_progress" && styles.statusChipActive]}
              >
                <Text style={styles.statusText}>В работе</Text>
              </Pressable>
            </View>
          </AppCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 80 },
  card: { padding: 12, gap: 10 },
  title: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  meta: { fontSize: 13, color: colors.muted, marginTop: 4 },
  phone: { fontSize: 14, color: colors.blueDark, marginTop: 8, fontWeight: "700" },
  statusRow: { flexDirection: "row", gap: spacing.xs },
  statusChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusChipActive: { borderColor: colors.blue, backgroundColor: "#e8f4fb" },
  statusText: { fontSize: 13, color: colors.textSecondary, fontWeight: "600" },
  emptyWrap: { marginTop: 80, alignItems: "center", gap: 4 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.muted }
});

