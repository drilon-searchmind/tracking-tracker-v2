import { Suspense } from "react";

export default function WhatsNewLayout({ children }) {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </>
    );
}