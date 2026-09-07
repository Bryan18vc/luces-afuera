import { db } from "./firebase.js";
import {
  doc, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/*
  Sistema central de progresión de Arcadia.
  XP total:
    Nivel 1 = 0 XP
    Nivel 2 = 100 XP
    Nivel 3 = 225 XP
    Nivel 4 = 375 XP
    ...
*/
export function xpForLevel(level){
  if(level <= 1) return 0;
  const n = level - 1;
  return 100 * n + 25 * n * (n - 1) / 2;
}

export function levelFromXp(xp){
  let level = 1;
  while(xp >= xpForLevel(level + 1)) level++;
  return level;
}

/*
  Registra una recompensa una sola vez por partida.
  eventId debe ser único para la partida, por ejemplo:
  "michi_ROOMCODE_GAMEID".
*/
export async function awardGameResult({
  userId,
  eventId,
  xp,
  coins,
  win = false,
  game = "unknown"
}){
  if(!userId || !eventId) throw new Error("Faltan datos para registrar la recompensa.");

  const userRef = doc(db, "users", userId);
  const eventRef = doc(db, "users", userId, "gameResults", eventId);

  return runTransaction(db, async tx => {
    const eventSnap = await tx.get(eventRef);
    if(eventSnap.exists()){
      return { alreadyAwarded: true };
    }

    const userSnap = await tx.get(userRef);
    const current = userSnap.exists() ? userSnap.data() : {};

    const oldXp = Number(current.xp || 0);
    const newXp = oldXp + Number(xp || 0);
    const newLevel = levelFromXp(newXp);

    const payload = {
      name: current.name || "Jugador",
      email: current.email ?? null,
      avatar: current.avatar || "🎮",
      level: newLevel,
      xp: newXp,
      coins: Number(current.coins || 0) + Number(coins || 0),
      wins: Number(current.wins || 0) + (win ? 1 : 0),
      gamesPlayed: Number(current.gamesPlayed || 0) + 1,
      updatedAt: serverTimestamp()
    };

    tx.set(userRef, payload, { merge: true });

    tx.set(eventRef, {
      game,
      xp: Number(xp || 0),
      coins: Number(coins || 0),
      win: !!win,
      createdAt: serverTimestamp()
    });

    return {
      alreadyAwarded: false,
      oldXp,
      newXp,
      oldLevel: Number(current.level || 1),
      newLevel,
      xpGained: Number(xp || 0),
      coinsGained: Number(coins || 0)
    };
  });
}
