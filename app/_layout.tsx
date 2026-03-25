import { useEffect, useState } from 'react';
import { Slot, Redirect } from 'expo-router';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { supabase } from '../src/lib/supabase';
import './global.css';

export default function RootLayout() {
  const { session, setSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  // Don't render anything until we know the auth state
  if (!isReady) return null;

  return <Slot />;
}
