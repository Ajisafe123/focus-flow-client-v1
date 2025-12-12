import React, { useState } from "react";
import {
    Plus,
    Search,
    Heart,
    DollarSign,
    Users,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    ArrowUpRight,
} from "lucide-react";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import StatCardGrid from "../Components/StatCardGrid";

const DonationManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    const stats = [
        {
            icon: DollarSign,
            title: "Total Raised",
            value: "$0",
        },
        {
            icon: Heart,
            title: "Active Campaigns",
            value: "0",
        },
        {
            icon: Users,
            title: "Total Donors",
            value: "0",
        },
        {
            icon: TrendingUp,
            title: "This Month",
            value: "$0",
        },
    ];

    return (
        <div className="min-h-screen space-y-6 max-w-10xl mx-auto">
            <PageHeader
                title="Donation Management"
                subtitle="Manage donation campaigns and track contributions"
            >
                <ModalButton
                    onClick={() => setShowCampaignModal(true)}
                    label="New Campaign"
                    size="md"
                />
            </PageHeader>

            <StatCardGrid stats={stats} />

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                    <div className="text-center text-gray-500 py-12">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-semibold mb-2">No campaigns yet</p>
                        <p className="text-sm">
                            Click "New Campaign" to create your first donation campaign
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DonationManagement;
