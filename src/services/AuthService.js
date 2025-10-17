// src/services/AuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Sign up with email + password
 * Optionally set displayName from first/last
 */
export async function signUp({ email, password, firstName, lastName, role, mobile, nic }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // set displayName (optional)
  const displayName = [firstName, lastName].filter(Boolean).join(' ');
  if (displayName)
    await updateProfile(cred.user, { displayName });

  // If you later add Firestore, save extra fields (role/mobile/nic) there.
  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: role || 'User',
      mobile: mobile || '',
      nic: nic || '',
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.log('Firestore user setup failed:', err);
    throw err;
  }

  return cred.user;
}

/** Login */
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(res => res.user);
}

/** Logout */
export function logOut() {
  return signOut(auth);
}
