ARCАDIA · VERSIÓN XP 1

Esta versión añade un sistema central de progresión:
- XP
- niveles
- monedas
- partidas
- victorias
- recompensas de Michi

Michi:
- Victoria: +100 XP, +20 monedas
- Empate: +40 XP, +8 monedas
- Derrota: +20 XP, +3 monedas

La recompensa se registra de forma idempotente en:
users/{UID}/gameResults/{evento}

IMPORTANTE:
1. Reemplaza los archivos de tu proyecto por los de esta carpeta.
2. En Firebase > Firestore > Reglas, publica el contenido de:
   firebase/firestore.rules
3. Prueba Michi con dos usuarios.
4. Al terminar una partida, revisa Perfil para confirmar XP, monedas,
   partidas y victorias.

La versión conserva Firebase Authentication y Realtime Database.
