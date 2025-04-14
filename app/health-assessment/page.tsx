'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import PageLayout from '@/components/PageLayout';

const symptoms = [
  { id: 1, name: 'Headache', severity: 'mild' },
  { id: 2, name: 'Fever', severity: 'moderate' },
  { id: 3, name: 'Cough', severity: 'mild' },
  { id: 4, name: 'Fatigue', severity: 'severe' },
  { id: 5, name: 'Sore Throat', severity: 'moderate' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function HealthAssessmentPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [painLevel, setPainLevel] = useState([5]);
  const [customSymptom, setCustomSymptom] = useState('');

  const toggleSymptom = (id: number) => {
    setSelectedSymptoms(prev =>
      prev.includes(id)
        ? prev.filter(symptomId => symptomId !== id)
        : [...prev, id]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim()) {
      symptoms.push({
        id: symptoms.length + 1,
        name: customSymptom,
        severity: 'unknown'
      });
      setCustomSymptom('');
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-foreground">Health Assessment</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us about your symptoms for personalized health recommendations.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 mb-8 border-green-light">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">How are you feeling?</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Describe your symptoms
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please describe how you're feeling in detail..."
                      className="min-h-[120px] border-green-light focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-4">
                      Pain Level: {painLevel[0]}/10
                    </label>
                    <Slider
                      value={painLevel}
                      onValueChange={setPainLevel}
                      max={10}
                      step={1}
                      className="mb-8"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-green-light">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">Select Your Symptoms</h2>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Add custom symptom..."
                    className="flex-1 p-2 border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={addCustomSymptom} className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4"
                >
                  {symptoms.map((symptom) => (
                    <motion.div
                      key={symptom.id}
                      variants={itemVariants}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'border-primary bg-green-subtle'
                          : 'hover:border-green-light'
                      }`}
                      onClick={() => toggleSymptom(symptom.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{symptom.name}</h3>
                          <p className="text-sm text-muted-foreground">Severity: {symptom.severity}</p>
                        </div>
                        <CheckCircle2
                          className={`w-6 h-6 transition-opacity ${
                            selectedSymptoms.includes(symptom.id)
                              ? 'text-primary opacity-100'
                              : 'opacity-0'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 sticky top-6 border-green-light">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">Recommendations</h2>
                {selectedSymptoms.length > 0 || description || painLevel[0] > 3 ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Based on your symptoms, we recommend:
                    </p>
                    <div className="bg-green-subtle p-4 rounded-lg">
                      <p className="font-medium text-primary">
                        Schedule an appointment with a General Practitioner
                      </p>
                    </div>
                    <Button className="w-full btn-primary">Book Appointment Now</Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>Please describe your symptoms to get recommendations</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}