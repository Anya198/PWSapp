import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { Platform, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { supabase } from '../src/lib/supabase';
import './global.css';

const IPHONE_WIDTH = 393;
const IPHONE_HEIGHT = 852;
// Only show the phone frame when the browser window is clearly desktop-sized
const DESKTOP_BREAKPOINT = 768;

export default function RootLayout() {
  const { session, setSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const { width } = useWindowDimensions();

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

  // On web AND a desktop-sized viewport: show the iPhone preview frame
  if (Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT) {
    return (
      <View style={styles.webRoot}>
        <View style={styles.phoneFrame}>
          <Slot />
        </View>
      </View>
    );
  }

  // On native OR a real mobile browser: fill the screen naturally
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.3,
    shadowRadius: 48,
    borderWidth: 10,
    borderColor: '#111111',
  },
});
