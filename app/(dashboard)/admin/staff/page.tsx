"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical,
  Shield,
  Stethoscope,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
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
import { useState } from "react";
import { toast } from "sonner";

export default function AdminStaffManagementPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Fetch all staff members
  const staffMembers = useQuery(api.users.getStaffMembers, {
    limit: 100,
  });

  // Mutations
  const verifyStaff = useMutation(api.users.verifyStaffMember);
  const deleteStaffProfile = useMutation(api.users.deleteStaffProfile);
  const updateAvailability = useMutation(api.users.updateStaffAvailability);

  // Loading state
  if (currentUser === undefined || staffMembers === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleVerify = async (staffUserId: string) => {
    if (!currentUser) return;
    try {
      await verifyStaff({
        userId: staffUserId as any,
        verifiedBy: currentUser._id,
      });
      toast.success("Staff member verified");
    } catch (error) {
      toast.error("Failed to verify staff member");
    }
  };

  const handleToggleAvailability = async (staffUserId: string, currentStatus: boolean) => {
    try {
      await updateAvailability({
        userId: staffUserId as any,
        isAvailable: !currentStatus,
      });
      toast.success(`Staff ${!currentStatus ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const handleDelete = async (staffUserId: string) => {
    if (!currentUser) return;
    try {
      await deleteStaffProfile({
        userId: staffUserId as any,
        deletedBy: currentUser._id,
      });
      toast.success("Staff profile removed");
    } catch (error) {
      toast.error("Failed to remove staff profile");
    }
  };

  // Filter staff members
  const filteredStaff = staffMembers?.filter((member) => {
    const matchesSearch =
      !searchQuery ||
      member.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || member.staffProfile.role === roleFilter;

    return matchesSearch && matchesRole;
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return "bg-brand-orange text-white";
      case "doctor":
        return "bg-brand-teal text-white";
      case "nurse":
        return "bg-brand-eucalyptus text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const verifiedCount = staffMembers?.filter(m => m.staffProfile.verified).length || 0;
  const unverifiedCount = staffMembers?.filter(m => !m.staffProfile.verified).length || 0;
  const availableCount = staffMembers?.filter(m => m.staffProfile.isAvailable).length || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <PageHeader
        title="Staff Management"
        description="Manage your medical center staff"
      >
        <Button asChild className="bg-brand-navy hover:bg-brand-navy/90">
          <a href="/admin/staff/add">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </a>
        </Button>
      </PageHeader>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10">
                <Users className="h-5 w-5 text-brand-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{staffMembers?.length || 0}</p>
                <p className="text-xs text-gray-500">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{verifiedCount}</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10">
                <Shield className="h-5 w-5 text-brand-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{unverifiedCount}</p>
                <p className="text-xs text-gray-500">Unverified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-eucalyptus/10">
                <Stethoscope className="h-5 w-5 text-brand-eucalyptus" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{availableCount}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="nurse">Nurse</SelectItem>
            <SelectItem value="allied_health">Allied Health</SelectItem>
            <SelectItem value="support_staff">Support Staff</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Staff Table - Desktop */}
      <motion.div variants={itemVariants} className="hidden md:block">
        <Card className="shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff && filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <TableRow key={member.staffProfile._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={member.user.imageUrl || member.staffProfile.profileImage}
                            alt={member.user.firstName || "Staff"}
                          />
                          <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                            {(member.user.firstName?.[0] || "") + (member.user.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-brand-navy">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{member.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.staffProfile.role)}>
                        {member.staffProfile.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">
                      {member.staffProfile.specialty || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.staffProfile.verified ? "default" : "secondary"}>
                        {member.staffProfile.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            member.staffProfile.isAvailable ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm">
                          {member.staffProfile.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!member.staffProfile.verified && (
                            <DropdownMenuItem onClick={() => handleVerify(member.user._id)}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Verify Staff
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleAvailability(
                                member.user._id,
                                member.staffProfile.isAvailable || false
                              )
                            }
                          >
                            {member.staffProfile.isAvailable ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(member.user._id)}>
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Remove Staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    No staff members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Staff Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredStaff && filteredStaff.length > 0 ? (
          filteredStaff.map((member) => (
            <motion.div key={member.staffProfile._id} variants={itemVariants}>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={member.user.imageUrl || member.staffProfile.profileImage}
                        alt={member.user.firstName || "Staff"}
                      />
                      <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                        {(member.user.firstName?.[0] || "") + (member.user.lastName?.[0] || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand-navy truncate">
                        {member.user.firstName} {member.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge
                          className={`${getRoleBadgeColor(member.staffProfile.role)} text-xs`}
                        >
                          {member.staffProfile.role.replace("_", " ")}
                        </Badge>
                        <Badge variant={member.staffProfile.verified ? "default" : "secondary"} className="text-xs">
                          {member.staffProfile.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              member.staffProfile.isAvailable ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-600">
                            {member.staffProfile.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!member.staffProfile.verified && (
                          <DropdownMenuItem onClick={() => handleVerify(member.user._id)}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Verify
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleAvailability(
                              member.user._id,
                              member.staffProfile.isAvailable || false
                            )
                          }
                        >
                          {member.staffProfile.isAvailable ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(member.user._id)}>
                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No staff members found</h3>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}

