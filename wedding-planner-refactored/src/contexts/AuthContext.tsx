import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  /** DB의 users.user_id (BIGINT). Supabase Auth UUID와 다르므로 반드시 이 값을 사용하세요. */
  dbUserId: number | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Supabase Auth user.id(UUID)로 public.users 테이블의 numeric user_id를 조회합니다.
 * users 테이블이 auth.users와 별도의 numeric PK를 사용하는 구조이므로 필수.
 */
async function fetchDbUserId(email: string): Promise<number | null> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    console.error("[AuthContext] dbUserId 조회 실패:", error.message);
    return null;
  }
  return data?.user_id ?? null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [dbUserId, setDbUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSession = async (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    if (newSession?.user?.email) {
      const id = await fetchDbUserId(newSession.user.email);
      setDbUserId(id);
    } else {
      setDbUserId(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("[AuthContext] signOut 실패:", error.message);
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ user, session, dbUserId, isLoading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
