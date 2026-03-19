import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export function AppButton({ title, onPress, variant = "primary", style }: Props) {
  const secondary = variant === "secondary";
  return (
    <Pressable
      style={[styles.base, secondary ? styles.secondary : styles.primary, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, secondary ? styles.secondaryText : styles.primaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1
  },
  primary: {
    borderColor: "#1f97d2",
    backgroundColor: "#2AABEE"
  },
  secondary: {
    borderColor: colors.line,
    backgroundColor: colors.surface
  },
  text: {
    fontSize: 15,
    fontWeight: "700"
  },
  primaryText: {
    color: "#fff"
  },
  secondaryText: {
    color: colors.blueDark
  }
});

