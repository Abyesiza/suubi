import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new patient registration for the assistance program
 */
export const createRegistration = mutation({
    args: {
        patientName: v.string(),
        patientAge: v.number(),
        patientGender: v.union(
            v.literal("male"),
            v.literal("female"),
            v.literal("other")
        ),
        location: v.string(),
        condition: v.string(),
        conditionDetails: v.string(),
        urgencyLevel: v.union(
            v.literal("low"),
            v.literal("medium"),
            v.literal("high"),
            v.literal("critical")
        ),
        contactName: v.string(),
        contactPhone: v.string(),
        contactEmail: v.string(),
        relationship: v.string(),
    },
    returns: v.id("patient_registrations"),
    handler: async (ctx, args) => {
        const registrationId = await ctx.db.insert("patient_registrations", {
            ...args,
            status: "pending",
            createdAt: Date.now(),
        });

        return registrationId;
    },
});

/**
 * Get all patient registrations (for admin)
 */
export const getRegistrations = query({
    args: {
        status: v.optional(v.union(
            v.literal("pending"),
            v.literal("reviewing"),
            v.literal("approved"),
            v.literal("rejected"),
            v.literal("completed")
        )),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            const registrations = await ctx.db
                .query("patient_registrations")
                .withIndex("by_status", (q) => q.eq("status", args.status!))
                .take(args.limit || 50);
            return registrations;
        } else {
            const registrations = await ctx.db
                .query("patient_registrations")
                .order("desc")
                .take(args.limit || 50);
            return registrations;
        }
    },
});

/**
 * Update registration status (for admin)
 */
export const updateRegistrationStatus = mutation({
    args: {
        registrationId: v.id("patient_registrations"),
        status: v.union(
            v.literal("pending"),
            v.literal("reviewing"),
            v.literal("approved"),
            v.literal("rejected"),
            v.literal("completed")
        ),
        reviewedById: v.optional(v.id("users")),
        reviewNotes: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await ctx.db.patch(args.registrationId, {
            status: args.status,
            reviewedById: args.reviewedById,
            reviewNotes: args.reviewNotes,
            updatedAt: Date.now(),
        });

        return null;
    },
});

/**
 * Get registration counts by status (for dashboard stats)
 */
export const getRegistrationStats = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("patient_registrations").collect();

        return {
            total: all.length,
            pending: all.filter(r => r.status === "pending").length,
            reviewing: all.filter(r => r.status === "reviewing").length,
            approved: all.filter(r => r.status === "approved").length,
            rejected: all.filter(r => r.status === "rejected").length,
            completed: all.filter(r => r.status === "completed").length,
        };
    },
});
