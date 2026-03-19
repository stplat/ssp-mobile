import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

import { useApp } from "../state/AppState";
import { formatDateTime } from "../ui/format";
import type { Lead } from "../types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { AppCard } from "../components/AppCard";
import type { RootStackParamList } from "../navigation/types";

function LeadRow({
  item,
  isRead,
  onPress
}: {
  item: Lead;
  isRead: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.category}>{item.category_title}</Text>
        {!isRead ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.meta} numberOfLines={1}>
        {item.location_text} • {formatDateTime(item.scheduled_at ?? item.created_at)}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {item.description}
      </Text>
      </AppCard>
    </Pressable>
  );
}

export function LeadsListScreen() {
  const { state, actions } = useApp();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<"all" | "new">("all");

  const headerText = useMemo(() => {
    const until = state.me.subscriptionActiveUntil;
    if (until && new Date(until).getTime() > Date.now()) {
      return `Подписка активна до ${formatDateTime(until)}`;
    }
    return `Бесплатных открытий осталось: ${state.me.freeContactViewsLeft}/3`;
  }, [state.me.freeContactViewsLeft, state.me.subscriptionActiveUntil]);

  const data = useMemo(() => {
    if (filter === "all") return state.leads.items;
    return state.leads.items.filter((item) => !state.leads.locallyReadByLeadId[item.id]);
  }, [filter, state.leads.items, state.leads.locallyReadByLeadId]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
      <View style={styles.filters}>
        <Pressable
          onPress={() => setFilter("all")}
          style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>Все</Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter("new")}
          style={[styles.filterChip, filter === "new" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "new" && styles.filterTextActive]}>Только NEW</Text>
        </Pressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(x) => x.id}
        onRefresh={actions.refreshLeadsStub}
        refreshing={state.leads.isRefreshing}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.6}
        onEndReached={() => actions.loadMoreLeadsStub()}
        ListFooterComponent={
          state.leads.isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Нет заявок</Text>
            <Text style={styles.emptyHint}>Попробуйте обновить список позже</Text>
          </View>
        }
        renderItem={({ item }) => (
          <LeadRow
            item={item}
            isRead={!!state.leads.locallyReadByLeadId[item.id]}
            onPress={() => {
              actions.markRead(item.id);
              navigation.navigate("LeadDetails", { id: item.id });
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  headerText: { fontSize: 14, fontWeight: "700", color: colors.blueDark },
  filters: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  filterChipActive: {
    borderColor: colors.blue,
    backgroundColor: "#e8f4fb"
  },
  filterText: { fontSize: 13, color: colors.textSecondary, fontWeight: "600" },
  filterTextActive: { color: colors.blueDark },
  listContent: { padding: spacing.md, gap: spacing.sm, paddingBottom: 80 },
  card: {
    padding: 12
  },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  category: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  meta: { marginTop: 6, fontSize: 13, color: colors.muted },
  desc: { marginTop: 6, fontSize: 14, color: colors.textSecondary },
  badge: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  badgeText: { color: "#2f2f2f", fontSize: 12, fontWeight: "700" },
  footer: { paddingVertical: 14 },
  emptyWrap: { alignItems: "center", marginTop: 64, gap: 4 },
  emptyTitle: { fontSize: 18, color: colors.textPrimary, fontWeight: "700" },
  emptyHint: { fontSize: 14, color: colors.muted }
});

