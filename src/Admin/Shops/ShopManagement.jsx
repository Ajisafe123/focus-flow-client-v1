import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Package,
    DollarSign,
    ShoppingCart,
    Tag,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    ArrowUpRight,
} from "lucide-react";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import StatCardGrid from "../Components/StatCardGrid";

const ShopManagement = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showProductModal, setShowProductModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const categories = [];

    const stats = [
        {
            icon: Package,
            title: "Total Products",
            value: "0",
        },
        {
            icon: DollarSign,
            title: "Total Revenue",
            value: "$0",
        },
        {
            icon: ShoppingCart,
            title: "Orders",
            value: "0",
        },
        {
            icon: Eye,
            title: "Total Views",
            value: "0",
        },
    ];

    return (
        <div className="min-h-screen space-y-6 max-w-10xl mx-auto">
            <PageHeader
                title="Shop Management"
                subtitle="Manage products, inventory, and orders"
            >
                <ModalButton
                    onClick={() => setShowProductModal(true)}
                    label="Add Product"
                    size="md"
                />
                <button
                    onClick={() => {}}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold text-sm"
                >
                    <Tag className="w-4 h-4" />
                    Add Category
                </button>
            </PageHeader>

            <StatCardGrid stats={stats} />

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Product Catalog
                    </h3>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Products Table/Grid */}
                <div className="p-6">
                    <div className="text-center text-gray-500 py-12">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-semibold mb-2">No products yet</p>
                        <p className="text-sm">
                            Click "Add Product" to create your first product
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ShopManagement;
