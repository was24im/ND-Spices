"use client";

import React from "react";
import BillingManager from "@/components/billing/BillingManager";

export default function StaffBillingPage() {
  return (
    <BillingManager
      userRole="STAFF"
      portalTitle="Staff Commercial Invoicing &amp; Billing Records"
    />
  );
}
