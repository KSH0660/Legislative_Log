"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProfileKey } from "@/types/impact";
import type { ProfileAnswer, UserProfile } from "@/types/profile";

// 개인화 상태 보관. §13.2 · §13.3
//
// 규칙:
// 1. 첫 페인트는 언제나 비개인화 상태다. 서버 프리렌더 결과와 동일해야 한다.
//    `output: "export"`라 프리렌더 시점에는 프로필이 없고, 렌더 중에 sessionStorage를
//    읽으면 하이드레이션 불일치가 난다.
// 2. 저장된 프로필 복원은 useEffect 안에서만 한다.
// 3. 프로필 값은 URL·분석 이벤트·외부 API에 절대 싣지 않는다.

const STORAGE_KEY = "legislative-log.personalization.v1";
const REMEMBER_KEY = "legislative-log.personalization.remember.v1";

interface StoredState {
  profile: UserProfile;
  enabled: boolean;
}

interface PersonalizationContextValue {
  /** 저장된 값 복원이 끝났는가. false인 동안은 비개인화 화면을 보여준다. */
  ready: boolean;
  enabled: boolean;
  profile: UserProfile;
  /** 판정 기준일. ready 이후에만 채워진다. */
  asOf: string;
  /** 이 기기에 기억하기 */
  remember: boolean;
  setAnswer: (field: ProfileKey, answer: ProfileAnswer | null) => void;
  setEnabled: (value: boolean) => void;
  setRemember: (value: boolean) => void;
  /** 내 정보 지우기 — 두 저장소에서 모두 삭제한다 */
  clear: () => void;
  /** 스크린리더 안내용 메시지 (정렬 변경 등) */
  announcement: string;
  announce: (message: string) => void;
}

const PersonalizationContext = createContext<PersonalizationContextValue | null>(
  null,
);

function readStore(storage: Storage | undefined): StoredState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed || typeof parsed !== "object" || !parsed.profile) return null;
    return { profile: parsed.profile, enabled: Boolean(parsed.enabled) };
  } catch {
    // 사생활 보호 모드 등에서 접근이 막힐 수 있다. 실패해도 기능은 계속 돈다.
    return null;
  }
}

function writeStore(storage: Storage | undefined, state: StoredState | null) {
  if (!storage) return;
  try {
    if (state === null) storage.removeItem(STORAGE_KEY);
    else storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* 무시 */
  }
}

export function PersonalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabledState] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [remember, setRememberState] = useState(false);
  const [asOf, setAsOf] = useState("");
  const [announcement, setAnnouncement] = useState("");

  // 규칙 2 — 복원은 오직 여기서만.
  useEffect(() => {
    setAsOf(new Date().toISOString().slice(0, 10));

    let rememberFlag = false;
    try {
      rememberFlag = window.localStorage.getItem(REMEMBER_KEY) === "1";
    } catch {
      rememberFlag = false;
    }
    setRememberState(rememberFlag);

    const stored =
      (rememberFlag ? readStore(window.localStorage) : null) ??
      readStore(window.sessionStorage);
    if (stored) {
      setProfile(stored.profile);
      setEnabledState(stored.enabled);
    }
    setReady(true);
  }, []);

  const persist = useCallback(
    (next: StoredState, rememberFlag: boolean) => {
      writeStore(window.sessionStorage, next);
      if (rememberFlag) writeStore(window.localStorage, next);
      else writeStore(window.localStorage, null);
    },
    [],
  );

  const setAnswer = useCallback(
    (field: ProfileKey, answer: ProfileAnswer | null) => {
      setProfile((prev) => {
        const next = { ...prev };
        if (answer === null) delete next[field];
        else next[field] = answer;
        persist({ profile: next, enabled: true }, remember);
        return next;
      });
      setEnabledState(true);
    },
    [persist, remember],
  );

  const setEnabled = useCallback(
    (value: boolean) => {
      setEnabledState(value);
      persist({ profile, enabled: value }, remember);
    },
    [persist, profile, remember],
  );

  const setRemember = useCallback(
    (value: boolean) => {
      setRememberState(value);
      try {
        if (value) window.localStorage.setItem(REMEMBER_KEY, "1");
        else window.localStorage.removeItem(REMEMBER_KEY);
      } catch {
        /* 무시 */
      }
      persist({ profile, enabled }, value);
    },
    [persist, profile, enabled],
  );

  const clear = useCallback(() => {
    setProfile({});
    setEnabledState(false);
    setRememberState(false);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(REMEMBER_KEY);
    } catch {
      /* 무시 */
    }
    setAnnouncement("입력한 조건을 모두 지웠습니다.");
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  const value = useMemo<PersonalizationContextValue>(
    () => ({
      ready,
      enabled,
      profile,
      asOf,
      remember,
      setAnswer,
      setEnabled,
      setRemember,
      clear,
      announcement,
      announce,
    }),
    [
      ready,
      enabled,
      profile,
      asOf,
      remember,
      setAnswer,
      setEnabled,
      setRemember,
      clear,
      announcement,
      announce,
    ],
  );

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
      {/* 규칙 3 — 순서가 바뀌었다는 사실이 스크린리더 사용자에게 침묵으로 지나가지 않게 한다. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization(): PersonalizationContextValue {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) {
    throw new Error(
      "usePersonalization은 PersonalizationProvider 안에서만 쓸 수 있습니다.",
    );
  }
  return ctx;
}

/** 개인화 결과를 실제로 계산해도 되는 상태인가 */
export function useActivePersonalization() {
  const ctx = usePersonalization();
  return { ...ctx, active: ctx.ready && ctx.enabled };
}
