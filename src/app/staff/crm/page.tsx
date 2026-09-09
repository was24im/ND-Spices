"use client";

import React from "react";
import CrmLeadsManager from "@/components/crm/CrmLeadsManager";

export default function StaffCrmPage() {
  return (
    <CrmLeadsManager
      userRole="STAFF"
      portalTitle="Staff CRM &amp; Lead Inquiries"
    />
  );
}
