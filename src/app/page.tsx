"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Filter,
  Heart,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Building2,
  UserRound,
} from "lucide-react";
import { projects, type Month, type WorkType } from "@/data/projects";

const REGION_OPTIONS = [
  "all",
  "Адыгея",
  "Алтай",
  "Алтайский край",
  "Амурская область",
  "Архангельская область",
  "Астраханская область",
  "Башкортостан",
  "Белгородская область",
  "Брянская область",
  "Бурятия",
  "Владимирская область",
  "Волгоградская область",
  "Вологодская область",
  "Воронежская область",
  "Дагестан",
  "Еврейская автономная область",
  "Забайкальский край",
  "Ивановская область",
  "Ингушетия",
  "Иркутская область",
  "Кабардино-Балкария",
  "Калининградская область",
  "Калмыкия",
  "Калужская область",
  "Камчатский край",
  "Карачаево-Черкесия",
  "Карелия",
  "Кемеровская область",
  "Кировская область",
  "Коми",
  "Костромская область",
  "Краснодарский край",
  "Красноярский край",
  "Крым",
  "Курганская область",
  "Курская область",
  "Ленинградская область",
  "Липецкая область",
  "Магаданская область",
  "Марий Эл",
  "Мордовия",
  "Москва",
  "Московская область",
  "Мурманская область",
  "Ненецкий автономный округ",
  "Нижегородская область",
  "Новгородская область",
  "Новосибирская область",
  "Омская область",
  "Оренбургская область",
  "Орловская область",
  "Пензенская область",
  "Пермский край",
  "Приморский край",
  "Псковская область",
  "Ростовская область",
  "Рязанская область",
  "Самарская область",
  "Санкт-Петербург",
  "Саратовская область",
  "Саха (Якутия)",
  "Сахалинская область",
  "Свердловская область",
  "Севастополь",
  "Северная Осетия — Алания",
  "Смоленская область",
  "Ставропольский край",
  "Тамбовская область",
  "Татарстан",
  "Тверская область",
  "Томская область",
  "Тульская область",
  "Тыва",
  "Тюменская область",
  "Удмуртия",
  "Ульяновская область",
  "Хабаровский край",
  "Хакасия",
  "Ханты-Мансийский автономный округ — Югра",
  "Челябинская область",
  "Чечня",
  "Чувашия",
  "Чукотский автономный округ",
  "Ямало-Ненецкий автономный округ",
  "Ярославская область",
] as const;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white">
      {children}
    </span>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"traveler" | "host">(
    typeof window !== "undefined" &&
      window.sessionStorage.getItem("home_mode") === "host"
      ? "host"
      : "traveler"
  );

  function handleModeChange(nextMode: "traveler" | "host") {
    setMode(nextMode);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("home_mode", nextMode);
    }
  }

  // Traveler filters
  const monthOptions = useMemo(
    () =>
      [
        "all",
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ] as const,
    []
  );

  const peopleOptions = useMemo(() => ["1", "2", "3", "4"], []);

  const workTypeOptions: Array<"all" | WorkType> = useMemo(
    () => ["all", "Культура", "Заповедники", "Эко-проекты", "Домашние хлопоты"],
    []
  );

  const [region, setRegion] = useState<(typeof REGION_OPTIONS)[number]>("all");
  const [month, setMonth] = useState<(typeof monthOptions)[number]>("all");
  const [people, setPeople] = useState<string>("2");
  const [workType, setWorkType] = useState<(typeof workTypeOptions)[number]>("all");

  const filtered = useMemo(() => {
    const peopleN = Number(people) || 1;
    return projects.filter((h) => {
      const matchesRegion = region === "all" ? true : h.region === region;
      const matchesMonth = month === "all" ? true : h.months.includes(month);
      const matchesPeople = h.seats >= peopleN;
      const matchesWorkType = workType === "all" ? true : h.workTypes.includes(workType);
      return matchesRegion && matchesMonth && matchesPeople && matchesWorkType;
    });
  }, [month, people, region, workType]);
  // Host form draft
  const [draft, setDraft] = useState({
    title: "",
    region: "Карелия",
    periodMode: "Круглый год" as "Круглый год" | "По месяцам",
    months: [] as Month[],
    seats: 2,
    workTypes: [] as WorkType[],
    format: "",
    description: "",
    tasks: "Помощь по проекту, фото/видео, работа с гостями",
    photoUrl: "",
  });

  function toggleWorkType(t: WorkType) {
    setDraft((d) => {
      const exists = d.workTypes.includes(t);
      return {
        ...d,
        workTypes: exists ? d.workTypes.filter((x) => x !== t) : [...d.workTypes, t],
      };
    });
  }

  function toggleDraftMonth(monthValue: Month) {
    setDraft((d) => {
      const exists = d.months.includes(monthValue);
      return {
        ...d,
        months: exists
          ? d.months.filter((m) => m !== monthValue)
          : [...d.months, monthValue],
      };
    });
  }

  function onSubmitHost(e: React.FormEvent) {
    e.preventDefault();
    // Заглушка: без бэкенда просто фиксируем отправку
    alert("Заявка хоста отправлена (демо). Админ увидит её в закрытой зоне.");
    setDraft({
      title: "",
      region: "Карелия",
      periodMode: "Круглый год",
      months: [],
      seats: 2,
      workTypes: [],
      format: "",
      description: "",
      tasks: "Помощь по проекту, фото/видео, работа с гостями",
      photoUrl: "",
    });
  }

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">
      <section className="border-b border-black/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border-2 border-black/15 bg-white/35 px-4 py-1 text-sm font-medium">
              MVP-прототип • Люди едут к людям
            </div>

            <div className="lg:hidden">
              <Image
                src="/test_logo.svg"
                alt="Логотип проекта"
                width={220}
                height={220}
                className="h-auto w-[130px] sm:w-[160px]"
              />
            </div>

            <div className="space-y-4">
              <h1 className="font-old text-4xl font-bold leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
                ЛЮДИ ЕДУТ К ЛЮДЯМ
              </h1>
              <p className="max-w-2xl text-base leading-7 text-black/70 sm:text-lg">
                Россия богата людьми, и нам нужно ещё много узнать друг о друге
              </p>
            </div>

            <div className="relative">
              <div className="max-w-2xl space-y-2 lg:pr-[34rem]">
                <div className="font-old text-2xl font-semibold text-black">О чём проект?</div>
                <p className="leading-7 text-black/80">
                  Когда в мире бушуют страсти и кажется, что рядом не осталось хороших людей, важно
                  увидеть, что это не так и нам просто нужно быть к друг другу ближе.
                  <br />
                  Мы о путешествиях, волонтёрстве и уникальных историях. Место, где Россия
                  становится доступнее и роднее ❤️
                </p>
              </div>

              <div className="pointer-events-none hidden lg:block lg:absolute lg:right-0 lg:top-0">
                <Image
                  src="/test_logo.svg"
                  alt="Логотип проекта"
                  width={630}
                  height={630}
                  className="h-auto w-[390px] xl:w-[480px]"
                />
              </div>
            </div>

            <div className="grid gap-3 pt-1 md:grid-cols-2">
            <button
              type="button"
              onClick={() => handleModeChange("traveler")}
              className={`relative w-full overflow-hidden rounded-3xl border-2 p-5 text-left transition ${
                mode === "traveler"
                  ? "border-black bg-black text-white"
                  : "border-black bg-white/30 text-black hover:bg-white/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="font-old text-2xl font-semibold">Еду</div>
                  <div
                    className={`text-sm leading-6 ${
                      mode === "traveler" ? "text-white/80" : "text-black/70"
                    }`}
                  >
                    Путешественнику: фильтры, карточки проектов и безопасная коммуникация
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("host")}
              className={`relative w-full overflow-hidden rounded-3xl border-2 p-5 text-left transition ${
                mode === "host"
                  ? "border-black bg-black text-white"
                  : "border-black bg-white/30 text-black hover:bg-white/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Heart className="h-6 w-6 text-[#d63b2e]" />
                </div>
                <div className="space-y-1">
                  <div className="font-old text-2xl font-semibold">Приглашаю</div>
                  <div
                    className={`text-sm leading-6 ${
                      mode === "host" ? "text-white/80" : "text-black/70"
                    }`}
                  >
                    Хосту: отправка площадки, фото, условия и ручная проверка
                  </div>
                </div>
              </div>
            </button>
            </div>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {mode === "traveler" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-black bg-black p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-old text-xl">Поиск для путешественника</div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Какой регион</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value as typeof region)}
                      className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    >
                      {REGION_OPTIONS.map((r) => (
                        <option key={r} value={r} className="bg-black text-white">
                          {r === "all" ? "Все регионы" : r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Период гостевания</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value as typeof month)}
                      className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    >
                      {monthOptions.map((p) => (
                        <option key={p} value={p} className="bg-black text-white">
                          {p === "all" ? "Любой месяц" : p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Количество человек</label>
                    <select
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    >
                      {peopleOptions.map((p) => (
                        <option key={p} value={p} className="bg-black text-white">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Тип работ</label>
                    <select
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value as typeof workType)}
                      className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    >
                      {workTypeOptions.map((w) => (
                        <option key={w} value={w} className="bg-black text-white">
                          {w === "all" ? "Все типы работ" : w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/70">
                  Найдено проектов: <span className="font-semibold text-white">{filtered.length}</span>
                </div>
              </div>

              <div className="space-y-4">
                {filtered.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="cursor-pointer rounded-3xl border-2 border-black bg-[#1b1b1b] p-5 transition hover:border-black"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {item.workTypes.map((wt) => (
                          <Pill key={wt}>{wt}</Pill>
                        ))}
                        {item.verified ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white">
                            <ShieldCheck className="h-3.5 w-3.5 text-white" />
                            Проверено
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80">
                            Статус: верификация
                          </span>
                        )}
                        {item.safeForSolo && (
                          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white">
                            Solo-friendly
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="font-old text-xl font-semibold text-white">
                          {item.title}
                        </div>
                        <div className="text-sm leading-6 text-white/80">{item.description}</div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <MapPin className="h-4 w-4 text-white/80" />
                          {item.region}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Calendar className="h-4 w-4 text-white/80" />
                          {item.dates}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Users className="h-4 w-4 text-white/80" />
                          до {item.seats} человек
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Star className="h-4 w-4 text-white/80" />
                          {item.rating}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/apply/${item.id}`}
                          className="rounded-2xl bg-[#d63b2e] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          Откликнуться
                        </Link>
                        <Link
                          href={`/projects/${item.id}`}
                          className="rounded-2xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="rounded-3xl border-2 border-white/15 bg-black/90 p-6 text-white/80">
                    Ничего не найдено по заданным фильтрам.
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border-2 border-white/10 bg-black p-5 text-white">
                <div className="font-old text-2xl font-semibold">Правила и ценности сообщества</div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/90">
                  <p>Доверие и честность — наши главные ценности ✨</p>
                  <p className="mt-3">
                    Сообщество «Люди едут к людям» — место, где встречаются открытые и неравнодушные
                    люди из разных регионов России. Чтобы сохранить безопасную и уважительную среду,
                    все анкеты проходят тщательную проверку
                  </p>
                  <p className="mt-3">
                    По вопросам, обратной связи и жалобам пишите на почту{" "}
                    <a href="mailto:pkn048@yandex.ru" className="underline underline-offset-2">
                      pkn048@yandex.ru
                    </a>
                  </p>
                </div>
              </div>

            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-black bg-black p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-old text-xl">Форма хоста</div>
                  <Link
                    href="/host/cabinet"
                    className="ml-auto rounded-xl border border-white/20 px-3 py-1 text-xs font-semibold text-white/90 hover:bg-white/10"
                  >
                    Кабинет хоста
                  </Link>
                </div>

                <form className="mt-4 space-y-5" onSubmit={onSubmitHost}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/70">Название площадки</label>
                      <input
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="Например, Эко-ферма у озера"
                        className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/70">Регион</label>
                      <select
                        value={draft.region}
                        onChange={(e) => setDraft((d) => ({ ...d, region: e.target.value }))}
                        className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                      >
                        {REGION_OPTIONS.filter((r) => r !== "all").map((r) => (
                          <option key={r} value={r} className="bg-black text-white">
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/70">Период гостевания</label>
                      <select
                        value={draft.periodMode}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            periodMode: e.target.value as "Круглый год" | "По месяцам",
                            months:
                              e.target.value === "Круглый год"
                                ? []
                                : d.months,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                      >
                        <option value="Круглый год" className="bg-black text-white">
                          Круглый год
                        </option>
                        <option value="По месяцам" className="bg-black text-white">
                          По месяцам
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/70">Количество мест</label>
                      <select
                        value={draft.seats}
                        onChange={(e) => setDraft((d) => ({ ...d, seats: Number(e.target.value) }))}
                        className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                      >
                        {[1, 2, 3, 4, 5, 6, 10].map((n) => (
                          <option key={n} value={n} className="bg-black text-white">
                            до {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {draft.periodMode === "По месяцам" && (
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-white/70">Выберите месяцы</div>
                      <div className="flex flex-wrap gap-2">
                        {monthOptions
                          .filter((m) => m !== "all")
                          .map((m) => {
                            const active = draft.months.includes(m as Month);
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => toggleDraftMonth(m as Month)}
                                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                  active
                                    ? "border-black bg-[#d63b2e]/15 text-white"
                                    : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-white/70">Тип работ</div>
                    <div className="flex flex-wrap gap-2">
                      {(["Культура", "Заповедники", "Эко-проекты", "Домашние хлопоты"] as WorkType[]).map(
                        (t) => {
                          const active = draft.workTypes.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleWorkType(t)}
                              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                active
                                  ? "border-black bg-[#d63b2e]/15 text-white"
                                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Формат участия</label>
                    <input
                      value={draft.format}
                      onChange={(e) => setDraft((d) => ({ ...d, format: e.target.value }))}
                      placeholder="Проживание + волонтёрство"
                      className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Описание площадки</label>
                    <textarea
                      value={draft.description}
                      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      placeholder="Коротко о том, что ждёт гостя, какие задачи и как устроен быт"
                      className="min-h-[120px] w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70">Задачи (списком)</label>
                    <input
                      value={draft.tasks}
                      onChange={(e) => setDraft((d) => ({ ...d, tasks: e.target.value }))}
                      className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-white">Фото площадки</div>
                    <div className="text-xs text-white/70">
                      Фото будет проверяться модератором перед публикацией.
                    </div>

                    <label className="space-y-2">
                      <div className="text-xs font-medium text-white/70">Поле photoUrl</div>
                      <input
                        value={draft.photoUrl}
                        onChange={(e) => setDraft((d) => ({ ...d, photoUrl: e.target.value }))}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                      />
                    </label>

                    <div className="aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-black/40">
                      {draft.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={draft.photoUrl}
                          alt="Фото площадки"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center gap-2 px-4 text-center text-white/60">
                          <ImageIcon className="h-5 w-5" />
                          Место для фото
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#d63b2e] px-4 py-3 text-sm font-semibold text-white hover:brightness-110"
                  >
                    Отправить на проверку
                  </button>
                </form>
              </div>

            </div>

            <aside />
          </div>
        )}
      </section>

      <footer className="border-t border-black/10 bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <div>Люди едут к людям — MVP UI.</div>
          <div className="flex items-center gap-4">
            <div className="font-medium text-black/80">Придумано и разработано Портновой Ксенией</div>
            <Link
              href="/admin/login"
              className="text-xs lowercase text-black/35 underline decoration-black/25 underline-offset-2 hover:text-black/60"
            >
              модерация
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
