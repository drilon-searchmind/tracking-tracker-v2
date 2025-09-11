import { dbConnect } from "@/lib/dbConnect";
import Campaign from "@/models/Campaign";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    console.log("::: Fetching campaigns for customer ID:", customerId);

    try {
        await dbConnect();

        const campaigns = await Campaign.find({ customerId });

        return new Response(JSON.stringify(campaigns), { status: 200 });
    } catch (error) {
        console.error("::: Error fetching campaigns:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    console.log("::: Creating campaign for customer ID:", customerId);

    try {
        await dbConnect();

        const body = await req.json();

        const requiredFields = [
            'service', 'media', 'campaignFormat', 'countryCode',
            'startDate', 'endDate', 'campaignName', 'b2bOrB2c', 'budget'
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return new Response(
                    JSON.stringify({ error: `${field} is required` }),
                    { status: 400 }
                );
            }
        }

        const campaign = new Campaign({
            customerId,
            service: body.service,
            media: body.media,
            campaignFormat: body.campaignFormat,
            countryCode: body.countryCode,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            campaignName: body.campaignName,
            messageBrief: body.messageBrief || "",
            b2bOrB2c: body.b2bOrB2c,
            budget: parseFloat(body.budget),
            landingpage: body.landingpage || "",
            materialFromCustomer: body.materialFromCustomer || "",
        });

        await campaign.save();

        return new Response(
            JSON.stringify({
                message: "Campaign created successfully",
                campaign
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("::: Error creating campaign:", error);
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
    const campaignId = url.searchParams.get('id');

    console.log(`::: Updating campaign ${campaignId} for customer ID: ${customerId}`);

    try {
        await dbConnect();

        const body = await req.json();

        const campaign = await Campaign.findOneAndUpdate(
            { _id: campaignId, customerId },
            {
                ...body,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                budget: body.budget ? parseFloat(body.budget) : undefined,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!campaign) {
            return new Response(
                JSON.stringify({ error: "Campaign not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Campaign updated successfully", campaign }),
            { status: 200 }
        );
    } catch (error) {
        console.error("::: Error updating campaign:", error);
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
    const campaignId = url.searchParams.get('id');

    console.log(`::: Deleting campaign ${campaignId} for customer ID: ${customerId}`);

    try {
        await dbConnect();

        const campaign = await Campaign.findOneAndDelete({
            _id: campaignId,
            customerId
        });

        if (!campaign) {
            return new Response(
                JSON.stringify({ error: "Campaign not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Campaign deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("::: Error deleting campaign:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}