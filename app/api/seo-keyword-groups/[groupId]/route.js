import { dbConnect } from "@/lib/dbConnect";
import SEOKeywordGroup from "@/models/SEOKeywordGroup";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        
        const resolvedParams = await params;
        const groupId = resolvedParams.groupId;
        
        const group = await SEOKeywordGroup.findById(groupId);
        
        if (!group) {
            return Response.json({ error: "SEO keyword group not found" }, { status: 404 });
        }
        
        return Response.json(group);
    } catch (error) {
        console.error("Error fetching SEO keyword group:", error);
        return Response.json({ error: "Failed to fetch SEO keyword group" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        
        const resolvedParams = await params;
        const groupId = resolvedParams.groupId;
        const { name, keywords } = await request.json();
        
        if (!name || !keywords) {
            return Response.json({ 
                error: "Name and keywords are required" 
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
        
        const updatedGroup = await SEOKeywordGroup.findByIdAndUpdate(
            groupId,
            {
                name: name.trim(),
                keywords: cleanKeywords,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedGroup) {
            return Response.json({ error: "SEO keyword group not found" }, { status: 404 });
        }
        
        return Response.json(updatedGroup);
    } catch (error) {
        console.error("Error updating SEO keyword group:", error);
        
        if (error.code === 11000) {
            return Response.json({ 
                error: "A group with this name already exists for this customer" 
            }, { status: 409 });
        }
        
        return Response.json({ error: "Failed to update SEO keyword group" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        
        const resolvedParams = await params;
        const groupId = resolvedParams.groupId;
        
        const deletedGroup = await SEOKeywordGroup.findByIdAndUpdate(
            groupId,
            { isActive: false, updatedAt: new Date() },
            { new: true }
        );
        
        if (!deletedGroup) {
            return Response.json({ error: "SEO keyword group not found" }, { status: 404 });
        }
        
        return Response.json({ message: "SEO keyword group deleted successfully" });
    } catch (error) {
        console.error("Error deleting SEO keyword group:", error);
        return Response.json({ error: "Failed to delete SEO keyword group" }, { status: 500 });
    }
}