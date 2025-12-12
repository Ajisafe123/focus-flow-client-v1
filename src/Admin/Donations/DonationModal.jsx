import React, { useState } from "react";
import { X, Heart, DollarSign, Calendar, Check } from "lucide-react";

const DonationModal = ({ show, onClose, onSave, campaign = null }) => {
    const isEdit = !!campaign;

    const [formData, setFormData] = useState({
        title: campaign?.title || "",
        description: campaign?.description || "",
        goal: campaign?.goal || "",
        startDate: campaign?.startDate || "",
        endDate: campaign?.endDate || "",
        category: campaign?.category || "",
        image: campaign?.image || null,
    });

    const [isLoading, setIsLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: Add your API call here
        setTimeout(() => {
            setIsLoading(false);
            onSave(formData);
            onClose();
        }, 1000);
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white p-6 rounded-t-2xl sticky top-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {isEdit ? "Edit Campaign" : "Create New Campaign"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Campaign Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Campaign Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                            placeholder="e.g., Ramadan Food Drive 2025"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none transition-all"
                            placeholder="Describe the campaign purpose and goals..."
                        />
                    </div>

                    {/* Goal Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            Fundraising Goal *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={formData.goal}
                            onChange={(e) => handleChange("goal", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                End Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={(e) => handleChange("endDate", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Campaign Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm transition-all"
                        >
                            <option value="">Select Category</option>
                            <option value="emergency">Emergency Relief</option>
                            <option value="education">Education</option>
                            <option value="construction">Mosque Construction</option>
                            <option value="welfare">Community Welfare</option>
                            <option value="orphans">Orphan Support</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Campaign Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleChange("image", e.target.files[0])}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 sticky bottom-0 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-70 hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                {isEdit ? "Update Campaign" : "Create Campaign"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
