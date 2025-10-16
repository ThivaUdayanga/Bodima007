// src/services/AuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign up with email + password
 * Optionally set displayName from first/last
 */
export async function signUp({ email, password, firstName, lastName, role, mobile, nic }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // set displayName (optional)
  const displayName = [firstName, lastName].filter(Boolean).join(' ');
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  // If you later add Firestore, save extra fields (role/mobile/nic) there.
  // For now we just return the user:
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
