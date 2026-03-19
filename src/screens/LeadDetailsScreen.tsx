import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";

import type { RootStackParamList } from "../navigation/types";
import { useApp } from "../state/AppState";
import { formatDateTime } from "../ui/format";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { AppCard } from "../components/AppCard";
import { AppButton } from "../components/AppButton";

type Props = NativeStackScreenProps<RootStackParamList, "LeadDetails">;

function maskPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.length <= 6) return "••••••";
  return `${digits.slice(0, 3)} ••• •• ••`;
}

export function LeadDetailsScreen({ navigation, route }: Props) {
  const { state, actions } = useApp();
  const id = route.params.id;
  const lead = useMemo(() => state.leads.items.find((x) => x.id === id), [id, state.leads.items]);

  const revealed = actions.isContactRevealed(id);
  const canReveal = actions.canRevealContact(id);

  if (!lead) {
    return (
      <View style={styles.root}>
        <Text>Заявка не найдена</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppCard style={styles.block}>
        <Text style={styles.label}>Категория</Text>
        <Text style={styles.value}>{lead.category_title}</Text>
      </AppCard>

      <AppCard style={styles.block}>
        <Text style={styles.label}>Локация</Text>
        <Text style={styles.value}>{lead.location_text}</Text>
      </AppCard>

      <AppCard style={styles.block}>
        <Text style={styles.label}>Дата/время</Text>
        <Text style={styles.value}>{formatDateTime(lead.scheduled_at ?? lead.created_at)}</Text>
      </AppCard>

      <AppCard style={styles.block}>
        <Text style={styles.label}>Описание</Text>
        <Text style={styles.value}>{lead.description}</Text>
      </AppCard>

      <AppCard style={styles.contactBlock}>
        <Text style={styles.contactTitle}>Контакт</Text>
        <Text style={styles.contactPhone}>
          {revealed ? lead.contact.phone : maskPhone(lead.contact.phone)}
        </Text>

        <View style={styles.buttons}>
          {!revealed ? (
            canReveal ? (
              <AppButton
                title="Открыть контакт"
                onPress={() => {
                  actions.revealContact(id);
                }}
              />
            ) : !state.session.isAuthed ? (
              <AppButton title="Войти для открытия контакта" onPress={() => navigation.navigate("AuthEmail")} />
            ) : (
              <AppButton
                title="Оформить подписку"
                onPress={() => navigation.navigate("Paywall", { returnToLeadId: id })}
              />
            )
          ) : (
            <AppButton
              title="Позвонить"
              onPress={async () => {
                const url = `tel:${lead.contact.phone}`;
                const ok = await Linking.canOpenURL(url);
                if (!ok) {
                  Alert.alert("Не удалось открыть звонок");
                  return;
                }
                await Linking.openURL(url);
              }}
            />
          )}
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.md, backgroundColor: colors.bg, gap: spacing.sm },
  block: { gap: 4, padding: 12 },
  label: { fontSize: 12, color: colors.muted },
  value: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  contactBlock: {
    marginTop: 6,
    padding: 12,
    gap: 8
  },
  contactTitle: { fontSize: 14, fontWeight: "700", color: colors.blueDark },
  contactPhone: { fontSize: 18, fontWeight: "800", color: colors.title },
  buttons: { marginTop: 6 }
});

