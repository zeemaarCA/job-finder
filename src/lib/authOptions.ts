import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@lib/db";


interface GoogleProfile {
	email_verified: boolean;
	picture: string;
	name?: string;
	email?: string;
}


export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	adapter: PrismaAdapter(db),
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
      console.log('Account:', account);
      console.log('Profile:', profile);

      if (account?.provider === "google" && profile?.email) {
        const googleProfile = profile as GoogleProfile;
        try {
          let user = await db.user.findUnique({
            where: { email: profile.email },
          });

          if (!user) {
            const username = googleProfile.name
              ? googleProfile.name.replace(/\s+/g, "").toLowerCase() +
                Math.random().toString(9).slice(-4)
              : "user" + Math.random().toString(9).slice(-4);

            user = await db.user.create({
              data: {
                email: googleProfile.email,
                name: googleProfile.name ?? null,
                image: googleProfile.picture ?? null,
                username: username,
                emailVerified: googleProfile.email_verified
              },
            });
          }

          const existingAccount = await db.account.findFirst({
            where: { userId: user.id, provider: "google" },
          });

          if (!existingAccount) {
            await db.account.create({
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

          return true;
        } catch (error) {
          console.error('Sign-in error:', error);
          return false;
        }
      }

      return false;
    }

	},
};