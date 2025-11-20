import { queryBigQuerySEODashboardMetrics } from "@/lib/bigQueryConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { projectId, bigQueryCustomerId, startDate, endDate } = await request.json();
        
        if (!projectId || !bigQueryCustomerId || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const formatDateForBQ = (date) => new Date(date).toISOString().split('T')[0];
        
        const dashboardQuery = `
            SELECT
                CAST(date AS STRING) AS date,
                page,
                query,
                clicks,
                impressions,
                ctr,
                position
            FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.gsc_search_analytics_all_fields\`
            WHERE date IS NOT NULL 
                AND date >= '${formatDateForBQ(startDate)}'
                AND date <= '${formatDateForBQ(endDate)}'
                AND impressions > 0
            ORDER BY clicks DESC, impressions DESC
        `;

        const data = await queryBigQuerySEODashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
            cacheKey: `seo_all_data_${bigQueryCustomerId}_${formatDateForBQ(startDate)}_${formatDateForBQ(endDate)}`,
        });

        if (!data || data.length === 0) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        // Process raw data into the expected format
        const impressionsMap = new Map();
        const keywordsMap = new Map();
        const urlsMap = new Map();
        const keywordsByDateMap = new Map();
        const urlsByDateMap = new Map();

        // Process each row
        data.forEach(row => {
            const dateStr = row.date;
            const keyword = row.query;
            const url = row.page;
            const clicks = row.clicks || 0;
            const impressions = row.impressions || 0;
            const position = parseFloat(row.position) || 0;

            // Aggregate impressions by date
            if (!impressionsMap.has(dateStr)) {
                impressionsMap.set(dateStr, { clicks: 0, impressions: 0, positions: [], count: 0 });
            }
            const dateData = impressionsMap.get(dateStr);
            dateData.clicks += clicks;
            dateData.impressions += impressions;
            dateData.positions.push(position);
            dateData.count++;

            // Aggregate keywords
            if (keyword && keyword.length > 0) {
                if (!keywordsMap.has(keyword)) {
                    keywordsMap.set(keyword, { clicks: 0, impressions: 0, positions: [], count: 0 });
                }
                const keywordData = keywordsMap.get(keyword);
                keywordData.clicks += clicks;
                keywordData.impressions += impressions;
                keywordData.positions.push(position);
                keywordData.count++;

                // Keywords by date
                const keywordDateKey = `${dateStr}_${keyword}`;
                if (!keywordsByDateMap.has(keywordDateKey)) {
                    keywordsByDateMap.set(keywordDateKey, { 
                        date: dateStr, 
                        keyword, 
                        clicks: 0, 
                        impressions: 0, 
                        positions: [], 
                        count: 0 
                    });
                }
                const keywordByDate = keywordsByDateMap.get(keywordDateKey);
                keywordByDate.clicks += clicks;
                keywordByDate.impressions += impressions;
                keywordByDate.positions.push(position);
                keywordByDate.count++;
            }

            // Aggregate URLs
            if (url && url.length > 0) {
                if (!urlsMap.has(url)) {
                    urlsMap.set(url, { clicks: 0, impressions: 0, count: 0 });
                }
                const urlData = urlsMap.get(url);
                urlData.clicks += clicks;
                urlData.impressions += impressions;
                urlData.count++;

                // URLs by date
                const urlDateKey = `${dateStr}_${url}`;
                if (!urlsByDateMap.has(urlDateKey)) {
                    urlsByDateMap.set(urlDateKey, { 
                        date: dateStr, 
                        url, 
                        clicks: 0, 
                        impressions: 0, 
                        positions: [], 
                        count: 0 
                    });
                }
                const urlByDate = urlsByDateMap.get(urlDateKey);
                urlByDate.clicks += clicks;
                urlByDate.impressions += impressions;
                urlByDate.positions.push(position);
                urlByDate.count++;
            }
        });

        // Convert to final format
        const impressions_data = Array.from(impressionsMap.entries())
            .map(([date, data]) => ({
                date,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
                avg_position: data.positions.length > 0 ? 
                    data.positions.reduce((sum, pos) => sum + pos, 0) / data.positions.length : 0
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const top_keywords = Array.from(keywordsMap.entries())
            .map(([keyword, data]) => ({
                keyword,
                clicks: data.clicks,
                impressions: data.impressions,
                position: data.positions.length > 0 ? 
                    data.positions.reduce((sum, pos) => sum + pos, 0) / data.positions.length : 0
            }))
            .filter(item => item.impressions >= 10)
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 2000); // More data for all data fetch

        const top_urls = Array.from(urlsMap.entries())
            .map(([url, data]) => ({
                url,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0
            }))
            .filter(item => item.impressions >= 10)
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 1000); // More data for all data fetch

        const keywords_by_date = Array.from(keywordsByDateMap.values())
            .map(data => ({
                date: data.date,
                keyword: data.keyword,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
                avg_position: data.positions.length > 0 ? 
                    data.positions.reduce((sum, pos) => sum + pos, 0) / data.positions.length : 0
            }))
            .filter(item => item.impressions >= 5)
            .sort((a, b) => a.date.localeCompare(b.date) || b.clicks - a.clicks);

        const urls_by_date = Array.from(urlsByDateMap.values())
            .map(data => ({
                date: data.date,
                url: data.url,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
                avg_position: data.positions.length > 0 ? 
                    data.positions.reduce((sum, pos) => sum + pos, 0) / data.positions.length : 0
            }))
            .filter(item => item.impressions >= 5)
            .sort((a, b) => a.date.localeCompare(b.date) || b.clicks - a.clicks);

        // Pre-process data on server to reduce client-side computation
        const processedData = {
            impressions_data,
            top_keywords: top_keywords.slice(0, 500),
            top_urls: top_urls.slice(0, 200),
            urls_by_date,
            keywords_by_date,
            // Pre-calculate some metrics to reduce client load
            totalMetrics: impressions_data.reduce(
                (acc, row) => ({
                    clicks: acc.clicks + (row.clicks || 0),
                    impressions: acc.impressions + (row.impressions || 0),
                    avg_position: acc.avg_position + (row.avg_position || 0),
                    count: acc.count + 1,
                }),
                { clicks: 0, impressions: 0, avg_position: 0, count: 0 }
            ),
            isLimitedData: false,
            totalRows: data.length,
        };

        return NextResponse.json(processedData);
    } catch (error) {
        console.error("Error fetching all SEO data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}