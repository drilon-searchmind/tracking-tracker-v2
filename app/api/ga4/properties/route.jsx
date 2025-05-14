import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listProperties, listAccounts, listWebDataStreams } from "@/lib/googleApi";

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const token = session.user.accessToken

    // *** Fetch accounts > properties > streams
    const accounts = await listAccounts(token)
    const flattened = []

    for (const acct of accounts) {
        const accountId = acct.name.split("/")[1]
        const accountName = acct.displayName;

        const properties = await listProperties(token, acct.name);

        for (const prop of properties) {
            const propertyId = prop.name.split("/")[1];
            const propertyName = prop.displayName;

            const streams = await listWebDataStreams(token, prop.name);

            for (const stream of streams) {
                flattened.push({
                    accountId,
                    accountName,
                    propertyId,
                    propertyName,
                    streamId: stream.name.split("/").pop(),
                    streamName: stream.displayName,
                    measurementId: stream.webStreamData.measurementId || null,
                    defaultUri: stream.webStreamData.defaultUri || null,
                    createTime: stream.createTime,
                });
        }
    }
}

return NextResponse.json(flattened)
}