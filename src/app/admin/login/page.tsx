"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "12345";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (!password || password !== ADMIN_PASSWORD) {
      setError(true);
      return;
    }

    localStorage.setItem("admin_auth", "1");
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
        <div className="w-full rounded-3xl border-2 border-black bg-white/50 p-6">
          <div className="font-old text-3xl font-bold">Вход админа</div>

          {error && (
            <div className="mt-4 rounded-2xl border-2 border-[#d63b2e] bg-[#d63b2e]/10 p-3 text-sm font-medium text-[#111111]">
              Неверный пароль.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
