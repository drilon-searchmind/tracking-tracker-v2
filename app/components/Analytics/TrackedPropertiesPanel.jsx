"use client";

import { useEffect, useState } from "react";
import { GA4MockProps } from "@/lib/mock/GA4MockProps";

export default function TrackedPropertiesPanel() {
    const [propsList, setPropsList] = useState(GA4MockProps)
    const [selected, setSelected] = useState(GA4MockProps[0])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setPropsList(GA4MockProps)
        setIsLoading(false)
    }, [GA4MockProps])

    return (
        <div className="flex flex-col w-full h-full">
            <div className="mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Your Tracked Properties</h1>
                    <p>Welcome to your properties overview page.</p>
                </div>
            </div>

            <div className="flex mb-5">
                {propsList && (
                    <span className="flex gap-2 items-baseline">
                        <button className="btn btn-primary">Run tracker</button>
                        <p className="text-xs">Run the test tracker on all properties</p>
                    </span>
                )}
            </div>

            <div className="flex h-full w-full">
                <aside className="w-1/4 border-r overflow-y-auto">
                    <ul>
                        {propsList.map((p) => (
                            <li
                                key={p.streamId}
                                onClick={() => setSelected(p)}
                                className={
                                    "cursor-pointer p-3 hover:bg-base-200 " +
                                    (selected.streamId === p.streamId
                                        ? "bg-base-300 font-semibold"
                                        : "")
                                }
                            >
                                {p.propertyName}{" "}
                                {p.tracked.isTracked && (
                                    <span className="text-success ml-1">●</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className="flex-1 p-6 overflow-y-auto">
                    {selected ? (
                        <PropertyDetails prop={selected} />
                    ) : (
                        <p>Select a property from the left to see details.</p>
                    )}
                </section>
            </div>
        </div>
    )
}

function PropertyDetails({ prop }) {
    const t = prop.tracked;
    const m = t.ga4PropertyData || {};

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{prop.propertyName}</h2>

            <div className="space-y-2 mb-6">
                <p>
                    <strong>Stream:</strong> {prop.streamName}
                </p>
                <p>
                    <strong>Measurement ID:</strong> {prop.measurementId || "—"}
                </p>
                <p>
                    <strong>URL:</strong>{" "}
                    {prop.defaultUri ? (
                        <a
                            href={prop.defaultUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                        >
                            {prop.defaultUri}
                        </a>
                    ) : (
                        "—"
                    )}
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Last Tracking Run</h3>
                <p>
                    <strong>Tracked:</strong> {t.isTracked ? "Yes" : "No"}
                </p>
                <p>
                    <strong>Last Time:</strong>{" "}
                    {t.lastTimeTracked
                        ? new Date(t.lastTimeTracked).toLocaleString()
                        : "Never"}
                </p>
                <p>
                    <strong>GTM Found:</strong> {t.isGTMFound ? "Yes" : "No"}
                </p>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">GA4 Metrics Snapshot</h3>
                {t.ga4PropertyData ? (
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Active Users: {m.activeUsers}</li>
                        <li>Sessions: {m.sessions}</li>
                    </ul>
                ) : (
                    <p>No metrics yet. Click “Re‑Test” to fetch.</p>
                )}
                <button
                    className="btn btn-sm btn-secondary mt-4"
                    onClick={() => {
                        /* Future: call your track‑now endpoint */
                    }}
                >
                    Re‑Test Tracking
                </button>
            </div>
        </div>
    );
}