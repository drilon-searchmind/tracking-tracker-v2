"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/contexts/ToastContext";
import { format } from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function CommentSection({ campaignId }) {
    const { data: session } = useSession();
    const { showToast } = useToast();
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/campaign-comments/${campaignId}`);
            
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            } else {
                throw new Error("Failed to fetch comments");
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            showToast("Error loading comments", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (campaignId) {
            fetchComments();
        }
    }, [campaignId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!session) {
            showToast("You must be logged in to comment", "error");
            return;
        }
        
        if (!newComment.trim()) {
            showToast("Comment cannot be empty", "error");
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            const response = await fetch(`/api/campaign-comments/${campaignId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newComment }),
            });
            
            if (response.ok) {
                const data = await response.json();
                setComments([...comments, data.comment]);
                setNewComment("");
                showToast("Comment added successfully", "success");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            showToast(error.message || "Error adding comment", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (comment) => {
        setEditingCommentId(comment._id);
        setEditedContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditedContent("");
    };

    const submitEdit = async (commentId) => {
        if (!editedContent.trim()) {
            showToast("Comment cannot be empty", "error");
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            const response = await fetch(`/api/campaign-comments/${campaignId}?id=${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: editedContent }),
            });
            
            if (response.ok) {
                const data = await response.json();
                setComments(comments.map(c => 
                    c._id === commentId ? data.comment : c
                ));
                cancelEdit();
                showToast("Comment updated successfully", "success");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update comment");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            showToast(error.message || "Error updating comment", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) {
            return;
        }
        
        try {
            const response = await fetch(`/api/campaign-comments/${campaignId}?id=${commentId}`, {
                method: "DELETE",
            });
            
            if (response.ok) {
                setComments(comments.filter(c => c._id !== commentId));
                showToast("Comment deleted successfully", "success");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            showToast(error.message || "Error deleting comment", "error");
        }
    };

    const formatDateTime = (dateString) => {
        return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    };

    return (
        <div className="space-y-6">
            <h4 className="font-medium text-lg text-gray-700">Comments</h4>
            
            {session && (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="mb-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="border border-gray-300 px-4 py-2 rounded w-full text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E]"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4 text-center italic">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-medium text-[#1C398E]">{comment.userName}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDateTime(comment.createdAt)}
                                        {comment.isEdited && <span className="ml-2 italic">(edited)</span>}
                                    </p>
                                </div>
                                
                                {session && (session.user.id === comment.userId || session.user.role === "admin") && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(comment)}
                                            className="text-gray-500 hover:text-[#1C398E]"
                                            title="Edit comment"
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="text-gray-500 hover:text-red-600"
                                            title="Delete comment"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {editingCommentId === comment._id ? (
                                <div className="mt-2">
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E]"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex justify-end mt-2 space-x-2">
                                        <button
                                            onClick={cancelEdit}
                                            className="px-3 py-1 border border-gray-300 rounded text-gray-600 text-xs hover:bg-gray-50"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => submitEdit(comment._id)}
                                            className="px-3 py-1 bg-zinc-700 text-white rounded text-xs hover:bg-zinc-800"
                                            disabled={isSubmitting || !editedContent.trim()}
                                        >
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-800 mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}