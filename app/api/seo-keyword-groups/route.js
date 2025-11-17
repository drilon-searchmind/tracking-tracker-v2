import { dbConnect } from "@/lib/dbConnect";
import SEOKeywordGroup from "@/models/SEOKeywordGroup";

export async function GET(request) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');
        
        if (!customerId) {
            return Response.json({ error: "Customer ID is required" }, { status: 400 });
        }
        
        const groups = await SEOKeywordGroup.find({ 
            customer: customerId, 
            isActive: true 
        }).sort({ name: 1 });
        
        return Response.json(groups);
    } catch (error) {
        console.error("Error fetching SEO keyword groups:", error);
        return Response.json({ error: "Failed to fetch SEO keyword groups" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        
        const { name, keywords, customerId } = await request.json();
        
        if (!name || !keywords || !customerId) {
            return Response.json({ 
                error: "Name, keywords, and customer ID are required" 
            }, { status: 400 });
        }
        
        if (!Array.isArray(keywords) || keywords.length === 0) {
            return Response.json({ 
                error: "Keywords must be a non-empty array" 
            }, { status: 400 });
        }
        
        // Filter out empty keywords and trim them
        const cleanKeywords = keywords
            .filter(keyword => keyword && keyword.trim())
            .map(keyword => keyword.trim().toLowerCase());
        
        if (cleanKeywords.length === 0) {
            return Response.json({ 
                error: "At least one valid keyword is required" 
            }, { status: 400 });
        }
        
        const newGroup = new SEOKeywordGroup({
            name: name.trim(),
            keywords: cleanKeywords,
            customer: customerId
        });
        
        const savedGroup = await newGroup.save();
        
        return Response.json(savedGroup, { status: 201 });
    } catch (error) {
        console.error("Error creating SEO keyword group:", error);
        
        if (error.code === 11000) {
            return Response.json({ 
                error: "A group with this name already exists for this customer" 
            }, { status: 409 });
        }
        
        return Response.json({ error: "Failed to create SEO keyword group" }, { status: 500 });
    }
}