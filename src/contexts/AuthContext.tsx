// src/contexts/AuthContext.tsx

// --- Add ALL necessary imports here ---
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode // Type for children prop
} from 'react';
import {
User as FirebaseUser, // Rename Firebase User type
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut as firebaseSignOut,
onAuthStateChanged,
getIdToken
} from 'firebase/auth';
import { auth } from '../lib/firebase'; // Import your initialized Firebase auth client
// --- End Imports ---


// --- Define Profile structure FIRST ---
export interface Profile {
_id: string;
firebaseUid: string;
role: 'camper' | 'admin';
fullName: string;
email: string;
dateOfBirth?: string | null;
phone?: string | null;
emergencyContact?: string | null;
medicalConditions?: string | null;
profilePicture?: string | null;
createdAt?: string | Date;
updatedAt?: string | Date;
}

// --- Define Context Type AFTER Profile ---
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

// --- Define API Base URL ---
const API_BASE_URL = '/api'; // Uses Vite proxy

// --- Create Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- API Helper Function (fetchApi - Use the corrected version from the previous step) ---
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

  console.log(`[API Call] ${options.method || 'GET'} ${url}`);
  const fetchOptions: RequestInit = { ...options, headers: headers, body: bodyToSend };
  const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

  if (!response.ok) {
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try { const errorBody = await response.json(); errorMsg = errorBody.message || errorMsg; } catch (e) {}
      console.error(`[API Response Error] ${options.method || 'GET'} ${url}: ${errorMsg}`);
      const error = new Error(errorMsg); (error as any).status = response.status; throw error;
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
      console.log(`[API Response] ${options.method || 'GET'} ${url}: Success (No Content)`); return null;
  }

  try { const data = await response.json(); console.log(`[API Response] ${options.method || 'GET'} ${url}:`, data); return data; }
  catch (error) { console.error(`[API Response Error] Failed to parse JSON for ${url}:`, error); throw new Error(`Invalid JSON response from server for ${url}`); }
}

// --- Placeholder API Functions using the revised helper ---
const fetchProfileFromAPI = async (token: string): Promise<Profile | null> => {
  try { return await fetchApi('/users/profile/me', token); }
  catch (error: any) {
      if (error.status === 404) { console.warn("Profile fetch returned 404"); return null; }
      console.error("Error in fetchProfileFromAPI:", error); throw error;
  }
};
const syncProfileViaAPI = async (fbUser: FirebaseUser, role: 'camper' | 'admin', fullName: string): Promise<Profile> => {
const token = await fbUser.getIdToken(); return fetchApi('/users/sync', token, { method: 'POST', body: { role, fullName } });
};
const updateProfileViaAPI = async (token: string, data: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>): Promise<Profile> => {
   return fetchApi('/users/profile', token, { method: 'PATCH', body: data });
};


// --- AuthProvider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [user, setUser] = useState<FirebaseUser | null>(null);
const [profile, setProfile] = useState<Profile | null>(null);
const [loading, setLoading] = useState<boolean>(true); // Explicitly boolean

useEffect(() => {
  // Add type annotation for firebaseUser parameter
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    setLoading(true);
    setUser(firebaseUser);
    if (firebaseUser) {
      console.log('[Auth State] User detected:', firebaseUser.uid);
      try {
        const token = await firebaseUser.getIdToken(true);
        const fetchedProfile = await fetchProfileFromAPI(token);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("[Auth State] Error fetching profile:", error);
        setProfile(null);
      }
    } else {
      console.log('[Auth State] No user detected.');
      setProfile(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

const signUp = async (email: string, password: string, role: 'camper' | 'admin', fullName: string) => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
  try { await syncProfileViaAPI(firebaseUser, role, fullName); }
  catch(error) { console.error("Signup failed during API profile sync:", error); throw error; }
};

const signIn = async (email: string, password: string) => { await signInWithEmailAndPassword(auth, email, password); };
const signOut = async () => { await firebaseSignOut(auth); };

const updateProfile = async (profileData: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>) => {
  if (!user) throw new Error("User not logged in");
  const token = await user.getIdToken();
  const updatedProfileData = await updateProfileViaAPI(token, profileData);
  // Add type annotation for prev parameter
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

// --- SplashScreen and useAuth hook (remain the same) ---
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