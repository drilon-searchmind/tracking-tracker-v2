import { google } from "googleapis";

function getAdminClient(token) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    return google.analyticsadmin({ version: "v1beta", auth });
}

export async function listAccounts(token) {
    const client = getAdminClient(token);
    const res = await client.accounts.list();

    return res.data.accounts || [];
}

export async function listProperties(token, accountName) {
    const client = getAdminClient(token);
    const res = await client.properties.list({
        filter: `parent:${accountName}`,
    });
    return res.data.properties || [];
}

export async function listWebDataStreams(token, propertyName) {
    const client = getAdminClient(token);
    const res = await client.properties.dataStreams.list({
        parent: propertyName,
    });
    return (res.data.dataStreams || []).filter(
        (stream) => stream.type === "WEB_DATA_STREAM"
    );
}