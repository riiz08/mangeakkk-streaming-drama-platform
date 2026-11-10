import React from "react";
import { Metadata } from "next";
import { getAllContents } from "@/lib/data/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Console & Content Management — Mangeakkk",
  description: "Panel admin untuk mengelola database streaming drama dan film dengan Prisma dan Supabase.",
};

export default async function AdminPage() {
  const contents = await getAllContents();

  return <AdminDashboard initialContents={contents} />;
}
