export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  MyLeads: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  AuthEmail: undefined;
  AuthOtp: { email: string };
  MainTabs: undefined;
  LeadDetails: { id: string };
  Paywall: { returnToLeadId?: string } | undefined;
  CategoryPayments: undefined;
  News: undefined;
  Feedback: undefined;
};

