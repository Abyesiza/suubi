import { v } from "convex/values";

// ===== ROLE VALIDATORS =====

export const staffRoleValidator = v.union(
  v.literal("admin"),
  v.literal("doctor"),
  v.literal("nurse"),
  v.literal("allied_health"),
  v.literal("support_staff"),
  v.literal("administrative_staff"),
  v.literal("technical_staff"),
  v.literal("training_research_staff"),
  v.literal("superadmin"),
  v.literal("editor")
);

export const medicalRoleValidator = v.union(
  v.literal("doctor"),
  v.literal("nurse"),
  v.literal("allied_health")
);

export const adminRoleValidator = v.union(
  v.literal("admin"),
  v.literal("superadmin")
);

// ===== GENDER VALIDATOR =====

export const genderValidator = v.union(
  v.literal("male"),
  v.literal("female"),
  v.literal("other"),
  v.literal("prefer_not_to_say")
);

// ===== APPOINTMENT VALIDATORS =====

export const appointmentStatusValidator = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("confirmed"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("rescheduled"),
  v.literal("no_show")
);

export const appointmentTypeValidator = v.union(
  v.literal("consultation"),
  v.literal("follow_up"),
  v.literal("emergency"),
  v.literal("routine_checkup"),
  v.literal("specialist_referral"),
  v.literal("telemedicine"),
  v.literal("in_person")
);

export const appointmentPriorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("urgent")
);

export const paymentStatusValidator = v.union(
  v.literal("pending"),
  v.literal("paid"),
  v.literal("partially_paid"),
  v.literal("refunded"),
  v.literal("waived")
);

// ===== USER OBJECT VALIDATOR =====

export const userObjectValidator = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  clerkId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  dateOfBirth: v.optional(v.number()),
  gender: v.optional(genderValidator),
  phoneNumber: v.optional(v.string()),
  emergencyContact: v.optional(v.string()),
  medicalHistory: v.optional(v.array(v.string())),
  allergies: v.optional(v.array(v.string())),
  currentMedications: v.optional(v.array(v.string())),
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
});

// ===== STAFF PROFILE OBJECT VALIDATOR =====

export const staffProfileObjectValidator = v.object({
  _id: v.id("staff_profiles"),
  _creationTime: v.number(),
  userId: v.id("users"),
  role: staffRoleValidator,
  subRole: v.optional(v.string()),
  specialty: v.optional(v.string()),
  licenseNumber: v.optional(v.string()),
  qualifications: v.optional(v.array(v.string())),
  experience: v.optional(v.number()),
  bio: v.optional(v.string()),
  languages: v.optional(v.array(v.string())),
  consultationFee: v.optional(v.number()),
  isAvailable: v.optional(v.boolean()),
  rating: v.optional(v.number()),
  totalReviews: v.optional(v.number()),
  profileImage: v.optional(v.string()),
  verified: v.boolean(),
  verifiedById: v.optional(v.id("users")),
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
});

// ===== APPOINTMENT OBJECT VALIDATOR =====

export const appointmentObjectValidator = v.object({
  _id: v.id("appointments"),
  _creationTime: v.number(),
  patientId: v.id("users"),
  staffProfileId: v.optional(v.id("staff_profiles")),
  appointmentDate: v.number(),
  duration: v.number(),
  status: appointmentStatusValidator,
  appointmentType: v.optional(appointmentTypeValidator),
  reason: v.optional(v.string()),
  notes: v.optional(v.string()),
  symptoms: v.optional(v.array(v.string())),
  priority: v.optional(appointmentPriorityValidator),
  location: v.optional(v.string()),
  roomNumber: v.optional(v.string()),
  fee: v.optional(v.number()),
  paymentStatus: v.optional(paymentStatusValidator),
  insuranceDetails: v.optional(v.string()),
  followUpRequired: v.optional(v.boolean()),
  followUpDate: v.optional(v.number()),
  cancelledAt: v.optional(v.number()),
  cancelReason: v.optional(v.string()),
  rescheduledFrom: v.optional(v.id("appointments")),
  approvedById: v.optional(v.id("users")),
  approvedAt: v.optional(v.number()),
  confirmedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
});

// ===== STAFF WITH USER OBJECT VALIDATOR =====

export const staffWithUserValidator = v.object({
  user: userObjectValidator,
  staffProfile: staffProfileObjectValidator,
});

// ===== ARRAY HELPER TYPES =====

export type StaffRole = 
  | "admin"
  | "doctor"
  | "nurse"
  | "allied_health"
  | "support_staff"
  | "administrative_staff"
  | "technical_staff"
  | "training_research_staff"
  | "superadmin"
  | "editor";

export type MedicalRole = "doctor" | "nurse" | "allied_health";

export type AdminRole = "admin" | "superadmin";

export const ADMIN_ROLES: AdminRole[] = ["admin", "superadmin"];
export const MEDICAL_ROLES: MedicalRole[] = ["doctor", "nurse", "allied_health"];
