import { FaChevronRight, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Image from "next/image";

export default function ProductTable({ 
    products, 
    productSearch, 
    setProductSearch, 
    sortBy, 
    setSortBy, 
    sortOrder, 
    setSortOrder,
    expandedProducts,
    toggleProductExpansion
}) {
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "desc" ? "asc" : "desc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return <FaSort className="ml-1" size={12} />;
        return sortOrder === "desc" ? <FaSortDown className="ml-1" size={12} /> : <FaSortUp className="ml-1" size={12} />;
    };

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Product Performance</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm pr-8 w-64 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                    </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[var(--color-natural)] border-b text-[var(--color-dark-green)] text-left sticky top-0">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Image</th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors"
                                    onClick={() => handleSort('product_name')}
                                >
                                    <div className="flex items-center">
                                        Product Name
                                        {getSortIcon('product_name')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors"
                                    onClick={() => handleSort('vendor')}
                                >
                                    <div className="flex items-center">
                                        Vendor
                                        {getSortIcon('vendor')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors"
                                    onClick={() => handleSort('product_type')}
                                >
                                    <div className="flex items-center">
                                        Type
                                        {getSortIcon('product_type')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors text-right"
                                    onClick={() => handleSort('total_quantity_sold')}
                                >
                                    <div className="flex items-center justify-end">
                                        Qty Sold
                                        {getSortIcon('total_quantity_sold')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors text-right"
                                    onClick={() => handleSort('total_revenue')}
                                >
                                    <div className="flex items-center justify-end">
                                        Revenue
                                        {getSortIcon('total_revenue')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors text-right"
                                    onClick={() => handleSort('avg_unit_price')}
                                >
                                    <div className="flex items-center justify-end">
                                        Avg Price
                                        {getSortIcon('avg_unit_price')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors text-right"
                                    onClick={() => handleSort('total_orders')}
                                >
                                    <div className="flex items-center justify-end">
                                        Orders
                                        {getSortIcon('total_orders')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[var(--color-light-natural)] transition-colors text-right"
                                    onClick={() => handleSort('total_inventory')}
                                >
                                    <div className="flex items-center justify-end">
                                        Inventory
                                        {getSortIcon('total_inventory')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <tr key={i} className="border-b border-[var(--color-light-natural)] hover:bg-[var(--color-natural)] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="w-12 h-12 relative">
                                            {product.featured_image_url ? (
                                                <Image
                                                    src={product.featured_image_url}
                                                    alt={product.product_name || 'Product'}
                                                    fill
                                                    className="rounded-md object-cover"
                                                    sizes="48px"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[var(--color-natural)] rounded-md flex items-center justify-center text-[var(--color-green)] text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="max-w-xs">
                                            <p className="font-medium text-[var(--color-dark-green)] truncate">
                                                {product.product_name || product.product_title || 'N/A'}
                                            </p>
                                            {product.handle && (
                                                <p className="text-xs text-[var(--color-green)] mt-1">
                                                    {product.handle}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)]">
                                        {product.vendor || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)]">
                                        {product.product_type || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)] text-right font-medium">
                                        {(product.total_quantity_sold || 0).toLocaleString('en-US')}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)] text-right font-medium">
                                        {Math.round(product.total_revenue || 0).toLocaleString('en-US')}
                                        {product.presentment_currency && (
                                            <span className="text-xs text-[var(--color-green)] ml-1">
                                                DKK
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)] text-right">
                                        {(product.avg_unit_price || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)] text-right">
                                        {(product.total_orders || 0).toLocaleString('en-US')}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-dark-green)] text-right">
                                        {(parseInt(product.total_inventory) || 0).toLocaleString('en-US')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            product.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.status || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="text-center py-8 text-[var(--color-green)]">
                            No products found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Product List */}
            <div className="md:hidden bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm">
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-natural)]">
                    <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">Product Performance</h3>
                </div>
                <div className="p-4 border-b border-[var(--color-light-natural)]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="border border-[var(--color-dark-natural)] w-full px-3 py-2 rounded-lg text-sm pr-8 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                    </div>
                </div>
                <div className="p-1">
                    {products.map((product, i) => (
                        <div key={i} className="border-b border-[var(--color-light-natural)] last:border-b-0">
                            <div
                                className="p-3 flex items-center justify-between hover:bg-[var(--color-natural)] transition-colors cursor-pointer"
                                onClick={() => toggleProductExpansion(i)}
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 relative flex-shrink-0">
                                        {product.featured_image_url ? (
                                            <Image
                                                src={product.featured_image_url}
                                                alt={product.product_name || 'Product'}
                                                fill
                                                className="rounded-md object-cover"
                                                sizes="40px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[var(--color-natural)] rounded-md flex items-center justify-center text-[var(--color-green)] text-xs">
                                                No
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-xs text-[var(--color-dark-green)] truncate">
                                            {product.product_name || product.product_title || 'N/A'}
                                        </p>
                                        <p className="text-xs text-[var(--color-green)] truncate">
                                            {product.vendor || 'N/A'} • {Math.round(product.total_revenue || 0).toLocaleString('en-US')}
                                        </p>
                                    </div>
                                </div>
                                <FaChevronRight
                                    className={`text-[var(--color-green)] transition-transform flex-shrink-0 ${expandedProducts[i] ? 'rotate-90' : ''}`}
                                    size={12}
                                />
                            </div>
                            {expandedProducts[i] && (
                                <div className="px-4 pb-3 grid grid-cols-2 gap-3 text-xs bg-[var(--color-natural)]">
                                    <div>
                                        <span className="text-[var(--color-green)] block font-medium">Qty Sold</span>
                                        <span className="font-semibold text-[var(--color-dark-green)]">
                                            {(product.total_quantity_sold || 0).toLocaleString('en-US')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-green)] block font-medium">Orders</span>
                                        <span className="font-semibold text-[var(--color-dark-green)]">
                                            {(product.total_orders || 0).toLocaleString('en-US')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-green)] block font-medium">Avg Price</span>
                                        <span className="font-semibold text-[var(--color-dark-green)]">
                                            {(product.avg_unit_price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-green)] block font-medium">Inventory</span>
                                        <span className="font-semibold text-[var(--color-dark-green)]">
                                            {(parseInt(product.total_inventory) || 0).toLocaleString('en-US')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-green)] block font-medium">Type</span>
                                        <span className="font-semibold text-[var(--color-dark-green)]">
                                            {product.product_type || 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-green)] block font-medium">Status</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                            product.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.status || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-center py-8 text-[var(--color-green)] text-sm">
                            No products found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}