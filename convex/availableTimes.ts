import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a new available time slot
export const createAvailableTime = mutation({
  args: {
    staffProfileId: v.id("staff_profiles"),
    dayOfWeek: v.optional(v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    )),
    startTime: v.string(),
    endTime: v.string(),
    isRecurring: v.boolean(),
    isAvailable: v.optional(v.boolean()),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const newAvailableTime = {
      staffProfileId: args.staffProfileId,
      dayOfWeek: args.dayOfWeek,
      startTime: args.startTime,
      endTime: args.endTime,
      isRecurring: args.isRecurring,
      isAvailable: args.isAvailable ?? true,
      date: args.date,
      createdAt: Date.now(),
    };
    const availableTimeId = await ctx.db.insert("availableTimes", newAvailableTime);
    return availableTimeId;
  },
});

// Get available time slots for a user
export const getAvailableTimesByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // First get the staff profile for this user
    const staffProfile = await ctx.db
      .query("staff_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!staffProfile) {
      return [];
    }

    // Query by staffProfileId using the proper index
    return await ctx.db
      .query("availableTimes")
      .withIndex("by_staffProfileId", (q) => q.eq("staffProfileId", staffProfile._id))
      .collect();
  },
});

// Update an available time slot
export const updateAvailableTime = mutation({
  args: {
    availableTimeId: v.id("availableTimes"),
    dayOfWeek: v.optional(v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    )),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { availableTimeId, ...rest } = args;
    return await ctx.db.patch(availableTimeId, { ...rest, updatedAt: Date.now() });
  },
});

// Delete an available time slot
export const deleteAvailableTime = mutation({
  args: { availableTimeId: v.id("availableTimes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.availableTimeId);
  },
});

// Get available time slots by day of week for a user
export const getAvailableTimesByDayOfWeek = query({
  args: {
    userId: v.id("users"),
    dayOfWeek: v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    ),
  },
  handler: async (ctx, args) => {
    // First get the staff profile for this user
    const staffProfile = await ctx.db
      .query("staff_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!staffProfile) {
      return [];
    }

    // Query by staffProfileId using the proper composite index
    return await ctx.db
      .query("availableTimes")
      .withIndex("by_staffProfileId_dayOfWeek", (q) =>
        q.eq("staffProfileId", staffProfile._id).eq("dayOfWeek", args.dayOfWeek)
      )
      .collect();
  },
});

// Get available time slots by date for a user (for one-off slots)
export const getAvailableTimesByDateFixed = query({
  args: {
    userId: v.id("users"),
    date: v.number(),
  },
  returns: v.array(v.object({
    _id: v.id("availableTimes"),
    _creationTime: v.number(),
    staffProfileId: v.optional(v.id("staff_profiles")),
    userId: v.optional(v.id("users")),
    dayOfWeek: v.optional(v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    )),
    startTime: v.string(),
    endTime: v.string(),
    isRecurring: v.boolean(),
    date: v.optional(v.number()),
    isAvailable: v.optional(v.boolean()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    // First get the staff profile for this user
    const staffProfile = await ctx.db
      .query("staff_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!staffProfile) {
      return [];
    }

    // Query by staffProfileId using the proper composite index
    return await ctx.db
      .query("availableTimes")
      .withIndex("by_staffProfileId_date", (q) =>
        q.eq("staffProfileId", staffProfile._id).eq("date", args.date)
      )
      .collect();
  },
});

