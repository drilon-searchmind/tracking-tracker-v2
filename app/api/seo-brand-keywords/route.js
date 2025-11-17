import { dbConnect } from "@/lib/dbConnect";
import SEOBrandKeyword from "@/models/SEOBrandKeyword";

export async function GET(request) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');
        
        if (!customerId) {
            return Response.json({ error: "Customer ID is required" }, { status: 400 });
        }
        
        const brandKeywords = await SEOBrandKeyword.findOne({ 
            customer: customerId, 
            isActive: true 
        });
        
        // Return empty keywords array if no brand keywords exist for this customer
        return Response.json({
            keywords: brandKeywords?.keywords || [],
            customerId: customerId,
            exists: !!brandKeywords
        });
    } catch (error) {
        console.error("Error fetching SEO brand keywords:", error);
        return Response.json({ error: "Failed to fetch SEO brand keywords" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        
        const { keywords, customerId } = await request.json();
        
        if (!customerId) {
            return Response.json({ 
                error: "Customer ID is required" 
            }, { status: 400 });
        }
        
        if (!Array.isArray(keywords)) {
            return Response.json({ 
                error: "Keywords must be an array" 
            }, { status: 400 });
        }
        
        // Filter out empty keywords and trim them
        const cleanKeywords = keywords
            .filter(keyword => keyword && keyword.trim())
            .map(keyword => keyword.trim().toLowerCase());
        
        // Find existing brand keywords or create new one
        let brandKeywordDoc = await SEOBrandKeyword.findOne({ 
            customer: customerId,
            isActive: true 
        });
        
        if (brandKeywordDoc) {
            // Update existing document
            brandKeywordDoc.keywords = cleanKeywords;
            brandKeywordDoc.updatedAt = new Date();
            await brandKeywordDoc.save();
        } else {
            // Create new document
            brandKeywordDoc = new SEOBrandKeyword({
                keywords: cleanKeywords,
                customer: customerId
            });
            await brandKeywordDoc.save();
        }
        
        return Response.json({
            keywords: brandKeywordDoc.keywords,
            customerId: customerId,
            message: "Brand keywords updated successfully"
        });
    } catch (error) {
        console.error("Error updating SEO brand keywords:", error);
        return Response.json({ error: "Failed to update SEO brand keywords" }, { status: 500 });
    }
}