import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import SEOExactKeywordGroup from '@/models/SEOExactKeywordGroup';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        
        const { groupId } = params;
        const { name, keywords } = await request.json();
        
        if (!name || !keywords) {
            return NextResponse.json({ 
                error: 'Name and keywords are required' 
            }, { status: 400 });
        }
        
        if (!Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({ 
                error: 'Keywords must be a non-empty array' 
            }, { status: 400 });
        }
        
        const exactKeywordGroup = await SEOExactKeywordGroup.findByIdAndUpdate(
            groupId,
            {
                name: name.trim(),
                keywords: keywords.map(k => k.trim()).filter(k => k)
            },
            { new: true }
        );
        
        if (!exactKeywordGroup) {
            return NextResponse.json({ error: 'Exact keyword group not found' }, { status: 404 });
        }
        
        return NextResponse.json(exactKeywordGroup);
    } catch (error) {
        console.error('Error updating exact keyword group:', error);
        return NextResponse.json({ error: 'Failed to update exact keyword group' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        
        const { groupId } = params;
        
        const exactKeywordGroup = await SEOExactKeywordGroup.findByIdAndDelete(groupId);
        
        if (!exactKeywordGroup) {
            return NextResponse.json({ error: 'Exact keyword group not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Exact keyword group deleted successfully' });
    } catch (error) {
        console.error('Error deleting exact keyword group:', error);
        return NextResponse.json({ error: 'Failed to delete exact keyword group' }, { status: 500 });
    }
}