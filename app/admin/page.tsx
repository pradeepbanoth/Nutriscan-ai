"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminStats from "@/components/admin/AdminStats";
import AdminIssues from "@/components/admin/AdminIssues";

type Stat = {
  label: string;
  value: string | number;
  note?: string;
};

type Issue = {
  title: string;
  detail: string;
  status?: string;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<Stat[]>([
    { label: "Total Users", value: "—" },
    { label: "Premium Users", value: "—" },
    { label: "Total Scans", value: "—" },
    { label: "Paid Payments", value: "—" },
  ]);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          window.location.href = "/auth";
          return;
        }

        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setAllowed(false);
          setLoading(false);
          return;
        }

        setAllowed(true);
        setStats(data.stats || []);
        setIssues(data.issues || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setAllowed(false);
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="font-bold text-gray-500">Checking admin access...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <div className="rounded-3xl bg-white border border-orange-100 p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-gray-900">Access denied</h1>
          <p className="mt-3 text-gray-500">
            This page is only available to PAUSTICA admin.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-black text-gray-900">PAUSTICA Admin</h1>

        <p className="mt-4 text-gray-500">
          Monitor users, payments, subscriptions, scans, and system health.
        </p>

        <div className="mt-10">
          <AdminStats stats={stats} />
          <AdminIssues issues={issues} />
        </div>
      </div>
    </main>
  );
}