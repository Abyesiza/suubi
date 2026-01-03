import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Submit a new contact inquiry
 */
export const submitInquiry = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
    },
    returns: v.id("contact_inquiries"),
    handler: async (ctx, args) => {
        const inquiryId = await ctx.db.insert("contact_inquiries", {
            ...args,
            status: "new",
            createdAt: Date.now(),
        });

        return inquiryId;
    },
});

/**
 * Get all inquiries (admin only)
 */
export const getInquiries = query({
    args: {
        status: v.optional(v.union(
            v.literal("new"),
            v.literal("read"),
            v.literal("replied"),
            v.literal("archived")
        )),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // In a real app, we would check for admin authentication here

        if (args.status) {
            return await ctx.db
                .query("contact_inquiries")
                .withIndex("by_status", (q) => q.eq("status", args.status!))
                .take(args.limit || 50);
        }

        return await ctx.db
            .query("contact_inquiries")
            .order("desc")
            .take(args.limit || 50);
    },
});

/**
 * Mark an inquiry as read
 */
export const markAsRead = mutation({
    args: {
        id: v.id("contact_inquiries"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: "read",
            readAt: Date.now(),
        });
        return null;
    },
});
