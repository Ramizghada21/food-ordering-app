import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { User } from "../../../models/user";
import { UserInfo } from "../../../models/UserInfo";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        try {
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
          }

          let user = await User.findOne({ email: profile.email });

          if (!user) {
            // User doesn't exist, create a new one
            user = new User({
              name: profile.name,
              email: profile.email,
              googleId: profile.sub, // Store Google ID
              password: null, // No password for Google users
            });
            await user.save();
          } else if (!user.googleId) {
            // Update user with Google ID if not already present
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
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
          }

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
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if(!userEmail)
  {
    return false;
  }
  const userInfo = await UserInfo.findOne({email:userEmail});
  if(!userInfo)
  {
    return false;
  }
  return userInfo.admin;
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
