import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../src/lib/supabase';
import { useAuthStore } from '../../../src/hooks/useAuthStore';
import { StatCard } from '../../../src/components/ui/StatCard';
import { PillarRings } from '../../../src/components/ui/PillarRings';
import { 
  WeeklyCalendarStrip, 
  FuelMacroCard, 
  SleepOverviewCard, 
  HabitChecklistCard 
} from '../../../src/components/ui/DashboardWidgets';

// Brand colors
const C = {
  primary: '#00D09C',
  dark: '#0B2A20',
  card: 'rgba(255,255,255,0.04)',
  muted: '#4A7064',
  light: '#EFF7F3',
  phase: {
    HPOP: '#14B8A6',
    TPOP: '#00D09C',
    EPOP: '#F59E0B'
  }
};

export default function AdvancedDashboardScreen() {
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      supabase.from('user_profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [session]);

  const firstName = profile?.display_name?.split(' ')[0] || 'Athlete';
  const activePhase = profile?.active_phase || 'TPOP';
  const phaseColor = C.phase[activePhase as keyof typeof C.phase] || C.primary;

  const mockPillars = { fuel: 85, strength: 100, recovery: 40, focus: 60, discipline: 100 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.dark }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ROW 1: Header + Weekly Strip */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
        </View>

        <WeeklyCalendarStrip />

        {/* Phase Badge */}
        <View style={styles.phaseBadgeRow}>
          <View style={[styles.phaseBadge, { backgroundColor: `${phaseColor}20` }]}>
             <View style={[styles.phaseDot, { backgroundColor: phaseColor }]} />
             <Text style={[styles.phaseText, { color: phaseColor }]}>{activePhase} PROTOCOL ACTIVATED</Text>
          </View>
          <Text style={styles.weekText}>Week 3 | Day 12</Text>
        </View>

        {/* ROW 2: Bento Grid Top (Rings + Session) */}
        {/* Fixed Sizing: using exact percentages minus gap value so it never blows out horizontal bounds */}
        <View style={styles.gridRow}>
           <View style={styles.halfCol}>
             <StatCard delay={100} style={styles.fillHeight}>
               <Text style={styles.bentoTitle}>PWS Health</Text>
               <View style={styles.ringsWrapper}>
                  <PillarRings size={110} strokeWidth={8} pillars={mockPillars} />
               </View>
               <View style={styles.legendCol}>
                 <LegendDot color="#00D09C" label="Fuel" val="85%" />
                 <LegendDot color="#F59E0B" label="Strength" val="100%" />
                 <LegendDot color="#8B5CF6" label="Recovery" val="40%" />
               </View>
             </StatCard>
           </View>
           
           <View style={styles.halfCol}>
             <StatCard delay={200} style={[styles.fillHeight, { backgroundColor: '#0F3B2A', borderColor: '#1B5E40' }]}>
               <View style={styles.sessionHeaderRow}>
                 <View style={styles.iconBoxTop}>
                   <Ionicons name="videocam" size={14} color="#0B2A20" />
                 </View>
                 <Text style={styles.sessionCountdown}>In 45m</Text>
               </View>
               <Text style={styles.sessionTitle}>Quarterly Review</Text>
               <Text style={styles.sessionSub}>with Julian</Text>
               <View style={{ flex: 1 }} />
               <TouchableOpacity style={styles.joinBtn}>
                  <Text style={styles.joinBtnText}>Join Zoom</Text>
               </TouchableOpacity>
             </StatCard>
           </View>
        </View>

        {/* ROW 3: Fuel & Macros Card */}
        <View style={styles.fullRow}>
          <FuelMacroCard delay={300} />
        </View>

        {/* ROW 4: Recovery & Analytics Card */}
        <View style={styles.gridRow}>
           <View style={styles.halfCol}>
             <SleepOverviewCard delay={400} />
           </View>
           
           <View style={styles.halfCol}>
             <StatCard delay={450} style={styles.fillHeight}>
               <View style={{ flex: 1, justifyContent: 'space-between' }}>
                 <View>
                   <Ionicons name="trending-up" size={24} color="#10B981" />
                   <Text style={[styles.bentoTitle, { marginTop: 12 }]}>Growth</Text>
                 </View>
                 <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800' }}>+8.7<Text style={{fontSize: 14}}>%</Text></Text>
               </View>
             </StatCard>
           </View>
        </View>

        {/* ROW 5: Habit Checklist Tracker 
            Note: WorkoutBanner relocated to new Training Tab natively 
        */}
        <View style={styles.fullRow}>
           <HabitChecklistCard delay={500} />
        </View>

        {/* Motivational Banner */}
        <View style={styles.banner}>
           <Text style={styles.bannerText}>"Discipline equals freedom. Win the morning, win the day."</Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const LegendDot = ({ color, label, val }: { color: string, label: string, val: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
       <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
       <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{label}</Text>
    </View>
    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{val}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { color: C.muted, fontSize: 16, fontWeight: '600' },
  name: { color: C.light, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  
  phaseBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  phaseBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
  phaseDot: { width: 6, height: 6, borderRadius: 3 },
  phaseText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  weekText: { color: C.muted, fontSize: 13, fontWeight: '600' },

  // Responsive Grid Logic
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, width: '100%' },
  halfCol: { width: '48%' }, // Prevent horizontal overflow
  fullRow: { width: '100%', alignItems: 'center' }, // Clean container wrap
  fillHeight: { flex: 1, height: '100%' },
  
  bentoTitle: { color: C.light, fontSize: 13, fontWeight: '700' },
  ringsWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 12 },
  legendCol: { marginTop: 4 },

  sessionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBoxTop: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  sessionCountdown: { color: '#00D09C', fontWeight: '700', fontSize: 11 },
  sessionTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  sessionSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 20 },
  joinBtn: { backgroundColor: C.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  joinBtnText: { color: C.dark, fontWeight: '700', fontSize: 12 },

  banner: { marginTop: 16, paddingHorizontal: 16, alignItems: 'center' },
  bannerText: { color: C.muted, fontSize: 14, fontStyle: 'italic', textAlign: 'center', lineHeight: 22 }
});
