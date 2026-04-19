import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminModerationPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_auth")?.value === "1";
  if (!authed) redirect("/admin/login");

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
