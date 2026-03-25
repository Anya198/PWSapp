import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { onboardingSchema, OnboardingFormValues } from '../../src/lib/schemas';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useAuthStore';

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
    
    // Convert strings to float/int
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
    <SafeAreaView className="flex-1 bg-monochrome-900">
      <ScrollView className="flex-1 px-6">
        <View className="mt-8 mb-6">
          <Text className="text-white text-3xl font-bold">Step {step} of 3</Text>
          <Text className="text-monochrome-100 mt-2">
            {step === 1 && "Let's start with your physical baseline."}
            {step === 2 && "Select your program phase."}
            {step === 3 && "Any health history we should know about?"}
          </Text>
        </View>

        {step === 1 && (
          <View>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <Input label="Age" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.age?.message} />
              )}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <Input label="Gender" value={value} onChangeText={onChange} error={errors.gender?.message} />
              )}
            />
            <Controller
              control={control}
              name="height"
              render={({ field: { onChange, value } }) => (
                <Input label="Height (cm)" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.height?.message} />
              )}
            />
            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, value } }) => (
                <Input label="Weight (kg)" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.weight?.message} />
              )}
            />
            <Button title="Continue" onPress={() => setStep(2)} className="mt-4" />
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
                    title={phase} 
                    variant={value === phase ? 'primary' : 'secondary'}
                    onPress={() => onChange(phase)}
                    className="mb-4"
                  />
                )}
              />
            ))}
            <View className="flex-row justify-between mt-4">
              <Button title="Back" variant="outline" onPress={() => setStep(1)} className="flex-1 mr-2" />
              <Button title="Continue" onPress={() => setStep(3)} className="flex-1 ml-2" />
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Controller
              control={control}
              name="health_history"
              render={({ field: { onChange, value } }) => (
                <Input label="Health History (Optional)" multiline numberOfLines={4} value={value} onChangeText={onChange} />
              )}
            />
            <Controller
              control={control}
              name="goals"
              render={({ field: { onChange, value } }) => (
                <Input label="Your Goals" multiline numberOfLines={4} value={value} onChangeText={onChange} />
              )}
            />
            
            <View className="flex-row justify-between mt-4">
              <Button title="Back" variant="outline" onPress={() => setStep(2)} className="flex-1 mr-2" />
              <Button title="Complete Profile" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} className="flex-1 ml-2" />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
