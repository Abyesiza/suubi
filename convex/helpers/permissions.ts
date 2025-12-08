import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { ADMIN_ROLES, MEDICAL_ROLES, StaffRole } from "./validators";

/**
 * Get staff profile by user ID
 */
export async function getStaffProfile(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
) {
  return await ctx.db
    .query("staff_profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

/**
 * Check if user has admin privileges
 */
export async function isAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile) return false;
  return ADMIN_ROLES.includes(profile.role as any);
}

/**
 * Check if user is a medical staff member
 */
export async function isMedicalStaff(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile) return false;
  return MEDICAL_ROLES.includes(profile.role as any);
}

/**
 * Check if user is a staff member (any role)
 */
export async function isStaff(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const profile = await getStaffProfile(ctx, userId);
  return !!profile;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  roles: StaffRole[]
): Promise<boolean> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile) return false;
  return roles.includes(profile.role as StaffRole);
}

/**
 * Require admin privileges - throws if user is not admin
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  errorMessage = "Unauthorized: Admin access required"
): Promise<void> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile || !ADMIN_ROLES.includes(profile.role as any)) {
    throw new Error(errorMessage);
  }
}

/**
 * Require staff privileges - throws if user is not staff
 */
export async function requireStaff(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  errorMessage = "Unauthorized: Staff access required"
): Promise<void> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile) {
    throw new Error(errorMessage);
  }
}

/**
 * Require medical staff privileges - throws if user is not medical staff
 */
export async function requireMedicalStaff(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  errorMessage = "Unauthorized: Medical staff access required"
): Promise<void> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile || !MEDICAL_ROLES.includes(profile.role as any)) {
    throw new Error(errorMessage);
  }
}

/**
 * Get user role from staff profile
 */
export async function getUserRole(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<StaffRole | null> {
  const profile = await getStaffProfile(ctx, userId);
  return profile?.role as StaffRole | null;
}

/**
 * Check if user can manage content (admin, superadmin, or editor)
 */
export async function canManageContent(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const profile = await getStaffProfile(ctx, userId);
  if (!profile) return false;
  return ["admin", "superadmin", "editor"].includes(profile.role);
}

/**
 * Require content management privileges
 */
export async function requireContentManager(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  errorMessage = "Unauthorized: Content management access required"
): Promise<void> {
  const canManage = await canManageContent(ctx, userId);
  if (!canManage) {
    throw new Error(errorMessage);
  }
}
