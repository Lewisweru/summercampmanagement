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
import { auth } from '../lib/firebase';

// --- Profile Interface ---
export interface Profile {
_id: string;
firebaseUid: string;
role: 'camper' | 'admin';
fullName: string;
email: string | null;
dateOfBirth?: string | null;
phone?: string | null;
emergencyContact?: string | null;
medicalConditions?: string | null;
profilePicture?: string | null;
createdAt?: string | Date;
updatedAt?: string | Date;
}

// --- Context Type ---
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

// --- Context Definition ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- API Configuration ---
// Read API base URL from Vite env var, fallback to empty string for relative paths
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
console.log(`[AuthContext] Using API Base URL: ${API_BASE_URL || '(Relative /api)'}`);

// --- API Helper Function ---
const fetchApi = async (
  url: string, // Expects path starting with /, e.g., /api/users/profile/me
  token: string | null,
  options: Omit<RequestInit, 'body'> & { body?: any } = {}
  ) => {

  const headers: Record<string, string> = {};
  if (options.headers) {
      // Safely copy headers
      const tempHeaders = new Headers(options.headers);
      tempHeaders.forEach((value, key) => { headers[key] = value; });
  }
  if (token) {
      headers['Authorization'] = `Bearer ${token}`;
  }

  let bodyToSend: BodyInit | null | undefined = undefined;
  if (options.body !== undefined && options.body !== null) {
      // Check if it's a plain object needing stringification
      if (typeof options.body === 'object' &&
          !(options.body instanceof Blob || options.body instanceof FormData ||
            options.body instanceof URLSearchParams || options.body instanceof ReadableStream ||
            options.body instanceof ArrayBuffer || ArrayBuffer.isView(options.body))
         )
      {
          try {
              bodyToSend = JSON.stringify(options.body);
              // Set Content-Type only if not already set
              if (!headers['Content-Type'] && !headers['content-type']) {
                  headers['Content-Type'] = 'application/json';
              }
          } catch (error) {
              console.error("Failed to stringify request body:", error);
              throw new Error("Invalid request body data");
          }
      } else {
          // Assign if it's already a valid BodyInit type
          bodyToSend = options.body as BodyInit;
      }
  }

  // Construct the full URL: Prepend API_BASE_URL if it's set (deployment)
  // Otherwise, use the relative path (local dev with proxy)
  const fullUrl = API_BASE_URL ? `${API_BASE_URL}${url}` : url;

  console.log(`[API Call] ${options.method || 'GET'} ${fullUrl}`);
  const fetchOptions: RequestInit = { ...options, headers: headers, body: bodyToSend };

  try {
      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok) {
          let errorMsg = `API Error: ${response.status} ${response.statusText}`;
          let errorBody = null;
          try {
              // Try to get more specific error from backend response body
              errorBody = await response.json();
              errorMsg = errorBody.message || errorMsg;
          } catch (e) { /* Ignore JSON parsing error if body isn't JSON */ }
          console.error(`[API Response Error] ${options.method || 'GET'} ${fullUrl}: Status ${response.status} - ${errorMsg}`);
          const error = new Error(errorMsg);
          (error as any).status = response.status; // Add status code to error
          (error as any).body = errorBody; // Add body if parsed
          throw error;
      }

      // Handle empty response body
      if (response.status === 204 || response.headers.get('content-length') === '0') {
          console.log(`[API Response] ${options.method || 'GET'} ${fullUrl}: Success (No Content)`);
          return null; // Return null for empty successful responses
      }

      // Parse JSON response
      const data = await response.json();
      console.log(`[API Response] ${options.method || 'GET'} ${fullUrl}: Success`);
      return data;

  } catch (error: any) {
       // Catch network errors (e.g., DNS, connection refused) or fetch-related issues
       if (!(error instanceof Error && (error as any).status)) { // Check if it's not an error we already threw
          console.error(`[API Call Error] Failed to fetch ${fullUrl}:`, error);
          throw new Error(`Network error or invalid response from API: ${error.message || 'Unknown fetch error'}`);
       } else {
          throw error; // Re-throw errors with status codes from the !response.ok block
       }
  }
}

// --- Specific API Call Functions ---
const fetchProfileFromAPI = async (token: string): Promise<Profile | null> => {
  try {
      // Pass the full relative path including /api
      return await fetchApi('/api/users/profile/me', token);
  } catch (error: any) {
      if (error.status === 404) {
          console.warn("[AuthContext] Profile fetch returned 404 (User profile not found in backend).");
          return null; // Treat 404 for profile as non-critical error, return null
      }
      // For other errors (500, network errors), log and re-throw
      console.error("[AuthContext] Error fetching profile:", error.message || error);
      throw error; // Re-throw to potentially handle in UI or higher level
  }
};

const syncProfileViaAPI = async (
firebaseUser: FirebaseUser,
role: 'camper' | 'admin',
fullName: string
): Promise<Profile> => { // Expect API to return the created/found profile
  const token = await firebaseUser.getIdToken();
  // Pass the full relative path including /api
  return fetchApi('/api/users/sync', token, {
      method: 'POST',
      body: { role, fullName } // Let fetchApi handle stringify
  });
};

const updateProfileViaAPI = async (
  token: string,
  profileData: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>
): Promise<Profile> => { // Expect API to return updated profile
   // Pass the full relative path including /api
   return fetchApi('/api/users/profile', token, {
       method: 'PATCH', // Assuming PATCH for updates
       body: profileData // Let fetchApi handle stringify
   });
};

// --- AuthProvider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [user, setUser] = useState<FirebaseUser | null>(null);
const [profile, setProfile] = useState<Profile | null>(null);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    console.log("[Auth State] Change detected. User:", firebaseUser?.uid || "null");
    setLoading(true);
    setUser(firebaseUser);

    if (firebaseUser) {
      try {
        console.log("[Auth State] Getting ID token...");
        const token = await firebaseUser.getIdToken(true); // Force refresh on auth change
        console.log("[Auth State] Fetching profile from API...");
        const fetchedProfile = await fetchProfileFromAPI(token);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("[Auth State] Error during profile fetch:", error);
        setProfile(null);
        // Optional: Sign out if critical error during initial profile load?
        // await firebaseSignOut(auth);
      }
    } else {
      setProfile(null); // Clear profile if Firebase user logs out
    }
    console.log("[Auth State] Processing complete.");
    setLoading(false);
  });
  // Cleanup subscription on unmount
  return () => {
      console.log("[Auth State] Unsubscribing listener.");
      unsubscribe();
  };
}, []); // Empty dependency array ensures this runs only once on mount

const signUp = async (email: string, password: string, role: 'camper' | 'admin', fullName: string) => {
  console.log(`[AuthContext] Initiating signup for ${email}`);
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
  console.log(`[AuthContext] Firebase user created: ${firebaseUser.uid}`);
  try {
      await syncProfileViaAPI(firebaseUser, role, fullName);
      console.log(`[AuthContext] Profile sync API call succeeded for ${firebaseUser.uid}`);
      // Profile state will be updated by the onAuthStateChanged listener automatically
  } catch(error) {
      console.error(`[AuthContext] Signup failed during API profile sync for ${firebaseUser.uid}:`, error);
      // Consider deleting the partially created Firebase user for consistency
      // await firebaseUser.delete().catch(delErr => console.error("Failed to delete Firebase user after sync error:", delErr));
      throw error; // Let the UI handle the error display
  }
};

const signIn = async (email: string, password: string) => {
  console.log(`[AuthContext] Initiating signin for ${email}`);
  await signInWithEmailAndPassword(auth, email, password);
  // onAuthStateChanged listener handles fetching profile
};

const signOut = async () => {
  console.log(`[AuthContext] Initiating signout for user: ${user?.uid}`);
  await firebaseSignOut(auth);
  // onAuthStateChanged listener handles clearing user/profile state
};

const updateProfile = async (profileData: Partial<Omit<Profile, '_id' | 'firebaseUid' | 'email' | 'createdAt' | 'role' | 'updatedAt'>>) => {
  if (!user) throw new Error("User not logged in");
  if (!profile) throw new Error("Profile not loaded, cannot update"); // Added profile check

  console.log(`[AuthContext] Initiating profile update for user: ${user.uid}`);
  const token = await user.getIdToken();
  const updatedProfileData = await updateProfileViaAPI(token, profileData);
  // Update local state with the data returned from the API
  setProfile((prev: Profile | null) => ({
      ...(prev ?? {} as Profile), // Keep existing fields if any
      ...updatedProfileData,      // Overwrite with updated fields
      _id: prev?._id ?? updatedProfileData._id // Ensure _id persists
  }));
  console.log(`[AuthContext] Local profile state updated for user: ${user.uid}`);
  return updatedProfileData;
};

const getToken = async (): Promise<string | null> => {
  if (!user) return null;
  try { return await getIdToken(user); }
  catch (error) { console.error("Error getting ID token:", error); return null; }
};

// Provide the context value
const authContextValue: AuthContextType = {
    user,
    profile,
    loading,
    getIdToken: getToken,
    signUp,
    signIn,
    signOut,
    updateProfile
};

return (
  <AuthContext.Provider value={authContextValue}>
    {!loading ? children : <SplashScreen />}
  </AuthContext.Provider>
);
};

// --- SplashScreen Component ---
const SplashScreen = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading Camp Explorer...</div>
      {/* Optional: Add a spinner SVG here */}
  </div>
);

// --- useAuth Hook ---
export const useAuth = (): AuthContextType => {
const context = useContext(AuthContext);
if (context === undefined) {
  throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};