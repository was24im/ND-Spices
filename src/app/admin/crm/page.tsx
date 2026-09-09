"use client";

import React from "react";
import CrmLeadsManager from "@/components/crm/CrmLeadsManager";

export default function SuperAdminCrmPage() {
  return (
    <CrmLeadsManager
      userRole="SUPER_ADMIN"
      portalTitle="Enterprise CRM &amp; Lead Assignment Pipeline"
    />
  );
}
