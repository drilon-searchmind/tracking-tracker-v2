import { dbConnect } from "@/lib/dbConnect";
import ParentCampaign from "@/models/ParentCampaign";
import Campaign from "@/models/Campaign";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        await dbConnect();

        const parentCampaigns = await ParentCampaign.find({ customerId })
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(parentCampaigns), { status: 200 });
    } catch (error) {
        console.error("::: Error fetching parent campaigns:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        await dbConnect();

        const body = await req.json();

        if (!body.parentCampaignName) {
            return new Response(
                JSON.stringify({ error: "Parent campaign name is required" }),
                { status: 400 }
            );
        }

        if (body.startDate) {
            body.startDate = new Date(body.startDate);
        }
        if (body.endDate) {
            body.endDate = new Date(body.endDate);
        }

        const parentCampaign = new ParentCampaign({
            customerId,
            parentCampaignName: body.parentCampaignName,
            service: body.service || [],
            countryCode: body.countryCode || "",
            campaignText: body.campaignText || "",
            campaignMessage: body.campaignMessage || "",
            campaignBrief: body.campaignBrief || "",
            startDate: body.startDate || null,
            endDate: body.endDate || null,
            b2bOrB2c: body.b2bOrB2c || "",
            budget: body.budget ? parseFloat(body.budget) : undefined,
            materialFromCustomer: body.materialFromCustomer || "",
            materialLinks: body.materialLinks || "",
            childCampaigns: []
        });

        await parentCampaign.save();

        const childCampaignIds = [];
        if (body.service && body.service.length > 0) {
            const childCampaignPromises = body.service.map(async (service) => {
                const childCampaign = new Campaign({
                    customerId,
                    service: service,
                    media: "Other", // Default value, can be updated later
                    campaignFormat: "Collection", // Default value, can be updated later
                    countryCode: body.countryCode || "",
                    startDate: body.startDate || null,
                    endDate: body.endDate || null,
                    campaignName: `${body.parentCampaignName}: ${service}`,
                    messageBrief: body.campaignBrief || "",
                    b2bOrB2c: body.b2bOrB2c || "B2B", // Default if not specified
                    budget: body.budget ? parseFloat(body.budget) / body.service.length : 0,
                    materialFromCustomer: body.materialFromCustomer || "",
                    parentCampaignId: parentCampaign._id,
                    campaignType: (!body.startDate && !body.endDate) ? "Always On" : "Conversion",
                    status: "Pending"
                });
                
                await childCampaign.save();
                
                childCampaignIds.push(childCampaign._id);
                
                return childCampaign;
            });
            
            const childCampaigns = await Promise.all(childCampaignPromises);
            
            await ParentCampaign.findByIdAndUpdate(
                parentCampaign._id,
                { $set: { childCampaigns: childCampaignIds } }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Parent campaign created successfully",
                parentCampaign,
                childCampaignCount: childCampaignIds.length,
                childCampaignIds
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("::: Error creating parent campaign:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const url = new URL(req.url);
    const parentCampaignId = url.searchParams.get('id');

    try {
        await dbConnect();

        const body = await req.json();

        if (body.startDate) {
            body.startDate = new Date(body.startDate);
        }
        if (body.endDate) {
            body.endDate = new Date(body.endDate);
        }

        const parentCampaign = await ParentCampaign.findOneAndUpdate(
            { _id: parentCampaignId, customerId },
            {
                ...body,
                budget: body.budget ? parseFloat(body.budget) : undefined,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!parentCampaign) {
            return new Response(
                JSON.stringify({ error: "Parent campaign not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Parent campaign updated successfully",
                parentCampaign
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("::: Error updating parent campaign:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const url = new URL(req.url);
    const parentCampaignId = url.searchParams.get('id');

    try {
        await dbConnect();

        const parentCampaign = await ParentCampaign.findOne({
            _id: parentCampaignId,
            customerId
        });

        if (!parentCampaign) {
            return new Response(
                JSON.stringify({ error: "Parent campaign not found" }),
                { status: 404 }
            );
        }

        if (parentCampaign.childCampaigns && parentCampaign.childCampaigns.length > 0) {
            await Campaign.deleteMany({
                _id: { $in: parentCampaign.childCampaigns }
            });
        }

        await ParentCampaign.deleteOne({ _id: parentCampaignId });

        return new Response(
            JSON.stringify({ 
                message: "Parent campaign and associated child campaigns deleted successfully" 
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("::: Error deleting parent campaign:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}