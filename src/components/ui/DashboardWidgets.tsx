import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from './StatCard';

const C = {
  primary: '#00D09C',
  dark: '#0B2A20',
  card: 'rgba(255,255,255,0.04)',
  muted: '#4A7064',
  light: '#EFF7F3',
  macros: {
    protein: '#E11D48',
    carbs: '#F59E0B',
    fats: '#3B82F6',
  }
};

// --- Weekly Calendar Strip ---
export function WeeklyCalendarStrip() {
  const days = [
    { label: 'Sun', date: 17, active: false, mood: 'happy' },
    { label: 'Mon', date: 18, active: false, mood: 'neutral' },
    { label: 'Tue', date: 19, active: false, mood: 'sad' },
    { label: 'Wed', date: 20, active: true, mood: 'happy' },
    { label: 'Thu', date: 21, active: false, mood: 'none' },
    { label: 'Fri', date: 22, active: false, mood: 'none' },
    { label: 'Sat', date: 23, active: false, mood: 'none' },
  ];

  const getMoodColor = (mood: string) => {
    if (mood === 'happy') return '#10B981';
    if (mood === 'sad') return '#EF4444';
    if (mood === 'neutral') return '#F59E0B';
    return '#4A7064';
  };

  return (
    <View style={styles.calRow}>
      {days.map((d, i) => (
        <View key={i} style={styles.calCol}>
          <Text style={[styles.calDayLabel, d.active && { color: C.primary }]}>{d.label}</Text>
          <View style={[styles.calDateCirle, d.active && { backgroundColor: C.primary }]}>
            <Text style={[styles.calDateText, d.active && { color: C.dark }]}>{d.date}</Text>
          </View>
          {d.mood !== 'none' ? (
             <View style={[styles.moodDot, { backgroundColor: getMoodColor(d.mood) }]} />
          ) : (
             <View style={[styles.moodDot, { backgroundColor: 'transparent' }]} />
          )}
        </View>
      ))}
    </View>
  );
}

// --- Fuel & Macro Tracker ---
export function FuelMacroCard({ delay }: { delay: number }) {
  const cals = { current: 1850, target: 2400 };
  const macros = [
    { label: 'Protein', current: 140, target: 180, color: C.macros.protein },
    { label: 'Carbs', current: 160, target: 200, color: C.macros.carbs },
    { label: 'Fats', current: 45, target: 70, color: C.macros.fats },
  ];

  return (
    <StatCard delay={delay} style={styles.bentoFluid}>
      <View style={styles.macroHeader}>
        <Text style={styles.bentoTitle}>Fuel Profile</Text>
        <Text style={styles.bentoSub}>{cals.current} / {cals.target} kcal</Text>
      </View>
      
      {macros.map((m, i) => {
        const pct = Math.min((m.current / m.target) * 100, 100);
        return (
          <View key={i} style={styles.macroRow}>
            <View style={styles.macroLabelRow}>
               <Text style={styles.macroLabel}>{m.label}</Text>
               <Text style={styles.macroLabel}>{m.current}g / {m.target}g</Text>
            </View>
            <View style={styles.macroTrack}>
               <View style={[styles.macroFill, { width: `${pct}%`, backgroundColor: m.color }]} />
            </View>
          </View>
        );
      })}
    </StatCard>
  );
}

// --- Sleep Overview ---
export function SleepOverviewCard({ delay }: { delay: number }) {
  return (
    <StatCard delay={delay} style={[styles.bentoFluid, styles.bentoCardBase]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
         <Ionicons name="moon" size={24} color="#8B5CF6" />
         <Ionicons name="chevron-forward" size={20} color={C.muted} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 36, color: '#fff', fontWeight: '800' }}>84<Text style={{ fontSize: 16 }}>%</Text></Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Sleep Score</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <View>
           <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>7h 30m</Text>
           <Text style={{ color: C.muted, fontSize: 11 }}>Duration</Text>
        </View>
        <View>
           <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>48 bpm</Text>
           <Text style={{ color: C.muted, fontSize: 11 }}>Resting HR</Text>
        </View>
      </View>
    </StatCard>
  );
}

// --- Habit Tracker ---
export function HabitChecklistCard({ delay }: { delay: number }) {
  const [habits, setHabits] = useState([
    { id: 1, label: 'Gallon of Water', done: true, icon: 'water' },
    { id: 2, label: '30m Sunlight', done: false, icon: 'sunny' },
    { id: 3, label: 'No Sugar', done: true, icon: 'restaurant' },
    { id: 4, label: 'Read 10 Pages', done: false, icon: 'book' },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const streak = 18;

  return (
    <StatCard delay={delay} style={styles.bentoFluid}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
         <Text style={styles.bentoTitle}>Discipline Checklist</Text>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
           <Ionicons name="flame" size={16} color="#F59E0B" />
           <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{streak} Days</Text>
         </View>
      </View>

      {habits.map((h, i) => (
        <TouchableOpacity key={h.id} style={styles.habitRow} onPress={() => toggleHabit(h.id)} activeOpacity={0.7}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
             <View style={[styles.habitIconBox, h.done && { backgroundColor: `${C.primary}20` }]}>
               <Ionicons name={h.icon as any} size={16} color={h.done ? C.primary : C.muted} />
             </View>
             <Text style={[styles.habitLabel, h.done && styles.habitLabelDone]}>{h.label}</Text>
           </View>
           <View style={[styles.habitCheck, h.done && styles.habitCheckDone]}>
             {h.done && <Ionicons name="checkmark" size={12} color={C.dark} />}
           </View>
        </TouchableOpacity>
      ))}
    </StatCard>
  );
}

// --- Workout Banner ---
export function WorkoutBannerCard({ delay }: { delay: number }) {
  return (
    <StatCard delay={delay} useSolidBackground style={{ padding: 0 }}>
      <View style={styles.workoutBanner}>
         <View style={styles.workoutOverlay}>
           <View style={{ marginBottom: 16 }}>
             <Text style={{ color: '#00D09C', fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>WORKOUT OF THE DAY</Text>
           </View>
           <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 }}>Full Body TPOP</Text>
           <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 20 }}>45 min • Hypertrophy • Gym</Text>
           <TouchableOpacity style={styles.workoutBtn}>
              <Text style={styles.workoutBtnText}>Start Session</Text>
           </TouchableOpacity>
         </View>
      </View>
    </StatCard>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  // Calendar
  calRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  calCol: { alignItems: 'center', gap: 8 },
  calDayLabel: { color: C.muted, fontSize: 11, fontWeight: '500' },
  calDateCirle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  calDateText: { color: C.light, fontSize: 14, fontWeight: '700' },
  moodDot: { width: 4, height: 4, borderRadius: 2 },

  // Base Bento
  bentoFluid: { width: '100%', marginBottom: 16 },
  bentoCardBase: { flex: 1 },
  bentoTitle: { color: C.light, fontSize: 16, fontWeight: '700' },
  bentoSub: { color: C.primary, fontSize: 13, fontWeight: '600' },

  // Macros
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  macroRow: { marginBottom: 12 },
  macroLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },
  macroTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  macroFill: { height: '100%', borderRadius: 3 },

  // Habits
  habitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  habitIconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  habitLabel: { color: C.light, fontSize: 14, fontWeight: '500' },
  habitLabelDone: { color: C.muted, textDecorationLine: 'line-through' },
  habitCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: C.muted, alignItems: 'center', justifyContent: 'center' },
  habitCheckDone: { backgroundColor: C.primary, borderColor: C.primary },

  // Workout
  workoutBanner: { height: 180, backgroundColor: '#0F3B2A' },
  workoutOverlay: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  workoutBtn: { backgroundColor: C.light, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, alignSelf: 'flex-start' },
  workoutBtnText: { color: C.dark, fontSize: 13, fontWeight: '700' }
});
