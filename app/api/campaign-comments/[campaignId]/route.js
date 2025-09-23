import { dbConnect } from "@/lib/dbConnect";
import CampaignComment from "@/models/CampaignComment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    const { campaignId } = await params;
    if (!campaignId) {
        return new Response(JSON.stringify({ error: "Missing campaignId" }), { status: 400 });
    }
    if (!mongoose.isValidObjectId(campaignId)) {
        return new Response(JSON.stringify({ error: "Invalid campaignId" }), { status: 400 });
    }

    try {
        await dbConnect();

        const comments = await CampaignComment.find({ campaignId }).sort({ createdAt: 1 });

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error?.message || error, error?.stack);
        return new Response(
            JSON.stringify({ error: "Failed to fetch comments" }),
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    const { campaignId } = await params;
    if (!campaignId) {
        return new Response(JSON.stringify({ error: "Missing campaignId" }), { status: 400 });
    }
    if (!mongoose.isValidObjectId(campaignId)) {
        return new Response(JSON.stringify({ error: "Invalid campaignId" }), { status: 400 });
    }

    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }

        const body = await req.json();

        if (!body.content || body.content.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Comment content is required" }),
                { status: 400 }
            );
        }

        const comment = new CampaignComment({
            campaignId,
            content: body.content.trim(),
            userId: session.user.id,
            userName: session.user.name,
            userRole: session.user.isAdmin ? "admin" : "user"
        });

        await comment.save();

        return new Response(
            JSON.stringify({
                message: "Comment added successfully",
                comment
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating comment:", error?.message || error, error?.stack);
        return new Response(
            JSON.stringify({ error: "Failed to add comment" }),
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const { campaignId } = await params;
    if (!campaignId) {
        return new Response(JSON.stringify({ error: "Missing campaignId" }), { status: 400 });
    }
    if (!mongoose.isValidObjectId(campaignId)) {
        return new Response(JSON.stringify({ error: "Invalid campaignId" }), { status: 400 });
    }

    const url = new URL(req.url);
    const commentId = url.searchParams.get('id');
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        return new Response(JSON.stringify({ error: "Missing or invalid comment id" }), { status: 400 });
    }

    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }

        const body = await req.json();

        if (!body.content || body.content.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Comment content is required" }),
                { status: 400 }
            );
        }

        const comment = await CampaignComment.findById(commentId);

        if (!comment) {
            return new Response(
                JSON.stringify({ error: "Comment not found" }),
                { status: 404 }
            );
        }

        const isOwner = comment.userId?.toString() === session.user.id;
        const isAdmin = !!session.user?.isAdmin;

        if (!isOwner && !isAdmin) {
            return new Response(
                JSON.stringify({ error: "Not authorized to edit this comment" }),
                { status: 403 }
            );
        }

        comment.content = body.content.trim();
        comment.updatedAt = new Date();
        comment.isEdited = true;

        await comment.save();

        return new Response(
            JSON.stringify({
                message: "Comment updated successfully",
                comment
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating comment:", error?.message || error, error?.stack);
        return new Response(
            JSON.stringify({ error: "Failed to update comment" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const { campaignId } = await params;
    if (!campaignId) {
        return new Response(JSON.stringify({ error: "Missing campaignId" }), { status: 400 });
    }
    if (!mongoose.isValidObjectId(campaignId)) {
        return new Response(JSON.stringify({ error: "Invalid campaignId" }), { status: 400 });
    }

    const url = new URL(req.url);
    const commentId = url.searchParams.get('id');
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        return new Response(JSON.stringify({ error: "Missing or invalid comment id" }), { status: 400 });
    }

    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }

        const comment = await CampaignComment.findById(commentId);

        if (!comment) {
            return new Response(
                JSON.stringify({ error: "Comment not found" }),
                { status: 404 }
            );
        }

        const isOwner = comment.userId?.toString() === session.user.id;
        const isAdmin = !!session.user?.isAdmin;

        if (!isOwner && !isAdmin) {
            return new Response(
                JSON.stringify({ error: "Not authorized to delete this comment" }),
                { status: 403 }
            );
        }

        await CampaignComment.findByIdAndDelete(commentId);

        return new Response(
            JSON.stringify({ message: "Comment deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error?.message || error, error?.stack);
        return new Response(
            JSON.stringify({ error: "Failed to delete comment" }),
            { status: 500 }
        );
    }
}