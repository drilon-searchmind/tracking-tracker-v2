import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import SEOExactKeywordGroup from '@/models/SEOExactKeywordGroup';

export async function GET(request) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');
        
        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }
        
        const exactKeywordGroups = await SEOExactKeywordGroup.find({ customer: customerId })
            .sort({ createdAt: -1 });
        
        return NextResponse.json(exactKeywordGroups);
    } catch (error) {
        console.error('Error fetching exact keyword groups:', error);
        return NextResponse.json({ error: 'Failed to fetch exact keyword groups' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        
        const { name, keywords, customerId } = await request.json();
        
        if (!name || !keywords || !customerId) {
            return NextResponse.json({ 
                error: 'Name, keywords, and customer ID are required' 
            }, { status: 400 });
        }
        
        if (!Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({ 
                error: 'Keywords must be a non-empty array' 
            }, { status: 400 });
        }
        
        // Check if a group with the same name already exists for this customer
        const existingGroup = await SEOExactKeywordGroup.findOne({ 
            customer: customerId, 
            name: name.trim() 
        });
        
        if (existingGroup) {
            return NextResponse.json({ 
                error: 'An exact keyword group with this name already exists' 
            }, { status: 409 });
        }
        
        const exactKeywordGroup = new SEOExactKeywordGroup({
            name: name.trim(),
            keywords: keywords.map(k => k.trim()).filter(k => k),
            customer: customerId
        });
        
        await exactKeywordGroup.save();
        
        return NextResponse.json(exactKeywordGroup, { status: 201 });
    } catch (error) {
        console.error('Error creating exact keyword group:', error);
        return NextResponse.json({ error: 'Failed to create exact keyword group' }, { status: 500 });
    }
}