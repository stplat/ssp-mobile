import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../theme/colors";
import type { MainTabParamList, RootStackParamList } from "./types";
import { AuthScreen } from "../screens/AuthScreen";
import { OtpScreen } from "../screens/OtpScreen";
import { LeadsListScreen } from "../screens/LeadsListScreen";
import { CategoriesScreen } from "../screens/CategoriesScreen";
import { MyLeadsScreen } from "../screens/MyLeadsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { LeadDetailsScreen } from "../screens/LeadDetailsScreen";
import { PaywallScreen } from "../screens/PaywallScreen";
import { CategoryPaymentsScreen } from "../screens/CategoryPaymentsScreen";
import { NewsScreen } from "../screens/NewsScreen";
import { FeedbackScreen } from "../screens/FeedbackScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarIcon: ({ color }) => {
          const icon =
            route.name === "Home"
              ? "🏠"
              : route.name === "Categories"
                ? "🗂️"
                : route.name === "MyLeads"
                  ? "📌"
                  : "👤";
          return <Text style={{ fontSize: 16, color }}>{icon}</Text>;
        }
      })}
    >
      <Tabs.Screen name="Home" component={LeadsListScreen} options={{ title: "Главная" }} />
      <Tabs.Screen name="Categories" component={CategoriesScreen} options={{ title: "Категории" }} />
      <Tabs.Screen name="MyLeads" component={MyLeadsScreen} options={{ title: "Мои заявки" }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: "Профиль" }} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AuthEmail" component={AuthScreen} options={{ title: "Вход" }} />
      <Stack.Screen name="AuthOtp" component={OtpScreen} options={{ title: "Подтверждение" }} />
      <Stack.Screen name="LeadDetails" component={LeadDetailsScreen} options={{ title: "Детали заявки" }} />
      <Stack.Screen name="Paywall" component={PaywallScreen} options={{ title: "Тариф" }} />
      <Stack.Screen
        name="CategoryPayments"
        component={CategoryPaymentsScreen}
        options={{ title: "Оплата по категориям" }}
      />
      <Stack.Screen name="News" component={NewsScreen} options={{ title: "Новости" }} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: "Обратная связь" }} />
    </Stack.Navigator>
  );
}

