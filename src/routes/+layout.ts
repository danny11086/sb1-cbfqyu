import { auth } from '$lib/stores/auth';
import { fetchCurrentUser } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export async function load({ url }) {
  const publicRoutes = ['/login', '/register'];
  
  if (!publicRoutes.includes(url.pathname)) {
    let token: string | null = null;
    auth.subscribe(state => token = state.token)();

    if (!token) {
      throw redirect(307, '/login');
    }

    try {
      const user = await fetchCurrentUser();
      auth.setUser(user);
    } catch (error) {
      auth.logout();
      throw redirect(307, '/login');
    }
  }
}