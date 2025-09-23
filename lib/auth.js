import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import CustomerSharings from "@/models/CustomerSharings";

export const authOptions = {
    // Use MongoDB adapter for better session handling
    adapter: MongoDBAdapter(clientPromise),
    
    // Set a realistic session max age
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 day
    },
    
    // Your providers config
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }
                
                try {
                    // Connect to database
                    await dbConnect();
                    
                    // Find user by email
                    const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
                    
                    if (!user) {
                        throw new Error("Invalid email or password");
                    }
                    
                    // Check password
                    const isValid = await compare(credentials.password, user.password);
                    
                    if (!isValid) {
                        throw new Error("Invalid email or password");
                    }
                    
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        isAdmin: user.isAdmin || false,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
    ],
    
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.isAdmin = user.isAdmin || false;
                
                // If not admin, get accessible customers
                if (!user.isAdmin) {
                    try {
                        await dbConnect();
                        const customerSharings = await CustomerSharings.find({ 
                            email: user.email 
                        }).lean();
                        
                        token.accessibleCustomers = customerSharings.map(sharing => 
                            sharing.customer.toString()
                        );
                    } catch (error) {
                        console.error("Error fetching accessible customers:", error);
                        token.accessibleCustomers = [];
                    }
                }
            }
            
            return token;
        },
        
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isAdmin = token.isAdmin;
                session.user.accessibleCustomers = token.accessibleCustomers;
            }
            
            return session;
        },
    },
    
    pages: {
        signIn: "/login",
        error: "/login",
    },
    
    // Proper cookie configuration
    // cookies: {
    //     sessionToken: {
    //         name: `next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: process.env.NODE_ENV === 'production',
    //         },
    //     },
    // },
    
    debug: process.env.NODE_ENV === 'development',
};