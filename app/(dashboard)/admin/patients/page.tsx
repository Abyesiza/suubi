"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminPatientsPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Fetch all patients
  const patients = useQuery(api.users.getPatients, {
    limit: 200,
  });

  // Loading state
  if (currentUser === undefined || patients === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Filter patients
  const filteredPatients = patients?.filter((patient) => {
    const matchesSearch =
      !searchQuery ||
      patient.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const getRecentPatientsCount = () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return patients?.filter(p => (p.createdAt || 0) >= thirtyDaysAgo).length || 0;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <PageHeader
        title="Patient Management"
        description="View and manage all registered patients"
      />

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-eucalyptus/10">
                <Users className="h-5 w-5 text-brand-eucalyptus" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{patients?.length || 0}</p>
                <p className="text-xs text-gray-500">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10">
                <Calendar className="h-5 w-5 text-brand-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{getRecentPatientsCount()}</p>
                <p className="text-xs text-gray-500">New (30 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10">
                <FileText className="h-5 w-5 text-brand-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">
                  {patients?.filter(p => p.medicalHistory && p.medicalHistory.length > 0).length || 0}
                </p>
                <p className="text-xs text-gray-500">With Medical History</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      {/* Patients Table - Desktop */}
      <motion.div variants={itemVariants} className="hidden md:block">
        <Card className="shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients && filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={patient.imageUrl}
                            alt={patient.firstName || "Patient"}
                          />
                          <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus">
                            {(patient.firstName?.[0] || "") + (patient.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-brand-navy">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {patient.phoneNumber ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            {patient.phoneNumber}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {patient.gender?.replace("_", " ") || "—"}
                    </TableCell>
                    <TableCell>
                      {patient.dateOfBirth
                        ? format(new Date(patient.dateOfBirth), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {patient.createdAt
                        ? format(new Date(patient.createdAt), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Patient Details</DialogTitle>
                            <DialogDescription>
                              Comprehensive patient information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPatient && (
                            <div className="space-y-6 py-4">
                              {/* Profile */}
                              <div className="flex items-center gap-4 pb-4 border-b">
                                <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                                  <AvatarImage src={selectedPatient.imageUrl} />
                                  <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus text-2xl">
                                    {(selectedPatient.firstName?.[0] || "") +
                                      (selectedPatient.lastName?.[0] || "")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-semibold text-brand-navy">
                                    {selectedPatient.firstName} {selectedPatient.lastName}
                                  </h3>
                                  <p className="text-sm text-gray-500">{selectedPatient.email}</p>
                                  {selectedPatient.phoneNumber && (
                                    <p className="text-sm text-gray-500">{selectedPatient.phoneNumber}</p>
                                  )}
                                </div>
                              </div>

                              {/* Personal Info */}
                              <div>
                                <h4 className="font-semibold text-brand-navy mb-3">Personal Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium capitalize">
                                      {selectedPatient.gender?.replace("_", " ") || "Not specified"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="font-medium">
                                      {selectedPatient.dateOfBirth
                                        ? format(new Date(selectedPatient.dateOfBirth), "MMMM d, yyyy")
                                        : "Not specified"}
                                    </p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Emergency Contact</p>
                                    <p className="font-medium">
                                      {selectedPatient.emergencyContact || "Not specified"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Medical Information */}
                              <div>
                                <h4 className="font-semibold text-brand-navy mb-3">Medical Information</h4>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">Allergies</p>
                                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {selectedPatient.allergies.map((allergy: string, index: number) => (
                                          <Badge key={index} variant="destructive">
                                            {allergy}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-400">None recorded</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">Current Medications</p>
                                    {selectedPatient.currentMedications &&
                                    selectedPatient.currentMedications.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {selectedPatient.currentMedications.map(
                                          (medication: string, index: number) => (
                                            <Badge key={index} variant="secondary">
                                              {medication}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-400">None recorded</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">Medical History</p>
                                    {selectedPatient.medicalHistory &&
                                    selectedPatient.medicalHistory.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {selectedPatient.medicalHistory.map(
                                          (condition: string, index: number) => (
                                            <Badge key={index} variant="outline">
                                              {condition}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-400">None recorded</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    No patients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Patients Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredPatients && filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <motion.div key={patient._id} variants={itemVariants}>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={patient.imageUrl} alt={patient.firstName || "Patient"} />
                      <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus">
                        {(patient.firstName?.[0] || "") + (patient.lastName?.[0] || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand-navy truncate">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{patient.email}</p>
                      {patient.phoneNumber && (
                        <p className="text-sm text-gray-500">{patient.phoneNumber}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {patient.gender?.replace("_", " ") || "—"}
                        </Badge>
                        {patient.createdAt && (
                          <Badge variant="secondary" className="text-xs">
                            Joined {format(new Date(patient.createdAt), "MMM yyyy")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Patient Details</DialogTitle>
                        </DialogHeader>
                        {selectedPatient && (
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4 pb-4 border-b">
                              <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                                <AvatarImage src={selectedPatient.imageUrl} />
                                <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus text-xl">
                                  {(selectedPatient.firstName?.[0] || "") +
                                    (selectedPatient.lastName?.[0] || "")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg text-brand-navy">
                                  {selectedPatient.firstName} {selectedPatient.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedPatient.email}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">Gender</p>
                                <p className="font-medium text-sm capitalize">
                                  {selectedPatient.gender?.replace("_", " ") || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium text-sm">
                                  {selectedPatient.phoneNumber || "—"}
                                </p>
                              </div>
                            </div>

                            {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPatient.allergies.map((allergy: string, index: number) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No patients found</h3>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}

