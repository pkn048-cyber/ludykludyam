"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";

export default function ContactsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">

      {/* Шапка */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#efeae2]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-old text-lg font-bold leading-tight text-[#1b1b1b]">
            Люди едут к людям
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-black/15 bg-white/50 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-old text-4xl font-bold text-black">Контакты</h1>
        <p className="mt-2 text-sm text-black/55">
          Мы отвечаем на все вопросы в течение 1–2 рабочих дней
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* Форма */}
          <div className="rounded-3xl border border-black/10 bg-white/60 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1b1b1b]">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="font-old text-xl font-semibold">Написать нам</div>
            </div>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-[#d63b2e]/20 bg-[#d63b2e]/5 p-6 text-center">
                <div className="font-old text-2xl font-bold text-[#d63b2e]">Отправлено!</div>
                <p className="mt-2 text-sm text-black/60">
                  Мы получили ваше сообщение и ответим на{" "}
                  <span className="font-medium">{email}</span> в течение 1–2 дней.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                  className="mt-4 rounded-2xl border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5"
                >
                  Написать ещё
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <div className="text-xs font-medium text-black/60">Ваше имя</div>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Иванов"
                      className="w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <div className="text-xs font-medium text-black/60">Электронная почта</div>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ivan@mail.ru"
                      className="w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <div className="text-xs font-medium text-black/60">Сообщение</div>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Вопрос, предложение или обратная связь"
                    className="min-h-[160px] w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d63b2e] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Send className="h-4 w-4" />
                  Отправить сообщение
                </button>
              </form>
            )}
          </div>

          {/* Правая колонка — контакты */}
          <div className="space-y-4">

            <div className="rounded-3xl border border-black/10 bg-white/60 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1b1b1b]">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="font-old text-xl font-semibold">Электронная почта</div>
              </div>
              <p className="mt-4 text-sm text-black/60">
                По всем вопросам — участие, жалобы, сотрудничество, верификация проектов:
              </p>
              <a
                href="mailto:pkn048@yandex.ru"
                className="mt-3 block font-medium text-[#d63b2e] underline underline-offset-4 transition hover:brightness-75"
              >
                pkn048@yandex.ru
              </a>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/60 p-6">
              <div className="font-old text-lg font-semibold">Когда писать</div>
              <ul className="mt-3 space-y-2 text-sm text-black/60">
                <li className="flex gap-2">
                  <span className="text-[#d63b2e]">✦</span>
                  Вопросы по участию в проекте
                </li>
                <li className="flex gap-2">
                  <span className="text-[#d63b2e]">✦</span>
                  Хотите разместить свой проект
                </li>
                <li className="flex gap-2">
                  <span className="text-[#d63b2e]">✦</span>
                  Жалоба на хоста или участника
                </li>
                <li className="flex gap-2">
                  <span className="text-[#d63b2e]">✦</span>
                  СМИ и сотрудничество
                </li>
                <li className="flex gap-2">
                  <span className="text-[#d63b2e]">✦</span>
                  Технические ошибки на сайте
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/60 p-5">
              <p className="text-sm text-black/55 leading-6">
                Платформа «Люди едут к людям» — некоммерческий проект. Придумано и
                разработано Портновой Ксенией.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
