import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { supabase } from '../../../src/lib/supabase';
import { useAuthStore } from '../../../src/hooks/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const C = {
  primary: '#00D09C',
  dark: '#0B2A20',
  card: 'rgba(255,255,255,0.04)',
  muted: '#4A7064',
  light: '#EFF7F3',
};

export default function ProfileScreen() {
  const { session } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.dark }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
             <Ionicons name="person" size={40} color={C.dark} />
          </View>
          <Text style={styles.nameText}>{profile?.display_name || 'Athlete'}</Text>
          <TouchableOpacity style={styles.editBtn}>
             <Text style={styles.editBtnText}>Update Picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.groupLabel}>Account</Text>
          <SettingRow icon="body" label="Biological Data" />
          <SettingRow icon="trophy" label="Achievements" />
          <SettingRow icon="time" label="Activity History" />
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.groupLabel}>Concierge</Text>
          <SettingRow icon="chatbubble-ellipses" label="Message Coach" highlight />
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, label, highlight }: any) {
  return (
    <TouchableOpacity style={styles.settingRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
         <Ionicons name={icon} size={20} color={highlight ? C.primary : C.light} />
         <Text style={[styles.settingLabel, highlight && { color: C.primary, fontWeight: '700' }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: C.light },
  
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  nameText: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 12 },
  editBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
  editBtnText: { color: C.light, fontSize: 13, fontWeight: '600' },

  settingsGroup: { marginBottom: 32 },
  groupLabel: { color: C.muted, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, padding: 16, borderRadius: 16, marginBottom: 8 },
  settingLabel: { color: '#fff', fontSize: 15, fontWeight: '500' },

  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, padding: 16, borderRadius: 16, backgroundColor: 'rgba(255, 68, 68, 0.1)' },
  signOutText: { color: '#FF4444', fontSize: 15, fontWeight: '700' }
});
