import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { supabase } from '../src/lib/supabase';
import './global.css';

// iPhone 15 dimensions (logical pixels)
const IPHONE_WIDTH = 393;
const IPHONE_HEIGHT = 852;

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

  if (!isReady) return null;

  // On web, wrap in an iPhone 15 frame centered on screen
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <View style={styles.phoneFrame}>
          <Slot />
        </View>
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: '#D0D8D5',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as any,
  },
  phoneFrame: {
    width: IPHONE_WIDTH,
    height: IPHONE_HEIGHT,
    borderRadius: 54,
    overflow: 'hidden',
    backgroundColor: '#EFF7F3',
    // Phone drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.3,
    shadowRadius: 48,
    // Black border like an iPhone bezel
    borderWidth: 10,
    borderColor: '#111111',
  },
});
