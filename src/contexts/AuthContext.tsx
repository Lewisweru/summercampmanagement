// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import {
User as FirebaseUser,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut as firebaseSignOut,
onAuthStateChanged,
getIdToken
} from 'firebase/auth';
import { auth } from '../lib/firebase'; // Use frontend client SDK

// NOTE: No imports from 'mongodb' or 'server/*' here

// Profile structure expected from the API
export interface Profile {
_id: string; // Assuming API returns string ID from MongoDB ObjectId
firebaseUid: string;
role: 'camper' | 'admin';
fullName: string;
email: string | null; // Email might be null from Firebase
dateOfBirth?: string | null;
phone?: string | null;
emergencyContact?: string | null;
medicalConditions?: string | null;
profilePicture?: string | null;
createdAt?: string | Date;
updatedAt?: string | Date;
}

interface AuthContextType {
user: FirebaseUser | null;
profile: Profile | null;
loading: boolean;
getIdToken: () => Promise<string | null>;
signUp: (email: string, password: string, role: 'camper' | 'admin', fullName: string) => Promise<void>;
signIn: (email: string, password: string) => Promise<void>;
signOut: () => Promise<void>;
updateProfile: (profileData: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>) => Promise<Profile | void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Read API base URL from Vite env var, fallback to relative /api for local proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
console.log(`[AuthContext] Using API Base URL: ${API_BASE_URL}`); // Log base URL being used

// --- API Helper Function ---
const fetchApi = async (
  url: string,
  token: string | null,
  options: Omit<RequestInit, 'body'> & { body?: any } = {}
  ) => {
  const headers: Record<string, string> = {};
  if (options.headers) {
      const tempHeaders = new Headers(options.headers);
      tempHeaders.forEach((value, key) => { headers[key] = value; });
  }
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  let bodyToSend: BodyInit | null | undefined = undefined;
  if (options.body !== undefined && options.body !== null) {
      if (typeof options.body === 'object' && !(options.body instanceof Blob || options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof ReadableStream || options.body instanceof ArrayBuffer || ArrayBuffer.isView(options.body))) {
          try {
              bodyToSend = JSON.stringify(options.body);
              if (!headers['Content-Type'] && !headers['content-type']) { headers['Content-Type'] = 'application/json'; }
          } catch (error) { throw new Error("Invalid request body data"); }
      } else { bodyToSend = options.body as BodyInit; }
  }

  const fullUrl = `${API_BASE_URL}${url}`; // Construct full URL
  console.log(`[API Call] ${options.method || 'GET'} ${fullUrl}`);
  const fetchOptions: RequestInit = { ...options, headers: headers, body: bodyToSend };

  try {
      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok) {
          let errorMsg = `API Error: ${response.status} ${response.statusText}`;
          try { const errorBody = await response.json(); errorMsg = errorBody.message || errorMsg; } catch (e) {}
          console.error(`[API Response Error] ${options.method || 'GET'} ${fullUrl}: Status ${response.status} - ${errorMsg}`);
          const error = new Error(errorMsg); (error as any).status = response.status; throw error;
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
          console.log(`[API Response] ${options.method || 'GET'} ${fullUrl}: Success (No Content)`); return null;
      }

      const data = await response.json();
      console.log(`[API Response] ${options.method || 'GET'} ${fullUrl}: Success`);
      return data;
  } catch (error: any) {
       // Catch network errors or JSON parsing errors
       console.error(`[API Call Error] Failed to fetch ${fullUrl}:`, error);
       // Re-throw a generic error or the specific error
       throw new Error(`Network error or invalid response from API: ${error.message || error}`);
  }
}

// --- Specific API Call Functions ---
const fetchProfileFromAPI = async (token: string): Promise<Profile | null> => {
  try { return await fetchApi('/users/profile/me', token); }
  catch (error: any) {
      if (error.status === 404) { console.warn("[AuthContext] Profile fetch returned 404."); return null; }
      console.error("[AuthContext] Error fetching profile:", error); throw error;
  }
};
const syncProfileViaAPI = async (fbUser: FirebaseUser, role: 'camper' | 'admin', fullName: string): Promise<Profile> => {
  const token = await fbUser.getIdToken();
  return fetchApi('/users/sync', token, { method: 'POST', body: { role, fullName } });
};
const updateProfileViaAPI = async (token: string, data: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>): Promise<Profile> => {
   return fetchApi('/users/profile', token, { method: 'PATCH', body: data });
};

// --- AuthProvider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [user, setUser] = useState<FirebaseUser | null>(null);
const [profile, setProfile] = useState<Profile | null>(null);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    setLoading(true); // Indicate loading during auth check/profile fetch
    setUser(firebaseUser);
    if (firebaseUser) {
      console.log('[Auth State] User detected:', firebaseUser.uid);
      try {
        const token = await firebaseUser.getIdToken(true); // Force refresh token on state change
        const fetchedProfile = await fetchProfileFromAPI(token);
        setProfile(fetchedProfile);
        if (!fetchedProfile) {
            console.warn('[Auth State] User logged in but profile not found in backend.');
        }
      } catch (error) {
        console.error("[Auth State] Error fetching profile after auth change:", error);
        setProfile(null); // Clear profile on fetch error
        // Maybe sign out? signOut(); // Decide if critical error warrants sign out
      }
    } else {
      console.log('[Auth State] No user detected.');
      setProfile(null); // Clear profile if no Firebase user
    }
    setLoading(false); // Done loading for this auth state change
  });
  return () => unsubscribe();
}, []); // Run only on mount

const signUp = async (email: string, password: string, role: 'camper' | 'admin', fullName: string) => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
  try {
      await syncProfileViaAPI(firebaseUser, role, fullName);
      console.log(`[AuthContext] Profile sync initiated via API for ${firebaseUser.uid}`);
      // onAuthStateChanged will handle fetching the profile
  } catch(error) {
      console.error("Signup failed during API profile sync:", error);
      // Consider deleting the Firebase user if backend sync fails critically
      // await firebaseUser.delete().catch(delErr => console.error("Failed to delete Firebase user after sync error:", delErr));
      throw error; // Let the UI handle the error display
  }
};

const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
  // onAuthStateChanged handles fetching profile
};

const signOut = async () => {
  await firebaseSignOut(auth);
   // onAuthStateChanged handles clearing user/profile state
};

const updateProfile = async (profileData: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>) => {
  if (!user) throw new Error("User not logged in");
  const token = await user.getIdToken();
  const updatedProfileData = await updateProfileViaAPI(token, profileData);
  setProfile((prev: Profile | null) => prev ? { ...prev, ...updatedProfileData } : updatedProfileData);
  return updatedProfileData;
};

const getToken = async (): Promise<string | null> => {
  if (!user) return null;
  try { return await getIdToken(user); }
  catch (error) { console.error("Error getting ID token:", error); return null; }
};

return (
  <AuthContext.Provider value={{ user, profile, loading, getIdToken: getToken, signUp, signIn, signOut, updateProfile }}>
    {!loading ? children : <SplashScreen />}
  </AuthContext.Provider>
);
};

// --- SplashScreen and useAuth hook ---
const SplashScreen = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading Camp Explorer...</div>
  </div>
);
export const useAuth = (): AuthContextType => {
const context = useContext(AuthContext);
if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
return context;
};