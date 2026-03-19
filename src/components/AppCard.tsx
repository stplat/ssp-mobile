import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { colors } from "../theme/colors";

export function AppCard({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(45,93,118,0.12)",
    backgroundColor: colors.surface,
    shadowColor: "#234a5e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 3
  }
});

