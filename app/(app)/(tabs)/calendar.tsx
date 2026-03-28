import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

const C = {
  primary: '#00D09C',
  dark: '#0B2A20',
  card: 'rgba(255,255,255,0.04)',
  muted: '#4A7064',
  light: '#EFF7F3',
};

export default function CalendarScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.dark }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.sub}>History & Check-ins</Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>March 2026</Text>
          <View style={styles.placeholderCard}>
             <Text style={styles.placeholderText}>Monthly Streak Overview</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  headerRow: { marginBottom: 32 },
  title: { color: C.light, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  sub: { color: C.primary, fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  placeholderCard: { height: 200, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: C.muted, fontWeight: '600' }
});
