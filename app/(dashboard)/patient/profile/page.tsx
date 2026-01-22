"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  Heart,
  Pill,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/Loader";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PatientProfilePage() {
  const { user } = useUser();

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Mutations
  const updateProfile = useMutation(api.users.updateUserProfile);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "prefer_not_to_say",
    emergencyContact: "",
    allergies: [] as string[],
    currentMedications: [] as string[],
    medicalHistory: [] as string[],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

  // Loading state
  if (currentUser === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Initialize form data when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phoneNumber: currentUser.phoneNumber || "",
        dateOfBirth: currentUser.dateOfBirth
          ? format(new Date(currentUser.dateOfBirth), "yyyy-MM-dd")
          : "",
        gender: (currentUser.gender as any) || "prefer_not_to_say",
        emergencyContact: currentUser.emergencyContact || "",
        allergies: currentUser.allergies || [],
        currentMedications: currentUser.currentMedications || [],
        medicalHistory: currentUser.medicalHistory || [],
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      await updateProfile({
        userId: currentUser._id,
        updates: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).getTime() : undefined,
          gender: formData.gender as any,
          emergencyContact: formData.emergencyContact,
          allergies: formData.allergies,
          currentMedications: formData.currentMedications,
          medicalHistory: formData.medicalHistory,
        },
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phoneNumber: currentUser.phoneNumber || "",
        dateOfBirth: currentUser.dateOfBirth
          ? format(new Date(currentUser.dateOfBirth), "yyyy-MM-dd")
          : "",
        gender: (currentUser.gender as any) || "prefer_not_to_say",
        emergencyContact: currentUser.emergencyContact || "",
        allergies: currentUser.allergies || [],
        currentMedications: currentUser.currentMedications || [],
        medicalHistory: currentUser.medicalHistory || [],
      });
    }
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()],
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index),
    });
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData({
        ...formData,
        currentMedications: [...formData.currentMedications, newMedication.trim()],
      });
      setNewMedication("");
    }
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      currentMedications: formData.currentMedications.filter((_, i) => i !== index),
    });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData({
        ...formData,
        medicalHistory: [...formData.medicalHistory, newCondition.trim()],
      });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      medicalHistory: formData.medicalHistory.filter((_, i) => i !== index),
    });
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <PageHeader
        title="My Profile"
        description="Manage your personal and medical information"
      >
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-brand-navy hover:bg-brand-navy/90">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-brand-eucalyptus hover:bg-brand-eucalyptus/90">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </PageHeader>

      {/* Profile Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-md border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
                <AvatarImage src={currentUser?.imageUrl} alt={currentUser?.firstName || "User"} />
                <AvatarFallback className="bg-brand-eucalyptus text-white text-2xl sm:text-3xl font-semibold">
                  {(currentUser?.firstName?.[0] || "") + (currentUser?.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-1">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{currentUser?.email}</span>
                  </div>
                  {currentUser?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{currentUser.phoneNumber}</span>
                    </div>
                  )}
                </div>
                <Badge className="bg-brand-eucalyptus text-white">Patient</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-navy" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+256 XXX XXX XXX"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="gender" className="bg-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Name and phone number"
                  className="bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medical Information */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Medical Information
            </CardTitle>
            <CardDescription>Your health information for better care</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Allergies */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4 text-brand-orange" />
                Known Allergies
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="px-3 py-1">
                    {allergy}
                    {isEditing && (
                      <button
                        onClick={() => removeAllergy(index)}
                        className="ml-2 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.allergies.length === 0 && (
                  <p className="text-sm text-gray-500">No allergies recorded</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add an allergy..."
                    onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={addAllergy} size="sm" className="bg-brand-orange hover:bg-brand-orange/90">
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Current Medications */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Pill className="h-4 w-4 text-brand-teal" />
                Current Medications
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.currentMedications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="bg-brand-teal/10 text-brand-teal px-3 py-1">
                    {medication}
                    {isEditing && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.currentMedications.length === 0 && (
                  <p className="text-sm text-gray-500">No medications recorded</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add a medication..."
                    onKeyPress={(e) => e.key === "Enter" && addMedication()}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={addMedication} size="sm" className="bg-brand-teal hover:bg-brand-teal/90">
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Medical History */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-brand-eucalyptus" />
                Medical Conditions & History
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.medicalHistory.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="bg-brand-eucalyptus/10 text-brand-eucalyptus px-3 py-1">
                    {condition}
                    {isEditing && (
                      <button
                        onClick={() => removeCondition(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.medicalHistory.length === 0 && (
                  <p className="text-sm text-gray-500">No medical history recorded</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add a condition..."
                    onKeyPress={(e) => e.key === "Enter" && addCondition()}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={addCondition} size="sm" className="bg-brand-eucalyptus hover:bg-brand-eucalyptus/90">
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Important Notice */}
      <motion.div variants={itemVariants}>
        <Card className="border-brand-orange/20 bg-brand-orange/5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-brand-navy mb-1">Important Notice</h4>
                <p className="text-sm text-gray-600">
                  Keeping your medical information up-to-date helps our healthcare providers give you the best possible care. Please inform us of any changes to your allergies, medications, or medical conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

