"use client";

import React from "react";
import BillingManager from "@/components/billing/BillingManager";

export default function SuperAdminBillingPage() {
  return (
    <BillingManager
      userRole="SUPER_ADMIN"
      portalTitle="Enterprise Billing &amp; B2B Tax Invoicing Hub"
    />
  );
}
