import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        adminClient()
    ]
});

// Optionally, export specific methods
export const { signIn, signUp, useSession } = authClient;
