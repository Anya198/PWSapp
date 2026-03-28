import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { WorkoutBannerCard } from '../../../src/components/ui/DashboardWidgets';

const C = {
  primary: '#00D09C',
  dark: '#0B2A20',
  card: 'rgba(255,255,255,0.04)',
  muted: '#4A7064',
  light: '#EFF7F3',
};

export default function TrainingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.dark }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>Training</Text>
          <Text style={styles.sub}>Feature 04 Integration</Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          <WorkoutBannerCard delay={0} />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Active Programs</Text>
          <View style={styles.placeholderCard}>
             <Text style={styles.placeholderText}>TPOP Hypertrophy - Weeks 1-4</Text>
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
  placeholderCard: { height: 120, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: C.muted, fontWeight: '600' }
});
