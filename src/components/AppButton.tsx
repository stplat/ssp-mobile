import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
  disabled = false,
  loading = false
}: Props) {
  const secondary = variant === "secondary";
  return (
    <Pressable
      style={[
        styles.base,
        secondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={[styles.text, secondary ? styles.secondaryText : styles.primaryText]}>
        {loading ? "Загрузка..." : title}
      </Text>
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
    borderColor: colors.orangeDark,
    backgroundColor: colors.orange
  },
  secondary: {
    borderColor: "#ebedf3",
    backgroundColor: "#f2f4f8"
  },
  text: {
    fontSize: 15,
    fontWeight: "700"
  },
  primaryText: {
    color: "#fff"
  },
  secondaryText: {
    color: colors.textPrimary
  },
  disabled: {
    opacity: 0.55
  }
});

