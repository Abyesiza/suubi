import { query } from "./_generated/server";

export const getLandingStats = query({
    args: {},
    handler: async (ctx) => {
        // 1. Count Doctors
        const doctors = await ctx.db
            .query("staff_profiles")
            .withIndex("by_role", q => q.eq("role", "doctor"))
            .collect();

        // 2. Count Active Programs
        const programs = await ctx.db
            .query("programs")
            .withIndex("by_approved", q => q.eq("approved", true))
            .collect();

        // 3. Count Users (Proxy for Patients)
        // optimizing by not fetching full documents if possible, but Convex collect() retrieves docs.
        // robust solution would be a separate counters table, but for MVP this is okay.
        const users = await ctx.db.query("users").collect();

        return {
            specialists: doctors.length,
            programs: programs.length,
            patients: 1500 + users.length, // Base count + registered users
            years: 5, // Static for now
        };
    }
});
