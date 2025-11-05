import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Profile, UserRole, User } from "@shared/api";
import { logError } from "@/lib/logger";

type Session = {
  user: User;
  token: string;
  [key: string]: any;
} | null;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    role?: UserRole,
    displayName?: string,
  ) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Auth API functions
const API_BASE = '/api';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      getCurrentUser()
        .then(({ user, profile }) => {
          setUser(user);
          setProfile(profile);
          setSession({ user, token });
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    const response = await apiCall<{ data: { id: string; email: string; name?: string; role: string; createdAt: string; updatedAt: string; profile: Profile } }>('/auth/me');
    const u = response.data;
    return {
      user: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: new Date(u.createdAt) as unknown as any,
        updatedAt: new Date(u.updatedAt) as unknown as any,
      } as unknown as User,
      profile: u.profile,
    };
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole = "FAN",
    displayName?: string,
  ) => {
    try {
      const response = await apiCall<{ data: { user: User; profile: Profile; token: string } }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, role, displayName, username: email.split('@')[0] }),
      });

      const { user, profile, token } = response.data;

      // Save token
      localStorage.setItem('authToken', token);

      // Update state
      setUser(user);
      setProfile(profile);
      setSession({ user, token });

      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiCall<{ data: { user: User; profile: Profile; token: string } }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const { user, profile, token } = response.data;

      // Save token
      localStorage.setItem('authToken', token);

      // Update state
      setUser(user);
      setProfile(profile);
      setSession({ user, token });

      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    // Remove token
    localStorage.removeItem('authToken');

    // Clear state
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;

    try {
      const response = await apiCall<{ data: Profile }>(`/profiles/${profile.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      setProfile(response.data);
    } catch (error) {
      logError('Failed to update profile', error as Error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}