import React, { createContext, useContext, useMemo, useReducer } from "react";

import { sendCode, verifyCode } from "../api/auth";
import { clearAccessToken, saveAccessToken } from "../api/tokenStorage";
import type { Lead, WorkStatus } from "../types";
import { seedLeads } from "../stub/seedLeads";

type SessionState = {
  isAuthed: boolean;
  isGuest: boolean;
  accessToken?: string;
  email?: string;
};

export type AppState = {
  session: SessionState;
  me: {
    freeContactViewsLeft: number; // N/3
    subscriptionActiveUntil?: string; // ISO string
    username: string;
  };
  categories: {
    all: string[];
    selected: string[];
  };
  leads: {
    items: Lead[];
    revealedContactByLeadId: Record<string, boolean>;
    locallyReadByLeadId: Record<string, boolean>;
    workStatusByLeadId: Record<string, WorkStatus>;
    cursor?: string;
    isRefreshing: boolean;
    isLoadingMore: boolean;
  };
};

type Action =
  | { type: "AUTH_SUCCESS"; email: string; accessToken: string; username: string }
  | { type: "START_GUEST" }
  | { type: "LOGOUT" }
  | { type: "REFRESH_START" }
  | { type: "REFRESH_DONE"; items: Lead[]; cursor?: string }
  | { type: "LOAD_MORE_START" }
  | { type: "LOAD_MORE_DONE"; items: Lead[]; cursor?: string }
  | { type: "SET_CATEGORIES"; selected: string[] }
  | { type: "MARK_READ"; id: string }
  | { type: "REVEAL_CONTACT"; id: string }
  | { type: "SET_WORK_STATUS"; id: string; status: WorkStatus }
  | { type: "ACTIVATE_SUBSCRIPTION"; untilIso: string };

const categories = ["Манипулятор", "Автокран", "Эвакуатор", "Самосвал", "Экскаватор"];

const initialState: AppState = {
  session: { isAuthed: false, isGuest: false },
  me: { freeContactViewsLeft: 3, username: "stsp" },
  categories: { all: categories, selected: categories.slice(0, 3) },
  leads: {
    items: seedLeads(12),
    revealedContactByLeadId: {},
    locallyReadByLeadId: {},
    workStatusByLeadId: {},
    cursor: "page:1",
    isRefreshing: false,
    isLoadingMore: false
  }
};

function hasActiveSubscription(untilIso?: string) {
  if (!untilIso) return false;
  return new Date(untilIso).getTime() > Date.now();
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        ...state,
        session: {
          isAuthed: true,
          isGuest: false,
          email: action.email,
          accessToken: action.accessToken
        },
        me: { ...state.me, username: action.username }
      };
    case "START_GUEST":
      return {
        ...state,
        session: { isAuthed: false, isGuest: true, email: undefined, accessToken: undefined }
      };
    case "LOGOUT":
      return { ...initialState, leads: { ...initialState.leads, items: state.leads.items } };
    case "REFRESH_START":
      return { ...state, leads: { ...state.leads, isRefreshing: true } };
    case "REFRESH_DONE":
      return {
        ...state,
        leads: {
          ...state.leads,
          items: action.items,
          cursor: action.cursor,
          isRefreshing: false
        }
      };
    case "LOAD_MORE_START":
      return { ...state, leads: { ...state.leads, isLoadingMore: true } };
    case "LOAD_MORE_DONE":
      return {
        ...state,
        leads: {
          ...state.leads,
          items: [...state.leads.items, ...action.items],
          cursor: action.cursor,
          isLoadingMore: false
        }
      };
    case "SET_CATEGORIES":
      return { ...state, categories: { ...state.categories, selected: action.selected } };
    case "MARK_READ":
      return {
        ...state,
        leads: {
          ...state.leads,
          locallyReadByLeadId: { ...state.leads.locallyReadByLeadId, [action.id]: true }
        }
      };
    case "REVEAL_CONTACT": {
      const alreadyRevealed = !!state.leads.revealedContactByLeadId[action.id];
      if (alreadyRevealed) {
        return state;
      }

      const subscriptionActive = hasActiveSubscription(state.me.subscriptionActiveUntil);
      const canUseFree = state.me.freeContactViewsLeft > 0;
      if (!subscriptionActive && !canUseFree) {
        return state;
      }

      return {
        ...state,
        me: subscriptionActive
          ? state.me
          : { ...state.me, freeContactViewsLeft: Math.max(0, state.me.freeContactViewsLeft - 1) },
        leads: {
          ...state.leads,
          revealedContactByLeadId: { ...state.leads.revealedContactByLeadId, [action.id]: true },
          workStatusByLeadId: {
            ...state.leads.workStatusByLeadId,
            [action.id]: state.leads.workStatusByLeadId[action.id] ?? "new"
          }
        }
      };
    }
    case "SET_WORK_STATUS":
      return {
        ...state,
        leads: {
          ...state.leads,
          workStatusByLeadId: { ...state.leads.workStatusByLeadId, [action.id]: action.status }
        }
      };
    case "ACTIVATE_SUBSCRIPTION":
      return { ...state, me: { ...state.me, subscriptionActiveUntil: action.untilIso } };
    default:
      return state;
  }
}

type AppActions = {
  sendEmailCode: (email: string) => Promise<void>;
  verifyEmailCode: (email: string, code: string) => Promise<void>;
  startGuestSession: () => void;
  logout: () => Promise<void>;
  refreshLeadsStub: () => Promise<void>;
  loadMoreLeadsStub: () => Promise<void>;
  setSelectedCategories: (selected: string[]) => void;
  markRead: (id: string) => void;
  canRevealContact: (leadId: string) => boolean;
  isContactRevealed: (leadId: string) => boolean;
  revealContact: (leadId: string) => void;
  setLeadStatus: (leadId: string, status: WorkStatus) => void;
  activateSubscriptionStub30d: () => void;
};

const Ctx = createContext<{ state: AppState; actions: AppActions } | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions: AppActions = useMemo(() => {
    return {
      sendEmailCode: async (email: string) => {
        if (!email.trim()) {
          throw new Error("EMPTY_EMAIL");
        }
        await sendCode({ email });
      },
      verifyEmailCode: async (email: string, code: string) => {
        if (!email.trim() || code.trim().length !== 6) {
          throw new Error("INVALID_INPUT");
        }
        const res = await verifyCode({ email, code });
        await saveAccessToken(res.accessToken);
        dispatch({
          type: "AUTH_SUCCESS",
          email: res.user.email,
          accessToken: res.accessToken,
          username: res.user.username
        });
      },
      startGuestSession: () => dispatch({ type: "START_GUEST" }),
      logout: async () => {
        await clearAccessToken();
        dispatch({ type: "LOGOUT" });
      },
      refreshLeadsStub: async () => {
        dispatch({ type: "REFRESH_START" });
        await new Promise<void>((resolve) => setTimeout(resolve, 350));
        dispatch({ type: "REFRESH_DONE", items: seedLeads(12), cursor: "page:1" });
      },
      loadMoreLeadsStub: async () => {
        if (state.leads.isLoadingMore) return;
        dispatch({ type: "LOAD_MORE_START" });
        await new Promise<void>((resolve) => setTimeout(resolve, 350));
        const next = seedLeads(8, state.leads.items.length);
        dispatch({ type: "LOAD_MORE_DONE", items: next, cursor: "page:next" });
      },
      setSelectedCategories: (selected: string[]) => dispatch({ type: "SET_CATEGORIES", selected }),
      markRead: (id: string) => dispatch({ type: "MARK_READ", id }),
      canRevealContact: (leadId: string) => {
        if (!state.session.isAuthed) return false;
        if (state.leads.revealedContactByLeadId[leadId]) return true;
        const subActive = hasActiveSubscription(state.me.subscriptionActiveUntil);
        return subActive || state.me.freeContactViewsLeft > 0;
      },
      isContactRevealed: (leadId: string) => !!state.leads.revealedContactByLeadId[leadId],
      revealContact: (leadId: string) => dispatch({ type: "REVEAL_CONTACT", id: leadId }),
      setLeadStatus: (leadId: string, status: WorkStatus) =>
        dispatch({ type: "SET_WORK_STATUS", id: leadId, status }),
      activateSubscriptionStub30d: () => {
        const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        dispatch({ type: "ACTIVATE_SUBSCRIPTION", untilIso: until });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.session.isAuthed,
    state.leads.isLoadingMore,
    state.leads.items.length,
    state.me.freeContactViewsLeft,
    state.me.subscriptionActiveUntil,
    state.leads.revealedContactByLeadId
  ]);

  return <Ctx.Provider value={{ state, actions }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

