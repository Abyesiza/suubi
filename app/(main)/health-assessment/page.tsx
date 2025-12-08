'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  ChevronRight,
  ChevronLeft,
  HeartPulse,
  Thermometer,
  Brain,
  Activity,
  Stethoscope,
  Calendar,
  ArrowRight,
  Sparkles,
  X,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AssessmentStep = 'mood' | 'symptoms' | 'details' | 'results';

const moodOptions = [
  { value: 'great', emoji: '😊', label: 'Great', description: 'Feeling healthy and energetic' },
  { value: 'okay', emoji: '😐', label: 'Okay', description: 'Some minor discomfort' },
  { value: 'not-well', emoji: '😔', label: 'Not Well', description: 'Feeling unwell' },
  { value: 'sick', emoji: '🤒', label: 'Sick', description: 'Significant symptoms' },
];

const symptomCategories = [
  {
    name: 'General',
    icon: Activity,
    symptoms: ['Fatigue', 'Weakness', 'Fever', 'Chills', 'Night sweats', 'Weight loss']
  },
  {
    name: 'Head & Neck',
    icon: Brain,
    symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Earache', 'Neck pain', 'Congestion']
  },
  {
    name: 'Respiratory',
    icon: Thermometer,
    symptoms: ['Cough', 'Shortness of breath', 'Chest pain', 'Wheezing', 'Runny nose']
  },
  {
    name: 'Digestive',
    icon: HeartPulse,
    symptoms: ['Nausea', 'Vomiting', 'Stomach pain', 'Diarrhea', 'Constipation', 'Loss of appetite']
  },
];

const urgencyLevels = {
  low: { label: 'Low Priority', color: 'text-green-600 bg-green-50 border-green-200', description: 'Self-care may be sufficient' },
  medium: { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200', description: 'Consider scheduling an appointment' },
  high: { label: 'High Priority', color: 'text-orange-600 bg-orange-50 border-orange-200', description: 'Schedule an appointment soon' },
  urgent: { label: 'Urgent', color: 'text-red-600 bg-red-50 border-red-200', description: 'Seek medical attention promptly' },
};

export default function HealthAssessmentPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<AssessmentStep>('mood');
  const [mood, setMood] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [painLevel, setPainLevel] = useState([3]);
  const [duration, setDuration] = useState('');

  // Check for mood from URL params
  useEffect(() => {
    const moodParam = searchParams.get('mood');
    if (moodParam) {
      setMood(moodParam);
      setStep('symptoms');
    }
  }, [searchParams]);

  const progress = {
    mood: 25,
    symptoms: 50,
    details: 75,
    results: 100,
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const calculateUrgency = () => {
    const symptomCount = selectedSymptoms.length;
    const pain = painLevel[0];
    const moodSeverity = { 'great': 0, 'okay': 1, 'not-well': 2, 'sick': 3 }[mood] || 0;

    const score = symptomCount * 2 + pain + moodSeverity * 2;

    if (score >= 15) return 'urgent';
    if (score >= 10) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  const goToStep = (newStep: AssessmentStep) => {
    setStep(newStep);
  };

  const canProceedFromMood = !!mood;
  const canProceedFromSymptoms = selectedSymptoms.length > 0;

  return (
    <div className="min-h-screen py-20 lg:py-24 bg-gradient-to-br from-brand-sky/5 via-white to-brand-teal/5">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4 bg-brand-teal/10 text-brand-teal border-brand-teal/20">
            <HeartPulse className="w-3 h-3 mr-1" />
            Health Assessment
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-3">
            Let's Check Your Health
          </h1>
          <p className="text-brand-navy/60 max-w-lg mx-auto">
            Answer a few questions to get personalized health recommendations
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm text-brand-navy/60 mb-2">
            <span>Progress</span>
            <span>{progress[step]}% Complete</span>
          </div>
          <Progress value={progress[step]} className="h-2" />
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Mood Selection */}
          {step === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-gray-100 shadow-lg">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-brand-navy">How are you feeling today?</CardTitle>
                  <CardDescription>Select the option that best describes your current state</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMood(option.value)}
                        className={cn(
                          "p-6 rounded-2xl border-2 transition-all duration-300 text-center group",
                          mood === option.value
                            ? "border-brand-teal bg-brand-teal/5 shadow-md"
                            : "border-gray-100 hover:border-brand-teal/50 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">
                          {option.emoji}
                        </span>
                        <span className={cn(
                          "font-semibold block mb-1",
                          mood === option.value ? "text-brand-teal" : "text-brand-navy"
                        )}>
                          {option.label}
                        </span>
                        <span className="text-xs text-brand-navy/50">{option.description}</span>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={() => goToStep('symptoms')}
                    disabled={!canProceedFromMood}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    size="lg"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Symptom Selection */}
          {step === 'symptoms' && (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-gray-100 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-brand-navy">What symptoms do you have?</CardTitle>
                      <CardDescription>Select all that apply</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep('mood')}>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Custom Symptom Input */}
                  <div className="flex gap-2 mb-6">
                    <Input
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="Add a symptom not listed..."
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                    />
                    <Button onClick={addCustomSymptom} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Selected Symptoms */}
                  {selectedSymptoms.length > 0 && (
                    <div className="mb-6">
                      <Label className="text-sm text-brand-navy/60 mb-2 block">Selected ({selectedSymptoms.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map((symptom) => (
                          <Badge
                            key={symptom}
                            variant="secondary"
                            className="bg-brand-teal/10 text-brand-teal border-brand-teal/20 pr-1"
                          >
                            {symptom}
                            <button
                              onClick={() => toggleSymptom(symptom)}
                              className="ml-1 p-0.5 hover:bg-brand-teal/20 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symptom Categories */}
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                    {symptomCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.name}>
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="w-4 h-4 text-brand-teal" />
                            <Label className="font-medium text-brand-navy">{category.name}</Label>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {category.symptoms.map((symptom) => (
                              <button
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-sm border transition-all",
                                  selectedSymptoms.includes(symptom)
                                    ? "bg-brand-teal text-white border-brand-teal"
                                    : "bg-white text-brand-navy border-gray-200 hover:border-brand-teal/50"
                                )}
                              >
                                {symptom}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => goToStep('details')}
                    disabled={!canProceedFromSymptoms}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90 mt-6"
                    size="lg"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Additional Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-gray-100 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-brand-navy">Tell us more</CardTitle>
                      <CardDescription>This helps us give better recommendations</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep('symptoms')}>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pain Level */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium text-brand-navy">Pain/Discomfort Level</Label>
                      <span className={cn(
                        "text-sm font-semibold px-3 py-1 rounded-full",
                        painLevel[0] <= 3 ? "bg-green-100 text-green-700" :
                        painLevel[0] <= 6 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {painLevel[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={painLevel}
                      onValueChange={setPainLevel}
                      max={10}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-brand-navy/50">
                      <span>No pain</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label className="font-medium text-brand-navy mb-3 block">How long have you had these symptoms?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Today', '1-3 days', '4-7 days', 'Over a week'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setDuration(option)}
                          className={cn(
                            "p-3 rounded-lg border text-sm transition-all",
                            duration === option
                              ? "border-brand-teal bg-brand-teal/5 text-brand-teal font-medium"
                              : "border-gray-200 hover:border-brand-teal/50"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="font-medium text-brand-navy mb-3 block">
                      Additional details (optional)
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your symptoms in more detail, when they started, what makes them better or worse..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={() => goToStep('results')}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    size="lg"
                  >
                    Get Recommendations
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <Card className="border-gray-100 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-brand-teal" />
                  </div>
                  <CardTitle className="text-2xl text-brand-navy">Assessment Complete</CardTitle>
                  <CardDescription>Here's what we recommend based on your symptoms</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Urgency Level */}
                  <div className={cn(
                    "p-4 rounded-xl border mb-6",
                    urgencyLevels[calculateUrgency()].color
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{urgencyLevels[calculateUrgency()].label}</span>
                      <Info className="w-4 h-4" />
                    </div>
                    <p className="text-sm">{urgencyLevels[calculateUrgency()].description}</p>
                  </div>

                  {/* Symptoms Summary */}
                  <div className="mb-6">
                    <Label className="text-sm text-brand-navy/60 mb-2 block">Your Symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge key={symptom} variant="outline" className="border-gray-200">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <Label className="text-sm text-brand-navy/60 block">Recommendations</Label>
                    
                    <div className="p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-5 h-5 text-brand-teal" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-navy">Consult a Healthcare Professional</p>
                          <p className="text-sm text-brand-navy/60">
                            Based on your symptoms, we recommend scheduling an appointment with one of our doctors for a proper evaluation.
                          </p>
                        </div>
                      </div>
                    </div>

                    {painLevel[0] >= 7 && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-700">High Pain Level Detected</p>
                            <p className="text-sm text-red-600">
                              If pain is severe or worsening, please seek immediate medical attention.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/appointments">
                  <Button 
                    className="w-full bg-gradient-to-r from-brand-orange to-amber-500 hover:from-amber-500 hover:to-brand-orange text-white shadow-lg group"
                    size="lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button 
                    variant="outline"
                    className="w-full border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    size="lg"
                  >
                    Talk to Our Team
                  </Button>
                </Link>
              </div>

              {/* Start Over */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep('mood');
                    setMood('');
                    setSelectedSymptoms([]);
                    setDescription('');
                    setPainLevel([3]);
                    setDuration('');
                  }}
                  className="text-brand-navy/60"
                >
                  Start New Assessment
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-brand-navy/40 mt-8"
        >
          This assessment is for informational purposes only and does not constitute medical advice. 
          Always consult a healthcare professional for proper diagnosis and treatment.
        </motion.p>
      </div>
    </div>
  );
}
