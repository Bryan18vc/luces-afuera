
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export function watchAuth(callback){
  return onAuthStateChanged(auth, callback);
}

export async function login(email, password){
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function register(email, password, name){
  // Authentication is independent from Firestore.
  // If Firestore has a problem, the Firebase Auth account is still created.
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if(name.trim()){
    await updateProfile(cred.user, {displayName:name.trim()});
  }
  return cred;
}

export async function guest(){
  return signInAnonymously(auth);
}

export async function logout(){
  return signOut(auth);
}

export async function ensureProfile(user){
  try{
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if(!snap.exists()){
      await setDoc(ref, {
        name: user.displayName || (user.isAnonymous ? "Invitado" : "Jugador"),
        email: user.email || null,
        avatar: "🎮",
        level: 1,
        xp: 0,
        coins: 0,
        wins: 0,
        gamesPlayed: 0,
        createdAt: serverTimestamp()
      });
    }
    return true;
  }catch(error){
    console.error("Firestore profile error:", error);
    return false;
  }
}

export function authErrorMessage(error){
  const code = error?.code || "";
  const messages = {
    "auth/email-already-in-use":"Este correo ya tiene una cuenta.",
    "auth/invalid-email":"El correo electrónico no es válido.",
    "auth/weak-password":"La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential":"Correo o contraseña incorrectos.",
    "auth/invalid-login-credentials":"Correo o contraseña incorrectos.",
    "auth/user-not-found":"No existe una cuenta con ese correo.",
    "auth/wrong-password":"La contraseña es incorrecta.",
    "auth/operation-not-allowed":"El acceso con correo y contraseña está desactivado en Firebase.",
    "auth/network-request-failed":"No se pudo conectar con Firebase. Revisa tu conexión.",
    "auth/too-many-requests":"Hay demasiados intentos. Espera unos minutos y vuelve a probar.",
    "auth/unauthorized-domain":"Este dominio no está autorizado en Firebase Authentication."
  };
  return messages[code] || `${error?.message || "Ocurrió un error."} (${code || "sin código"})`;
}
