import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
//import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User"; // Ensure exact case of file name
import UserInfo from "../../../models/UserInfo"; // Ensure exact case of file name

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        try {
          await dbConnect();
          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = new User({
              name: profile.name,
              email: profile.email,
              googleId: profile.sub,
              password: null,
            });
            await user.save();
          } else if (!user.googleId) {
            user.googleId = profile.sub;
            await user.save();
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Google authorization error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email });

          if (user && bcrypt.compareSync(password, user.password)) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
            };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

export async function isAdmin() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) return false;

    await dbConnect();
    const userInfo = await UserInfo.findOne({ email: userEmail });
    return userInfo?.admin || false;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
