interface GoogleProfile {
	email_verified: boolean;
	picture: string;
	name?: string;
	email?: string;
}

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "database",
	},
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.verified = user.emailVerified;
      }
      return session;
    },
		async signIn({ account, profile }) {
			if (account?.provider === "google" && profile?.email) {
				const googleProfile = profile as GoogleProfile;
				let user = await prisma.user.findUnique({
					where: { email: profile.email },
				});

				// Create a new user if one doesn't exist
				if (!user) {
					const username = googleProfile.name
						? googleProfile.name.replace(/\s+/g, "").toLowerCase() +
						  Math.random().toString(9).slice(-4)
						: "user" + Math.random().toString(9).slice(-4);

					user = await prisma.user.create({
						data: {
							email: googleProfile.email,
							name: googleProfile.name ?? null,
							image: googleProfile.picture ?? null, // Access picture safely now
							username: username,
							emailVerified: googleProfile.email_verified
						},
					});
				}

				// Ensure the account is created if it doesn't exist
				const existingAccount = await prisma.account.findFirst({
					where: { userId: user.id, provider: "google" },
				});

				if (!existingAccount) {
					await prisma.account.create({
						data: {
							userId: user.id,
							type: account.type,
							provider: account.provider,
							providerAccountId: account.providerAccountId,
							access_token: account.access_token,
							expires_at: account.expires_at,
							token_type: account.token_type,
							scope: account.scope,
							id_token: account.id_token,
							session_state: account.session_state,
						},
					});
				}

				// Returning true will proceed with the sign-in process
				return true;
			}

			// Return false to block sign-in for non-Google providers or invalid profiles
			return false;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
