"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function AdminModerationPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "1") {
      setAuthed(true);
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <div className="font-old text-4xl font-bold">Модерация платформы</div>
          <div className="mt-2 text-sm leading-6 text-black/70">
            Закрытый кабинет администратора: все проекты, путешественники и их коммуникация на
            платформе
          </div>
        </div>
        <div className="mt-8">
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
