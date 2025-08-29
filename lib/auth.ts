import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin } from "better-auth/plugins";

const prisma = new PrismaClient();

const _auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin({}),
    ],
});

// Expose both api and admin for convenience
export const auth = {
    ..._auth,
    api: _auth.api,
    admin: (_auth as any).admin,
};