"use client";

import { useState, useEffect } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  Search,
  Filter,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Users,
  TrendingUp,
  DollarSign,
  ChevronDown,
  X,
} from "lucide-react";

const PLATFORMS = [
  { id: "Instagram", name: "Instagram", icon: Instagram },
  { id: "TikTok", name: "TikTok", icon: Users },
  { id: "YouTube", name: "YouTube", icon: Youtube },
  { id: "Twitter", name: "X (Twitter)", icon: Twitter },
  { id: "Facebook", name: "Facebook", icon: Facebook },
];

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [
    selectedPlatform,
    selectedNiche,
    minPrice,
    maxPrice,
    minFollowers,
    maxFollowers,
    sortBy,
    searchTerm,
  ]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedPlatform) params.append("platform", selectedPlatform);
      if (selectedNiche) params.append("niche", selectedNiche);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (minFollowers) params.append("minFollowers", minFollowers);
      if (maxFollowers) params.append("maxFollowers", maxFollowers);
      if (sortBy) params.append("sortBy", sortBy);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/marketplace/listings?${params}`);
      if (!response.ok) throw new Error("Failed to fetch listings");

      const data = await response.json();
      setListings(data.listings || []);
      setNiches(data.niches || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPlatform("");
    setSelectedNiche("");
    setMinPrice("");
    setMaxPrice("");
    setMinFollowers("");
    setMaxFollowers("");
    setSortBy("created_at");
  };

  const getPlatformIcon = (platform) => {
    const platformData = PLATFORMS.find((p) => p.id === platform);
    if (!platformData) return Users;
    return platformData.icon;
  };

  const activeFiltersCount = [
    selectedPlatform,
    selectedNiche,
    minPrice,
    maxPrice,
    minFollowers,
    maxFollowers,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <FalcusHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Social Media Marketplace
          </h1>
          <p className="text-xl text-purple-100 mb-8">
            Buy and sell verified social media accounts from creators and
            partners
          </p>

          {/* Main Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search accounts by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Filter size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="created_at">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="followers_count">Most Followers</option>
                <option value="engagement_rate">Highest Engagement</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Platforms</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche/Category
                </label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Niches</option>
                  {niches.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Followers Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Followers
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} />
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading
              ? "Loading..."
              : `${listings.length} listing${listings.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const Icon = getPlatformIcon(listing.platform);

              return (
                <div
                  key={listing.id}
                  onClick={() =>
                    (window.location.href = `/marketplace/${listing.id}`)
                  }
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg truncate">
                          {listing.account_name}
                        </h3>
                        <p className="text-sm text-purple-100">
                          {listing.platform}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Users size={12} />
                          Followers
                        </div>
                        <p className="font-bold text-gray-900">
                          {listing.followers_count.toLocaleString()}
                        </p>
                      </div>

                      {listing.engagement_rate && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <TrendingUp size={12} />
                            Engagement
                          </div>
                          <p className="font-bold text-gray-900">
                            {listing.engagement_rate}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Niche */}
                    {listing.niche && (
                      <div>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {listing.niche}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {listing.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price</span>
                        <div className="flex items-center gap-1 text-2xl font-bold text-purple-600">
                          <DollarSign size={20} />
                          {listing.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FalcusFooter />
    </div>
  );
}
