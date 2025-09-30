import { dbConnect } from "@/lib/dbConnect";
import Campaign from "@/models/Campaign";
import ParentCampaign from "@/models/ParentCampaign";

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

        let requiredFields = [
            'service', 'media', 'campaignFormat', 'countryCode',
            'campaignName', 'b2bOrB2c', 'budget'
        ];

        if (body.campaignType !== "Always On") {
            requiredFields = [...requiredFields, 'startDate', 'endDate'];
        }

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
            startDate: body.campaignType === "Always On" ? null : new Date(body.startDate),
            endDate: body.campaignType === "Always On" ? null : new Date(body.endDate),
            campaignName: body.campaignName,
            messageBrief: body.messageBrief || "",
            b2bOrB2c: body.b2bOrB2c,
            budget: parseFloat(body.budget),
            landingpage: body.landingpage || "",
            materialFromCustomer: body.materialFromCustomer || "",
            parentCampaignId: body.parentCampaignId || null,
            campaignType: body.campaignType || null,
            campaignDimensions: body.campaignDimensions || "",
            campaignVariation: body.campaignVariation || "",
            campaignTextToCreative: body.campaignTextToCreative || "",
            campaignTextToCreativeTranslation: body.campaignTextToCreativeTranslation || ""
        });

        await campaign.save();

        if (body.parentCampaignId) {
            await ParentCampaign.findByIdAndUpdate(
                body.parentCampaignId,
                { $push: { childCampaigns: campaign._id } }
            );
        }

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

        const existingCampaign = await Campaign.findById(campaignId);
        if (!existingCampaign) {
            return new Response(
                JSON.stringify({ error: "Campaign not found" }),
                { status: 404 }
            );
        }

        const oldParentId = existingCampaign.parentCampaignId ? existingCampaign.parentCampaignId.toString() : null;
        const newParentId = body.parentCampaignId || null;

        if (oldParentId !== newParentId) {
            if (oldParentId) {
                await ParentCampaign.findByIdAndUpdate(
                    oldParentId,
                    { $pull: { childCampaigns: campaignId } }
                );
            }

            if (newParentId) {
                await ParentCampaign.findByIdAndUpdate(
                    newParentId,
                    { $push: { childCampaigns: campaignId } }
                );
            }
        }

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

        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return new Response(
                JSON.stringify({ error: "Campaign not found" }),
                { status: 404 }
            );
        }

        if (campaign.parentCampaignId) {
            await ParentCampaign.findByIdAndUpdate(
                campaign.parentCampaignId,
                { $pull: { childCampaigns: campaignId } }
            );
        }

        await Campaign.deleteOne({ _id: campaignId, customerId });

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