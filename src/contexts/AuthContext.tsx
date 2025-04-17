import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { db, syncUserToMongoDB } from '../lib/mongodb';

interface Profile {
  id: string;
  role: 'camper' | 'admin';
  full_name: string;
  email: string;
  date_of_birth?: string;
  phone?: string;
  emergency_contact?: string;
  medical_conditions?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, role: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from MongoDB
        const userProfile = await db.collection('users').findOne({ firebaseUid: firebaseUser.uid });
        if (userProfile) {
          setProfile({
            id: userProfile._id.toString(),
            role: userProfile.role,
            full_name: userProfile.fullName,
            email: userProfile.email,
            date_of_birth: userProfile.dateOfBirth,
            phone: userProfile.phone,
            emergency_contact: userProfile.emergencyContact,
            medical_conditions: userProfile.medicalConditions,
            profile_picture: userProfile.profilePicture,
          });
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, role: string, fullName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in MongoDB
    await syncUserToMongoDB(user, {
      role,
      fullName,
      createdAt: new Date(),
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return;

    // Update profile in MongoDB
    await db.collection('users').updateOne(
      { firebaseUid: user.uid },
      { $set: { ...profileData, updatedAt: new Date() } }
    );

    // Fetch updated profile
    const updatedProfile = await db.collection('users').findOne({ firebaseUid: user.uid });
    if (updatedProfile) {
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};