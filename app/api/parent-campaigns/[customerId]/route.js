import { dbConnect } from "@/lib/dbConnect";
import ParentCampaign from "@/models/ParentCampaign";

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

        const parentCampaign = new ParentCampaign({
            customerId,
            parentCampaignName: body.parentCampaignName,
            materialLinks: body.materialLinks || "",
            childCampaigns: body.childCampaigns || []
        });

        await parentCampaign.save();

        return new Response(
            JSON.stringify({
                message: "Parent campaign created successfully",
                parentCampaign
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

        const parentCampaign = await ParentCampaign.findOneAndUpdate(
            { _id: parentCampaignId, customerId },
            {
                ...body,
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

        const parentCampaign = await ParentCampaign.findOneAndDelete({
            _id: parentCampaignId,
            customerId
        });

        if (!parentCampaign) {
            return new Response(
                JSON.stringify({ error: "Parent campaign not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Parent campaign deleted successfully" }),
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