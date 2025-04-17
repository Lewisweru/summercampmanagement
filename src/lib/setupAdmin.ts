import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const setupDefaultAdmin = async () => {
  const adminEmail = 'admin@campexplorer.com';
  const adminPassword = 'Admin123!@#';

  try {
    const { user } = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('Default admin account created successfully');
    return {
      email: adminEmail,
      password: adminPassword,
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin account already exists');
      return;
    }
    console.error('Error setting up admin account:', error);
    throw error;
  }
};