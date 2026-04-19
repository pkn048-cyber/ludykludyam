import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "12345";

  if (!password || password !== expected) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/admin");
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
        <div className="w-full rounded-3xl border-2 border-black bg-white/50 p-6">
          <div className="font-old text-3xl font-bold">Вход админа</div>

          <form action={loginAction} className="mt-6 space-y-4">
            <label className="space-y-2">
              <div className="text-xs font-medium text-black/70">Пароль</div>
              <input
                name="password"
                type="password"
                className="w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#d63b2e]"
                placeholder="Введите пароль"
                autoFocus
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
