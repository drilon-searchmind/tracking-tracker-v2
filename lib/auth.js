import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { dbConnect } from "./dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import CustomerSharings from "@/models/CustomerSharings";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    // Keep MongoDB adapter to persist sessions
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin || false,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.isAdmin = user.isAdmin || false;
                
                // If not admin, fetch and add accessible customers to token
                if (!user.isAdmin) {
                    try {
                        await dbConnect();
                        // Query the customer sharings collection to get all customers this user has access to
                        const customerSharings = await CustomerSharings.find({ 
                            email: user.email 
                        }).lean();
                        
                        // Extract just the customer IDs and store them in the token
                        token.accessibleCustomers = customerSharings.map(sharing => 
                            sharing.customer.toString()
                        );
                    } catch (error) {
                        console.error("Error fetching accessible customers:", error);
                        token.accessibleCustomers = [];
                    }
                }
            }

            if (trigger === 'update' && session) {
                if (session.user?.name) token.name = session.user.name;
                if (session.user?.email) token.email = session.user.email;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name; 
                session.user.email = token.email;
                session.user.isAdmin = token.isAdmin || false;
                // Also include the accessible customers in the session for client-side usage if needed
                if (!token.isAdmin) {
                    session.user.accessibleCustomers = token.accessibleCustomers || [];
                }
            }
            return session;
        },
    },
    events: {
        error: (error) => {
            console.error("NextAuth error:", error);
        }
    },  
    pages: {
        signIn: '/login', // Custom login page path
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            },
        },
    },
};