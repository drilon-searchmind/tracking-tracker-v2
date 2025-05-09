import PropertyTable from "@/app/components/Analytics/PropertyTable"
import TrackedPropertiesPanel from "@/app/components/Analytics/TrackedPropertiesPanel"

export default function GA4PropertiesPage() {
    return (
        <section id="pageGA4PropertiesPage">
            <div className="flex justify-between w-full gap-4">
                <TrackedPropertiesPanel />
                <PropertyTable />
            </div>
        </section>
    )
}