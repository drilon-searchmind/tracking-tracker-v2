import { dbConnect } from "@/lib/dbConnect";
import CustomerSharings from "@/models/CustomerSharings";
import mongoose from "mongoose";

export async function hasCustomerAccess(userId, userEmail, isAdmin, customerId) {
    if (isAdmin) {
        return true;
    }

    try {
        await dbConnect();

        const sharing = await CustomerSharings.findOne({
            customer: customerId,
            email: userEmail
        });

        return !!sharing;
    } catch (error) {
        console.error("Error checking customer access:", error);
        return false;
    }
}