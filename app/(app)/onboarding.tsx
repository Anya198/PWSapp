import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { onboardingSchema, OnboardingInputValues } from '../../src/lib/schemas';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useAuthStore';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL_STEPS = 5;

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#EFF7F3',
  dark: '#0B2A20',
  muted: '#4A7064',
  light: '#7F918C',
  primary: '#118a7e',
  accent: '#00D09C',
  card: '#FFFFFF',
  pill: { active: '#0B2A20', inactive: '#E8F4EF' },
  phase: {
    HPOP: '#6366f1',
    TPOP: '#118a7e',
    EPOP: '#a855f7',
  },
};

// ─── Inline Slider ────────────────────────────────────────────────────────────
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  displayValue: string;
  onChange: (v: number) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  accentColor?: string;
}

function SliderInput({ label, value, min, max, displayValue, onChange, onIncrement, onDecrement, accentColor = C.primary }: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const startVal = useRef(value);

  const pct = trackWidth > 0 ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
  const thumbX = pct * trackWidth;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startVal.current = value; // Lock in starting value
      },
      onPanResponderMove: (_e, gs) => {
        if (trackWidth === 0) return;
        const deltaPct = gs.dx / trackWidth;
        const deltaVal = deltaPct * (max - min);
        onChange(Math.max(min, Math.min(max, startVal.current + deltaVal)));
      },
    })
  ).current;

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.row}>
        <Text style={sliderStyles.label}>{label}</Text>
        <Text style={[sliderStyles.value, { color: accentColor }]}>
          {displayValue}
        </Text>
      </View>
      <View style={sliderStyles.controlsRow}>
        <TouchableOpacity style={sliderStyles.btn} onPress={onDecrement}>
          <Ionicons name="remove" size={18} color={C.dark} />
        </TouchableOpacity>

        <View 
          style={sliderStyles.trackWrapper} 
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          {...panResponder.panHandlers}
        >
          <View style={sliderStyles.track}>
            <View style={[sliderStyles.fill, { width: thumbX, backgroundColor: accentColor }]} />
            {trackWidth > 0 && (
              <View style={[sliderStyles.thumb, { left: thumbX, backgroundColor: accentColor }]} />
            )}
          </View>
        </View>

        <TouchableOpacity style={sliderStyles.btn} onPress={onIncrement}>
          <Ionicons name="add" size={18} color={C.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  value: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackWrapper: { flex: 1, paddingVertical: 12, justifyContent: 'center' },
  track: { height: 4, backgroundColor: '#E8F4EF', borderRadius: 2, position: 'relative' },
  fill: { height: 4, borderRadius: 2, position: 'absolute', top: 0, left: 0 },
  thumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

// ─── Gender Pill Row ──────────────────────────────────────────────────────────
function GenderPills({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ['Male', 'Female', 'Non-binary'];
  return (
    <View>
      <Text style={styles.fieldLabel}>Gender Identification</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        {options.map((opt) => {
          const active = value?.toLowerCase() === opt.toLowerCase();
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt.toLowerCase())}
              style={[
                styles.genderPill,
                { backgroundColor: active ? C.dark : C.pill.inactive },
              ]}
            >
              <Text style={[styles.genderPillText, { color: active ? '#fff' : C.dark }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Phase Card ───────────────────────────────────────────────────────────────
const PHASES = [
  {
    id: 'HPOP',
    title: 'HPOP',
    fullTitle: 'Hospital Phase Optimised Protocol',
    icon: 'fitness-outline' as const,
    description: 'Foundational health optimization. Build your baseline habits, nutrition and movement patterns from the ground up.',
    duration: '12 weeks',
    color: C.phase.HPOP,
    badge: null,
  },
  {
    id: 'TPOP',
    title: 'TPOP',
    fullTitle: 'Transitional Phase Optimised Protocol',
    icon: 'barbell-outline' as const,
    description: 'Progressive overload, macro precision, and advanced recovery protocols for peak performance output.',
    duration: '24 weeks',
    color: C.phase.TPOP,
    badge: 'RECOMMENDED',
  },
  {
    id: 'EPOP',
    title: 'EPOP',
    fullTitle: 'Extended Phase Optimised Protocol',
    icon: 'rocket-outline' as const,
    description: 'Long-term health maintenance. Adaptive programming designed for sustained elite-level living.',
    duration: 'Ongoing',
    color: C.phase.EPOP,
    badge: null,
  },
];

interface PhaseRowProps {
  phase: typeof PHASES[0];
  isSelected: boolean;
  onPress: () => void;
  entranceDelay: number;
}

function PhaseRow({ phase, isSelected, onPress, entranceDelay }: PhaseRowProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, delay: entranceDelay, useNativeDriver: true, tension: 70, friction: 9 }),
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: entranceDelay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], marginBottom: 12 }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          styles.phaseCard,
          isSelected && { borderColor: phase.color, borderWidth: 2, backgroundColor: '#fafffe' },
        ]}
      >
        {/* Badge */}
        {phase.badge && (
          <View style={[styles.phaseBadgeWrap, { backgroundColor: `${phase.color}20` }]}>
            <Text style={[styles.phaseBadgeText, { color: phase.color }]}>{phase.badge}</Text>
          </View>
        )}

        {/* Icon + Title */}
        <View style={styles.phaseHeader}>
          <View style={[styles.phaseIconBox, { backgroundColor: `${phase.color}18` }]}>
            <Ionicons name={phase.icon} size={22} color={phase.color} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.phaseTitle}>{phase.title}</Text>
            <Text style={styles.phaseFullTitle}>{phase.fullTitle}</Text>
          </View>
        </View>

        <Text style={styles.phaseDescription}>{phase.description}</Text>

        {/* CTA row */}
        <TouchableOpacity onPress={onPress} style={styles.phaseSelectBtn}>
          <Text style={[styles.phaseSelectText, { color: isSelected ? phase.color : C.muted }]}>
            {isSelected ? '✓ Selected' : (phase.id === 'TPOP' ? 'Start TPOP Journey' : 'Select Protocol')}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function StepWelcome() {
  return (
    <AnimatedCard delay={0}>
      {/* Step badge */}
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>STEP 1 OF 4</Text>
      </View>

      <Text style={styles.stepTitle}>Welcome to PWS</Text>
      <Text style={styles.stepSub}>
        Your personalised wellness journey starts here. We'll collect some baseline information to tailor your protocol.
      </Text>

      {/* Apple Health sync banner */}
      <AnimatedCard delay={150} style={styles.healthBanner}>
        <View style={[styles.healthIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Ionicons name="heart" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.healthBannerTitle}>Sync with Apple Health</Text>
          <Text style={styles.healthBannerSub}>Import age, weight, and activity logs</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
      </AnimatedCard>

      {/* Info bullets */}
      <AnimatedCard delay={300} style={styles.infoCard}>
        {[
          { icon: 'shield-checkmark-outline' as const, text: 'Your data is 256-bit encrypted at rest' },
          { icon: 'person-outline' as const, text: 'Never shared without your explicit consent' },
          { icon: 'time-outline' as const, text: 'Setup takes less than 3 minutes' },
        ].map((item) => (
          <View key={item.text} style={styles.infoRow}>
            <Ionicons name={item.icon} size={16} color={C.primary} />
            <Text style={styles.infoText}>{item.text}</Text>
          </View>
        ))}
      </AnimatedCard>
    </AnimatedCard>
  );
}

function StepBiometric({ control, errors, heightVal, weightVal, onHeightChange, onWeightChange }: any) {
  const [isImperial, setIsImperial] = useState(false);

  const cmToFtIn = (cm: number) => {
    const totalInches = Math.round(cm / 2.54);
    const ft = Math.floor(totalInches / 12);
    const ins = totalInches % 12;
    return `${ft}' ${ins}"`;
  };
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462) + " lbs";

  const heightDisplay = isImperial ? cmToFtIn(heightVal) : Math.round(heightVal) + " cm";
  const weightDisplay = isImperial ? kgToLbs(weightVal) : Math.round(weightVal) + " kg";

  // Step sizes: 1 inch = 2.54 cm, 1 lb = 0.453592 kg
  const heightStep = isImperial ? 2.54 : 1;
  const weightStep = isImperial ? 0.453592 : 1;

  return (
    <AnimatedCard delay={0}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>STEP 2 OF 4</Text>
      </View>
      <Text style={styles.stepTitle}>Biometric Profile</Text>
      <Text style={styles.stepSub}>
        Your clinical data is used to tailor your recovery protocols. All information is encrypted and stored securely.
      </Text>

      {/* Name + Age inputs */}
      <AnimatedCard delay={100} style={styles.card}>
        <Controller
          control={control}
          name="display_name"
          render={({ field: { onChange, value } }) => (
            <Input variant="light" label="Full Name" value={value ?? ''} onChangeText={onChange} placeholder="John Doe" error={errors.display_name?.message} />
          )}
        />
        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, value } }) => (
            <Input variant="light" label="Age" keyboardType="numeric" value={value ?? ''} onChangeText={onChange} placeholder="32" error={errors.age?.message} />
          )}
        />
      </AnimatedCard>

      {/* Biological Markers card */}
      <AnimatedCard delay={200} style={styles.card}>
        <View style={styles.bioHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <Ionicons name="analytics-outline" size={18} color={C.primary} />
            <Text style={styles.bioTitle}>Biological Markers</Text>
          </View>
          
          <View style={styles.unitToggle}>
            <TouchableOpacity 
              style={[styles.unitBtn, !isImperial && styles.unitBtnActive]} 
              onPress={() => setIsImperial(false)}
            >
              <Text style={[styles.unitText, !isImperial && styles.unitTextActive]}>Metric</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.unitBtn, isImperial && styles.unitBtnActive]} 
              onPress={() => setIsImperial(true)}
            >
              <Text style={[styles.unitText, isImperial && styles.unitTextActive]}>Imperial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gender pills */}
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <GenderPills value={value ?? ''} onChange={onChange} />
          )}
        />

        <View style={{ height: 28 }} />

        {/* Height slider */}
        <SliderInput
          label={isImperial ? "Height (ft/in)" : "Height (cm)"}
          value={heightVal}
          min={140}
          max={220}
          displayValue={heightDisplay}
          onChange={onHeightChange}
          onIncrement={() => onHeightChange(Math.min(220, heightVal + heightStep))}
          onDecrement={() => onHeightChange(Math.max(140, heightVal - heightStep))}
          accentColor={C.primary}
        />

        {/* Weight slider */}
        <SliderInput
          label={isImperial ? "Weight (lbs)" : "Weight (kg)"}
          value={weightVal}
          min={40}
          max={160}
          displayValue={weightDisplay}
          onChange={onWeightChange}
          onIncrement={() => onWeightChange(Math.min(160, weightVal + weightStep))}
          onDecrement={() => onWeightChange(Math.max(40, weightVal - weightStep))}
          accentColor={C.primary}
        />
      </AnimatedCard>

      {/* Pre-existing conditions teaser */}
      <AnimatedCard delay={350} style={styles.conditionsCard}>
        <View style={styles.conditionsLeft}>
          <View style={styles.conditionsIconBox}>
            <Ionicons name="document-text-outline" size={18} color={C.muted} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.conditionsTitle}>Pre-existing Conditions</Text>
            <Text style={styles.conditionsSub}>Add medical history for better accuracy</Text>
          </View>
        </View>
        <View style={styles.addBtn}>
          <Ionicons name="add" size={20} color={C.dark} />
        </View>
      </AnimatedCard>
    </AnimatedCard>
  );
}

function StepPhase({ control }: any) {
  const [selected, setSelected] = React.useState('TPOP');

  return (
    <AnimatedCard delay={0}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>STEP 4 OF 4</Text>
      </View>
      <Text style={[styles.stepTitle, { fontSize: 28 }]}>Choose your care pathway.</Text>
      <Text style={styles.stepSub}>
        Precision starts with structure. Select the specialised phase that aligns with your current clinical assessment for tailored concierge support.
      </Text>

      <Controller
        control={control}
        name="phase"
        render={({ field: { onChange, value } }) => (
          <View>
            {PHASES.map((phase, i) => (
              <PhaseRow
                key={phase.id}
                phase={phase}
                isSelected={value === phase.id}
                onPress={() => { onChange(phase.id); setSelected(phase.id); }}
                entranceDelay={i * 120}
              />
            ))}
          </View>
        )}
      />

      {/* The Clinical Advantage */}
      <AnimatedCard delay={400} style={styles.advantageCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80' }}
          style={styles.advantageImage}
        />
        <View style={styles.advantageBody}>
          <Text style={styles.advantageTitle}>The Clinical Advantage</Text>
          <Text style={styles.advantageSub}>
            Each pathway is calibrated by our medical board to ensure the highest standard of care.
          </Text>
          {[
            '24/7 Concierge Physician Access',
            'Biometric Monitoring Syncing',
            'Quarterly Performance Reviews',
          ].map((item) => (
            <View key={item} style={styles.advantageRow}>
              <Ionicons name="checkmark-circle" size={16} color={C.primary} />
              <Text style={styles.advantageItem}>{item}</Text>
            </View>
          ))}
        </View>
      </AnimatedCard>
    </AnimatedCard>
  );
}

function StepVerification({ photoUri, onPhoto }: { photoUri: string | null; onPhoto: (uri: string) => void }) {
  const pickDoc = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      onPhoto(result.assets[0].uri);
    }
  };

  return (
    <AnimatedCard delay={0}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>STEP 3 OF 4</Text>
      </View>
      <Text style={styles.stepTitle}>Baseline Verification</Text>
      <Text style={styles.stepSub}>
        Securely upload your documentation to finalise your clinical profile and unlock your protocol.
      </Text>

      {/* Identity Verification */}
      <AnimatedCard delay={100} style={styles.verifySection}>
        <View style={styles.verifyHeader}>
          <View style={[styles.verifyIconBox, { backgroundColor: '#eef2ff' }]}>
            <Ionicons name="card-outline" size={20} color="#6366f1" />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.verifyTitle}>Identity Verification</Text>
            <Text style={styles.verifySub}>Valid Passport or National ID required for HIPAA compliance.</Text>
          </View>
        </View>
        <TouchableOpacity onPress={pickDoc} style={styles.uploadBox}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.uploadedImage} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={28} color={C.light} />
              <Text style={styles.uploadLabel}>UPLOAD DOCUMENT</Text>
            </>
          )}
        </TouchableOpacity>
      </AnimatedCard>

      {/* Medical History */}
      <AnimatedCard delay={200} style={styles.verifySection}>
        <View style={styles.verifyHeader}>
          <View style={[styles.verifyIconBox, { backgroundColor: '#f3e8ff' }]}>
            <Ionicons name="document-text-outline" size={20} color="#a855f7" />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.verifyTitle}>Medical History</Text>
            <Text style={styles.verifySub}>Previous clinical records to establish your baseline vitals.</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.uploadBox, { borderStyle: 'dashed' }]}>
          <Ionicons name="cloud-upload-outline" size={28} color={C.light} />
          <Text style={styles.uploadLabel}>DROP PDF HERE</Text>
        </TouchableOpacity>
      </AnimatedCard>

      {/* Security footer */}
      <AnimatedCard delay={350} style={styles.securityFooter}>
        <Ionicons name="lock-closed" size={12} color={C.light} />
        <Text style={styles.securityText}>256-bit Encrypted Secure Transmission</Text>
      </AnimatedCard>
    </AnimatedCard>
  );
}

function StepComplete({ phase }: { phase: string }) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.4)).current;
  const phaseData = PHASES.find((p) => p.id === phase) ?? PHASES[1];

  React.useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, { toValue: 1.4, duration: 1100, useNativeDriver: true }),
          Animated.timing(pulseScale, { toValue: 1, duration: 1100, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0.1, duration: 1100, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.4, duration: 1100, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <AnimatedCard delay={0} style={{ alignItems: 'center', paddingTop: 32 }}>
      {/* Pulsing ring */}
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 180, marginBottom: 28 }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: 65,
            borderWidth: 2,
            borderColor: phaseData.color,
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 1.5,
            borderColor: phaseData.color,
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          }}
        />
        <View style={[styles.completeCore, { backgroundColor: `${phaseData.color}18` }]}>
          <Ionicons name="checkmark-circle" size={60} color={phaseData.color} />
        </View>
      </View>

      <AnimatedCard delay={300} style={{ alignItems: 'center' }}>
        <Text style={styles.completeTitle}>You're all set!</Text>
        <Text style={styles.completePhase}>
          Your <Text style={{ color: phaseData.color, fontWeight: '800' }}>{phaseData.title}</Text> protocol is active.
        </Text>
        <Text style={styles.completeSub}>{phaseData.description}</Text>
      </AnimatedCard>
    </AnimatedCard>
  );
}

// ─── Root Screen ──────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [heightVal, setHeightVal] = useState(175);
  const [weightVal, setWeightVal] = useState(75);

  const router = useRouter();
  const { user } = useAuthStore();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { control, handleSubmit, watch, formState: { errors } } = useForm<OnboardingInputValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phase: 'TPOP',
      activity_level: 'moderate',
      display_name: 'Guest Demo',
      age: '30',
      gender: 'male',
      height: '175',
      weight: '75',
    },
  });

  const selectedPhase = watch('phase') ?? 'TPOP';

  const animateStepChange = (direction: 'forward' | 'back', callback: () => void) => {
    const toX = direction === 'forward' ? -SCREEN_W : SCREEN_W;
    Animated.timing(slideAnim, { toValue: toX, duration: 240, useNativeDriver: true }).start(() => {
      slideAnim.setValue(direction === 'forward' ? SCREEN_W : -SCREEN_W);
      callback();
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }).start();
    });
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) animateStepChange('forward', () => setStep((s) => s + 1));
  };
  const goBack = () => {
    if (step > 1) animateStepChange('back', () => setStep((s) => s - 1));
  };

  const onSubmit = async (data: OnboardingInputValues) => {
    if (!user) {
      // DEMO: no user session, just advance to completion
      animateStepChange('forward', () => setStep(TOTAL_STEPS));
      return;
    }
    setIsSubmitting(true);
    const profileData = {
      user_id: user.id,
      display_name: data.display_name ?? null,
      age: parseInt(data.age, 10),
      gender: data.gender,
      height: heightVal,
      weight: weightVal,
      activity_level: data.activity_level ?? 'moderate',
      active_phase: data.phase,
      sleep_hours: data.sleep_hours ?? null,
      stress_level: data.stress_level ?? null,
      dietary_preference: data.dietary_preference ?? null,
      goals: data.goals ?? null,
      health_history: data.health_history ?? null,
      onboarding_completed: true,
    };
    const { error } = await supabase.from('user_profiles').upsert(profileData);
    setIsSubmitting(false);
    if (error) Alert.alert('Error', error.message);
    else animateStepChange('forward', () => setStep(TOTAL_STEPS));
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepWelcome />;
      case 2: return (
        <StepBiometric
          control={control}
          errors={errors}
          heightVal={heightVal}
          weightVal={weightVal}
          onHeightChange={(v: number) => setHeightVal(v)}
          onWeightChange={(v: number) => setWeightVal(v)}
        />
      );
      case 3: return <StepVerification photoUri={photoUri} onPhoto={setPhotoUri} />;
      case 4: return <StepPhase control={control} />;
      case 5: return <StepComplete phase={selectedPhase} />;
      default: return null;
    }
  };

  const isLastDataStep = step === 4;
  const isComplete = step === TOTAL_STEPS;

  return (
    <SafeAreaView style={styles.root}>
      {/* Top nav */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={goBack}
          style={[styles.backBtn, { opacity: step === 1 ? 0 : 1 }]}
          disabled={step === 1}
        >
          <Ionicons name="arrow-back" size={20} color={C.dark} />
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>

        {/* PWS branding, only shown in middle */}
        {step > 1 && step < TOTAL_STEPS && (
          <Text style={styles.navBrand}>PWS</Text>
        )}

        <TouchableOpacity style={{ padding: 8 }}>
          <Ionicons name="ellipsis-vertical" size={20} color={C.muted} />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      {!isComplete && (
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <ProgressBar step={step} totalSteps={TOTAL_STEPS - 1} color={C.primary} />
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          style={{ transform: [{ translateX: slideAnim }] }}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}

          {/* Bottom navigation buttons */}
          {!isComplete && (
            <View style={styles.bottomNav}>
              {step > 1 && (
                <TouchableOpacity onPress={goBack} style={styles.backNavBtn}>
                  <Ionicons name="arrow-back" size={14} color={C.muted} />
                  <Text style={styles.backNavText}>BACK</Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={isLastDataStep ? handleSubmit(onSubmit) : goNext}
                style={styles.continueBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.continueBtnText}>Saving...</Text>
                ) : (
                  <>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                    <Text style={styles.continueBtnText}>
                      {isLastDataStep ? 'COMPLETE' : 'CONTINUE'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Welcome step CTA */}
          {isComplete && (
            <AnimatedCard delay={700} style={{ paddingHorizontal: 0, marginTop: 24 }}>
              <Button title="Enter PWS →" onPress={() => router.replace('/(app)')} />
            </AnimatedCard>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backLabel: { fontSize: 15, color: C.dark, fontWeight: '500' },
  navBrand: { fontSize: 16, fontWeight: '800', color: C.primary, letterSpacing: -0.3 },

  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 120 },

  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${C.phase.EPOP}18`,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 16,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.phase.EPOP,
    letterSpacing: 1,
  },

  stepTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: C.dark,
    letterSpacing: -0.8,
    marginBottom: 10,
    lineHeight: 40,
  },
  stepSub: {
    fontSize: 15,
    color: C.muted,
    lineHeight: 22,
    marginBottom: 28,
  },

  // Welcome step
  healthBanner: {
    backgroundColor: C.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  healthIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthBannerTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  healthBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },

  infoCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { fontSize: 14, color: C.dark, flex: 1 },

  // Biometric step
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4EF',
  },
  bioTitle: { fontSize: 16, fontWeight: '700', color: C.dark },
  unitToggle: { flexDirection: 'row', backgroundColor: '#E8F4EF', borderRadius: 8, padding: 3 },
  unitBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  unitBtnActive: { 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2 
  },
  unitText: { fontSize: 11, fontWeight: '700', color: C.muted },
  unitTextActive: { color: C.dark },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  genderPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  genderPillText: { fontSize: 14, fontWeight: '600' },

  conditionsCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F4EF',
  },
  conditionsLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  conditionsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionsTitle: { fontSize: 14, fontWeight: '700', color: C.dark, marginBottom: 2 },
  conditionsSub: { fontSize: 12, color: C.light },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Phase step
  phaseCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E8F4EF',
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  phaseBadgeWrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
  },
  phaseBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  phaseIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  phaseTitle: { fontSize: 20, fontWeight: '800', color: C.dark, letterSpacing: -0.5 },
  phaseFullTitle: { fontSize: 12, color: C.light, marginTop: 2 },
  phaseDescription: { fontSize: 14, color: C.muted, lineHeight: 20, marginBottom: 16 },
  phaseSelectBtn: { paddingVertical: 4 },
  phaseSelectText: { fontSize: 14, fontWeight: '700' },

  advantageCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  advantageImage: { width: '100%', height: 160 },
  advantageBody: { padding: 20 },
  advantageTitle: { fontSize: 17, fontWeight: '800', color: C.dark, marginBottom: 6 },
  advantageSub: { fontSize: 13, color: C.muted, lineHeight: 20, marginBottom: 16 },
  advantageRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  advantageItem: { fontSize: 13, color: C.dark, fontWeight: '500' },

  // Verification step
  verifySection: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  verifyHeader: { flexDirection: 'row', marginBottom: 16 },
  verifyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyTitle: { fontSize: 15, fontWeight: '700', color: C.dark, marginBottom: 4 },
  verifySub: { fontSize: 12, color: C.muted, flex: 1, lineHeight: 18 },
  uploadBox: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D0E8DF',
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FBF9',
    gap: 8,
  },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 12 },
  uploadLabel: { fontSize: 11, fontWeight: '700', color: C.light, letterSpacing: 1 },

  coachCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  coachHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  coachSectionTitle: { fontSize: 17, fontWeight: '800', color: C.dark },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  matchBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  coachProfile: { flexDirection: 'row', marginBottom: 16 },
  coachAvatarWrap: { position: 'relative' },
  coachAvatarBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  coachName: { fontSize: 17, fontWeight: '800', color: C.dark },
  coachRole: { fontSize: 12, color: C.muted, marginTop: 2, marginBottom: 10, lineHeight: 18 },
  coachStatus: { fontSize: 13, color: C.muted, marginTop: 2 },
  coachTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  coachTag: { backgroundColor: '#E8F4EF', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  coachTagText: { fontSize: 11, fontWeight: '600', color: C.primary },
  coachQuote: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 20,
    fontStyle: 'italic',
    borderLeftWidth: 3,
    borderLeftColor: '#E8F4EF',
    paddingLeft: 12,
  },

  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  securityText: { fontSize: 11, color: C.light, letterSpacing: 0.3 },

  // Bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E4EDE9',
    gap: 12,
  },
  backNavBtn: { flexDirection: 'column', alignItems: 'center', gap: 2, paddingVertical: 8, paddingHorizontal: 12 },
  backNavText: { fontSize: 10, fontWeight: '700', color: C.muted, letterSpacing: 0.5 },
  continueBtn: {
    flex: 1,
    backgroundColor: C.dark,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueBtnText: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // Complete step
  completeCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: { fontSize: 38, fontWeight: '900', color: C.dark, letterSpacing: -1, marginBottom: 10, textAlign: 'center' },
  completePhase: { fontSize: 18, color: C.dark, fontWeight: '500', textAlign: 'center', marginBottom: 14, lineHeight: 26 },
  completeSub: { fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 16, marginBottom: 8 },
  completeCoachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    width: '100%',
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});
