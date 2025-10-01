import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const resolvedParams = await params;
    const taskId = resolvedParams.taskId;

    try {
        const url = `https://api.clickup.com/api/v2/task/${taskId}`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': process.env.CLICKUP_API_TOKEN
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Failed to fetch task from Clickup: ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching from Clickup:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from Clickup' },
            { status: 500 }
        );
    }
}