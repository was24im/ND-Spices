"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  MapPin,
  Lock,
  Package,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Save,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AddressType {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "security" | "orders">("profile");

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Address state
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "Karnataka",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setProfileName(session.user.name || "");
      fetchProfileData();
    }
  }, [session]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data?.user) {
        setProfileName(data.user.name || "");
        setProfilePhone(data.user.phone || "");
        setAddresses(data.user.addresses || []);
      }
    } catch (e) {
      console.error("Failed to load profile:", e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileSuccess("Profile details updated successfully!");
        setTimeout(() => setProfileSuccess(null), 3000);
      }
    } catch (e) {
      console.error("Error updating profile:", e);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressFormData),
      });
      const data = await res.json();
      if (res.ok && data?.address) {
        setAddresses((prev) => [data.address, ...prev.map((a) => (data.address.isDefault ? { ...a, isDefault: false } : a))]);
        setShowAddressForm(false);
        setAddressFormData({
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "Karnataka",
          postalCode: "",
          country: "India",
          isDefault: false,
        });
      }
    } catch (e) {
      console.error("Error adding address:", e);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/user/address?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error("Error deleting address:", e);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
      } else {
        setPasswordSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(null), 3000);
      }
    } catch (e) {
      setPasswordError("An unexpected error occurred");
    }
  };

  if (status === "loading") {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-spice-muted">Loading account...</div>;
  }

  const role = (session?.user as any)?.role || "USER";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Profile Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-cinnamon-500 via-primary to-secondary p-6 sm:p-8 text-white shadow-spice-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-serif font-bold text-2xl border border-white/30">
            {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold">
                {session?.user?.name || "Spice Guild Member"}
              </h1>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
                🌿 Member
              </span>
            </div>
            <p className="text-xs text-cream-200 mt-0.5">{session?.user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs & Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Nav Pills */}
        <div className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
              activeTab === "profile"
                ? "bg-primary text-white shadow-spice-sm"
                : "bg-white border border-cream-300 text-spice-dark hover:bg-cream-200"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Personal Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
              activeTab === "addresses"
                ? "bg-primary text-white shadow-spice-sm"
                : "bg-white border border-cream-300 text-spice-dark hover:bg-cream-200"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Delivery Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-spice-sm"
                : "bg-white border border-cream-300 text-spice-dark hover:bg-cream-200"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
              activeTab === "security"
                ? "bg-primary text-white shadow-spice-sm"
                : "bg-white border border-cream-300 text-spice-dark hover:bg-cream-200"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Password & Security</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          {/* 1. Profile Tab */}
          {activeTab === "profile" && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
              <div className="border-b border-cream-200 pb-4">
                <h2 className="font-serif text-lg font-bold text-spice-dark">Personal Information</h2>
                <p className="text-xs text-spice-muted">Manage your personal profile details.</p>
              </div>

              {profileSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-secondary-50 border border-secondary-200 p-3 text-xs text-secondary-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={session?.user?.email || ""}
                    className="w-full rounded-xl border border-cream-200 bg-cream-100 px-3.5 py-2 text-xs sm:text-sm text-spice-muted cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-600 shadow-spice-sm transition-all"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{profileLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              </form>
            </div>
          )}

          {/* 2. Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
              <div className="flex items-center justify-between border-b border-cream-200 pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-spice-dark">Saved Delivery Addresses</h2>
                  <p className="text-xs text-spice-muted">Manage shipping locations for express spice deliveries.</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-600 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add address collapsible form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="rounded-2xl border border-cream-300 bg-cream-100 p-5 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-spice-dark">New Address Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Recipient Name"
                        value={addressFormData.fullName}
                        onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                        className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs text-spice-dark"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={addressFormData.phone}
                        onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                        className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs text-spice-dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Street Address, Flat / House No."
                        value={addressFormData.street}
                        onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                        className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs text-spice-dark"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={addressFormData.city}
                        onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                        className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs text-spice-dark"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="PIN Code"
                        value={addressFormData.postalCode}
                        onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                        className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs text-spice-dark"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-spice-dark cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addressFormData.isDefault}
                        onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span>Set as default delivery address</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-3 py-1.5 text-xs text-spice-muted hover:text-spice-dark"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-600 shadow-sm"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="text-center py-10 text-xs text-spice-muted">
                  No delivery addresses saved yet. Click "Add New Address" above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`rounded-2xl border p-4 relative space-y-2 ${
                        addr.isDefault ? "border-primary bg-primary-50/40 shadow-xs" : "border-cream-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-spice-dark">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-spice-muted leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-xs text-spice-muted font-medium">📞 {addr.phone}</p>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-spice-muted hover:text-cinnamon-500 p-1 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Orders Tab */}
          {activeTab === "orders" && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
              <div className="border-b border-cream-200 pb-4">
                <h2 className="font-serif text-lg font-bold text-spice-dark">Order History</h2>
                <p className="text-xs text-spice-muted">Track status of your single-origin spice dispatches.</p>
              </div>

              <div className="rounded-2xl border border-cream-200 bg-cream-100 p-8 text-center space-y-3">
                <Package className="h-10 w-10 text-primary-400 mx-auto" />
                <h3 className="font-serif text-base font-bold text-spice-dark">No recent orders yet</h3>
                <p className="text-xs text-spice-muted max-w-sm mx-auto">
                  Explore our farm-to-table harvests from Idukki and Kashmir and place your first order.
                </p>
                <Link
                  href="/products"
                  className="inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-600 shadow-sm"
                >
                  Browse Spices
                </Link>
              </div>
            </div>
          )}

          {/* 4. Security Tab */}
          {activeTab === "security" && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
              <div className="border-b border-cream-200 pb-4">
                <h2 className="font-serif text-lg font-bold text-spice-dark">Security & Password</h2>
                <p className="text-xs text-spice-muted">Update your account password with bcrypt salt encryption.</p>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-secondary-50 border border-secondary-200 p-3 text-xs text-secondary-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-600 shadow-spice-sm"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
