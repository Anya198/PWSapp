import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { onboardingSchema, OnboardingFormValues } from '../../src/lib/schemas';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phase: 'HPOP'
    }
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    
    const profileData = {
      user_id: user.id,
      age: parseInt(data.age, 10),
      gender: data.gender,
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      active_phase: data.phase,
      health_history: data.health_history || '',
      goals: data.goals || '',
      onboarding_completed: true
    };

    const { error } = await supabase.from('user_profiles').upsert(profileData);

    setIsSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(app)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}>
          
          <View className="flex-row items-center mb-10">
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : null} className={`w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm ${step === 1 ? 'opacity-0' : ''}`}>
              <Ionicons name="arrow-back" size={24} color="#0B2A20" />
            </TouchableOpacity>
            <View className="flex-1 items-center mr-12">
              <Text className="text-text-dark text-xl font-bold">Step {step} of 3</Text>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-text-dark text-3xl font-bold mb-2">
              {step === 1 && "Physical Baseline"}
              {step === 2 && "Program Phase"}
              {step === 3 && "Health Profile"}
            </Text>
            <Text className="text-text-light text-base leading-6">
              {step === 1 && "Help us tailor your journey by providing some basic physical metrics."}
              {step === 2 && "Select the wellness phase that best aligns with your current lifestyle."}
              {step === 3 && "Any health history or specific goals we should focus on?"}
            </Text>
          </View>

          <View className="bg-white rounded-[32px] p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] mb-8">
            {step === 1 && (
              <View>
                <Controller
                  control={control}
                  name="age"
                  render={({ field: { onChange, value } }) => (
                    <Input label="Age" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.age?.message} />
                  )}
                />
                <View className="flex-row space-x-4 mb-5">
                  <View className="flex-1 pr-2">
                    <Controller
                      control={control}
                      name="height"
                      render={({ field: { onChange, value } }) => (
                        <Input label="Height (cm)" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.height?.message} className="mb-0" />
                      )}
                    />
                  </View>
                  <View className="flex-1 pl-2">
                    <Controller
                      control={control}
                      name="weight"
                      render={({ field: { onChange, value } }) => (
                        <Input label="Weight (kg)" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.weight?.message} className="mb-0" />
                      )}
                    />
                  </View>
                </View>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, value } }) => (
                    <Input label="Gender" value={value} onChangeText={onChange} error={errors.gender?.message} />
                  )}
                />
              </View>
            )}

            {step === 2 && (
              <View>
                {['HPOP', 'TPOP', 'EPOP'].map((phase) => (
                  <Controller
                    key={phase}
                    control={control}
                    name="phase"
                    render={({ field: { onChange, value } }) => (
                      <Button 
                        title={`${phase} Phase`} 
                        variant={value === phase ? 'primary' : 'secondary'}
                        onPress={() => onChange(phase)}
                        className="mb-4"
                        icon={value === phase ? <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ position: 'absolute', right: 24 }} /> : null}
                      />
                    )}
                  />
                ))}
              </View>
            )}

            {step === 3 && (
              <View>
                <Controller
                  control={control}
                  name="health_history"
                  render={({ field: { onChange, value } }) => (
                    <Input label="Health History (Optional)" multiline numberOfLines={3} value={value} onChangeText={onChange} style={{ height: 80, textAlignVertical: 'top' }} />
                  )}
                />
                <Controller
                  control={control}
                  name="goals"
                  render={({ field: { onChange, value } }) => (
                    <Input label="Your Wellness Goals" multiline numberOfLines={3} value={value} onChangeText={onChange} style={{ height: 80, textAlignVertical: 'top' }} />
                  )}
                />
              </View>
            )}
          </View>

          <View className="mt-auto pb-8 pt-4">
            {step < 3 ? (
              <Button title="Continue" onPress={() => setStep(step + 1)} icon={<Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />} />
            ) : (
              <Button title="Complete Setup" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
