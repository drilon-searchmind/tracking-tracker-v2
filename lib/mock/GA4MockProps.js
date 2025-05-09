export const GA4MockProps = [
    {
        streamId: "1600198309",
        propertyName: "Merch Shop",
        streamName: "North America & Canada Website",
        measurementId: "G-123ABC",
        defaultUri: "https://merch.example.com",
        tracked: {
            isTracked: true,
            lastTimeTracked: "2025-04-18T12:30:00.000Z",
            isGTMFound: true,
            ga4PropertyData: {
                activeUsers: 42,
                sessions: 128,
            },
        },
    },
    {
        streamId: "9876543210",
        propertyName: "KYNETIC",
        streamName: "Global Web",
        measurementId: "G-XYZ789",
        defaultUri: "https://kynetic.dk",
        tracked: {
            isTracked: false,
            lastTimeTracked: null,
            isGTMFound: false,
            ga4PropertyData: null,
        },
    },
    // …add more mock entries as needed…
];