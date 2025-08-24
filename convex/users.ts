import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }
    const clerkId = String(identity.subject || identity.id);
    const email = String(identity.email);
    const firstName = identity.firstName ? String(identity.firstName) : (identity.name ? String(identity.name) : undefined);
    const lastName = identity.lastName ? String(identity.lastName) : (identity.surname ? String(identity.surname) : undefined);
    const imageUrl = identity.imageUrl ? String(identity.imageUrl) : undefined;
    if (!clerkId || !email) {
      throw new Error("Missing required user data from JWT token");
    }
    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", clerkId)
      )
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      });
      return user._id;
    }
    const userId = await ctx.db.insert("users", {
      clerkId: clerkId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
      role: "patient"
    });
    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const clerkId = String(identity.subject || identity.id);
    if (!clerkId) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
      .unique();
    return user;
  },
});

// List all users
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(u => ({
      _id: u._id,
      clerkId: u.clerkId,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      subRole: u.subRole,
      imageUrl: u.imageUrl,
    }));
  },
});

// Add a test mutation to debug JWT token structure
export const debugAuth = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return {
      hasIdentity: !!identity,
      identity: identity,
      timestamp: Date.now()
    };
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    newRole: v.union(
      v.literal("admin"),
      v.literal("patient"),
      v.literal("doctor"),
      v.literal("nurse"),
      v.literal("allied_health"),
      v.literal("support_staff"),
      v.literal("administrative_staff"),
      v.literal("technical_staff"),
      v.literal("training_research_staff"),
      v.literal("superadmin"),
      v.literal("editor")
    ),
    subRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData: any = { role: args.newRole };
    if (args.subRole !== undefined) {
      updateData.subRole = args.subRole;
    }
    await ctx.db.patch(args.userId, updateData);
  },
});

// List staff users (non-admin) with their completed staff profiles, optionally filtered
export const listStaffUsersWithProfiles = query({
  args: {
    role: v.optional(
      v.union(
        v.literal("doctor"),
        v.literal("nurse"),
        v.literal("allied_health"),
        v.literal("support_staff"),
        v.literal("administrative_staff"),
        v.literal("technical_staff"),
        v.literal("training_research_staff")
      )
    ),
    subRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staffRoles = [
      "doctor",
      "nurse",
      "allied_health",
      "support_staff",
      "administrative_staff",
      "technical_staff",
      "training_research_staff",
    ] as const;

    const targetRoles = args.role ? [args.role] : staffRoles;

    // Gather users by staff roles using the role index
    const users: any[] = [];
    for (const r of targetRoles) {
      const roleUsers = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", r))
        .collect();
      users.push(...roleUsers);
    }

    const results: Array<{
      user: any;
      profile: any;
    }> = [];

    for (const user of users) {
      // Optional subRole filter on user
      if (args.subRole && user.subRole !== args.subRole) continue;

      const profile = await ctx.db
        .query("staff_profiles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();
      if (!profile) continue;

      results.push({ user, profile });
    }

    return results;
  },
});

export const listStaffUsers = query({
  args: {
    role: v.optional(
      v.union(
        v.literal("doctor"),
        v.literal("nurse"),
        v.literal("allied_health"),
        v.literal("support_staff"),
        v.literal("administrative_staff"),
        v.literal("technical_staff"),
        v.literal("training_research_staff")
      )
    ),
    subRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staffRoles = [
      "doctor",
      "nurse",
      "allied_health",
      "support_staff",
      "administrative_staff",
      "technical_staff",
      "training_research_staff",
    ] as const;

    const targetRoles = args.role ? [args.role] : staffRoles;

    const users: any[] = [];
    for (const r of targetRoles) {
      const roleUsers = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", r))
        .collect();
      users.push(...roleUsers);
    }

    const filtered = args.subRole ? users.filter((u) => u.subRole === args.subRole) : users;

    return filtered.map((u) => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      subRole: u.subRole,
      imageUrl: u.imageUrl,
    }));
  },
}); 