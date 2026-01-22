"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  Award,
  BookOpen,
  Globe,
  DollarSign,
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
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function StaffProfilePage() {
  const { user } = useUser();

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Get staff profile
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Mutations
  const updateStaffProfile = useMutation(api.staffProfiles.updateStaffProfile);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialty: "",
    licenseNumber: "",
    qualifications: [] as string[],
    experience: 0,
    bio: "",
    languages: [] as string[],
    consultationFee: 0,
  });

  const [newQualification, setNewQualification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  // Loading state
  if (currentUser === undefined || staffProfile === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Initialize form data when staffProfile is loaded
  useEffect(() => {
    if (staffProfile) {
      setFormData({
        specialty: staffProfile.specialty || "",
        licenseNumber: staffProfile.licenseNumber || "",
        qualifications: staffProfile.qualifications || [],
        experience: staffProfile.experience || 0,
        bio: staffProfile.bio || "",
        languages: staffProfile.languages || [],
        consultationFee: staffProfile.consultationFee || 0,
      });
    }
  }, [staffProfile]);

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      await updateStaffProfile({
        userId: currentUser._id,
        specialty: formData.specialty,
        licenseNumber: formData.licenseNumber,
        qualifications: formData.qualifications,
        experience: formData.experience,
        bio: formData.bio,
        languages: formData.languages,
        consultationFee: formData.consultationFee,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (staffProfile) {
      setFormData({
        specialty: staffProfile.specialty || "",
        licenseNumber: staffProfile.licenseNumber || "",
        qualifications: staffProfile.qualifications || [],
        experience: staffProfile.experience || 0,
        bio: staffProfile.bio || "",
        languages: staffProfile.languages || [],
        consultationFee: staffProfile.consultationFee || 0,
      });
    }
    setIsEditing(false);
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, newQualification.trim()],
      });
      setNewQualification("");
    }
  };

  const removeQualification = (index: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index),
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()],
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      doctor: "Doctor",
      nurse: "Nurse",
      allied_health: "Allied Health Professional",
      support_staff: "Support Staff",
      administrative_staff: "Administrative Staff",
      technical_staff: "Technical Staff",
      training_research_staff: "Training & Research Staff",
    };
    return labels[role] || role;
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
        description="Manage your professional information"
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
                <AvatarFallback className="bg-brand-teal text-white text-2xl sm:text-3xl font-semibold">
                  <Stethoscope className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-1">
                  {staffProfile.role === "doctor" ? "Dr. " : ""}
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{getRoleLabel(staffProfile.role)}</p>
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
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge className="bg-brand-teal text-white">
                    {staffProfile.role.replace("_", " ")}
                  </Badge>
                  {staffProfile.verified && (
                    <Badge className="bg-green-500 text-white">Verified</Badge>
                  )}
                  {staffProfile.isAvailable && (
                    <Badge className="bg-brand-eucalyptus text-white">Available</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Professional Information */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-brand-navy" />
              Professional Information
            </CardTitle>
            <CardDescription>Your medical credentials and experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., General Medicine, Cardiology"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Your professional license number"
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultationFee">Consultation Fee (UGX)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) || 0 })}
                  disabled={!isEditing}
                  placeholder="0"
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Tell patients about your expertise and experience..."
                className="min-h-[100px] bg-white"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Qualifications & Languages */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-brand-navy" />
              Qualifications & Languages
            </CardTitle>
            <CardDescription>Your certifications and language abilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Qualifications */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-brand-teal" />
                Qualifications & Certifications
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.qualifications.map((qual, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {qual}
                    {isEditing && (
                      <button
                        onClick={() => removeQualification(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.qualifications.length === 0 && (
                  <p className="text-sm text-gray-500">No qualifications added</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="Add a qualification..."
                    onKeyPress={(e) => e.key === "Enter" && addQualification()}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={addQualification} size="sm" className="bg-brand-teal hover:bg-brand-teal/90">
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-brand-eucalyptus" />
                Languages Spoken
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="bg-brand-eucalyptus/10 text-brand-eucalyptus px-3 py-1">
                    {lang}
                    {isEditing && (
                      <button
                        onClick={() => removeLanguage(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.languages.length === 0 && (
                  <p className="text-sm text-gray-500">No languages added</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language..."
                    onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={addLanguage} size="sm" className="bg-brand-eucalyptus hover:bg-brand-eucalyptus/90">
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

