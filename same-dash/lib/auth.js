import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const waitUser = () => new Promise((resolve) => {
  const unsub = onAuthStateChanged(auth, (u) => { unsub(); resolve(u || null); });
});

// Guard simples para server components (App Router) – renderiza loading até achar o user
export async function requireUser() {
  const u = await waitUser();
  if (!u) throw new Error('UNAUTH');
  return u;
}