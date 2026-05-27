"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Filter,
  Heart,
  Image as ImageIcon,
  Lock,
  MapPin,
  Menu,
  ShieldCheck,
  Star,
  Users,
  Building2,
  UserRound,
  X,
} from "lucide-react";
import { projects, type Month, type Project, type WorkType } from "@/data/projects";
import { getIsPaid, activateByCode } from "@/lib/subscription";

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

const REVIEWS = [
  {
    name: "Анастасия К.",
    city: "Москва",
    project: "Эко-ферма в Карелии",
    rating: 5,
    text: "Две недели в Карелии — лучший опыт за последние годы. Просыпалась под звуки озера, кормила коз и засыпала без телефона. Хозяева стали почти семьёй.",
    initials: "АК",
  },
  {
    name: "Илья Р.",
    city: "Санкт-Петербург",
    project: "Земля Леопарда — Дальний Восток",
    rating: 5,
    text: "Работал с фотоловушками три недели. Видел следы леопарда на тропе — сердце остановилось. Такого нет ни в одном туре за деньги.",
    initials: "ИР",
  },
  {
    name: "Марина Д.",
    city: "Казань",
    project: "Соловецкий монастырь",
    rating: 5,
    text: "Поехала одна, вернулась другим человеком. Работа в огороде, рыбалка, тишина Белого моря — и люди, которые живут по-настоящему.",
    initials: "МД",
  },
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(() => getIsPaid());
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activateByCode(promoCode)) {
      setIsPaid(true);
      setPromoSuccess(true);
      setPromoError(false);
    } else {
      setPromoError(true);
    }
  }

  const weekProject = useMemo((): Project => {
    const sorted = [...projects].sort((a, b) => b.rating - a.rating);
    return sorted[0]!;
  }, []);

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

      {/* ══════════════════════════════════════════
          НАВИГАЦИЯ — залипающая шапка
      ══════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#efeae2]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Логотип */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center"
            aria-label="На главную"
          >
            <Image
              src="/test_logo.svg"
              alt="Люди едут к людям"
              width={40}
              height={40}
              className="h-10 w-auto"
              unoptimized
            />
          </button>

          {/* Ссылки — только desktop */}
          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-medium text-black/60 transition-colors hover:text-[#d63b2e]"
            >
              О проекте
            </button>
            <button
              type="button"
              onClick={() => {
                handleModeChange("traveler");
                document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-sm font-medium transition-colors hover:text-[#d63b2e] ${mode === "traveler" ? "text-[#d63b2e]" : "text-black/60"}`}
            >
              Для путешественников
            </button>
            <button
              type="button"
              onClick={() => {
                handleModeChange("host");
                document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-sm font-medium transition-colors hover:text-[#d63b2e] ${mode === "host" ? "text-[#d63b2e]" : "text-black/60"}`}
            >
              Для хостов
            </button>
            <Link
              href="/documents"
              className="text-sm font-medium text-black/60 transition-colors hover:text-[#d63b2e]"
            >
              Документы
            </Link>
            <Link
              href="/contacts"
              className="text-sm font-medium text-black/60 transition-colors hover:text-[#d63b2e]"
            >
              Контакты
            </Link>
          </div>

          {/* Hamburger — только mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-xl p-2 text-black/70 transition hover:bg-black/5 md:hidden"
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Личный кабинет */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCabinetOpen((v) => !v)}
              className="flex items-center gap-2 rounded-2xl border border-black/15 bg-white/50 px-3 py-2 text-sm font-medium text-black/70 transition hover:bg-white/70"
            >
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">Кабинет</span>
            </button>

            {cabinetOpen && (
              <>
                {/* Backdrop — закрывает при клике снаружи */}
                <div className="fixed inset-0 z-40" onClick={() => setCabinetOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-[#efeae2] shadow-xl">
                  <div className="border-b border-black/5 px-4 py-3 text-xs font-medium text-black/40">
                    Войти как
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleModeChange("traveler");
                        document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
                        setCabinetOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-black/70 transition hover:bg-white/60"
                    >
                      Я путешественник
                    </button>
                    <Link
                      href="/host/cabinet"
                      onClick={() => setCabinetOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-black/70 transition hover:bg-white/60"
                    >
                      Я хост
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Мобильное выпадающее меню */}
        {mobileMenuOpen && (
          <div className="border-t border-black/10 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileMenuOpen(false); }}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-black/70 transition-colors hover:bg-black/5"
              >
                О проекте
              </button>
              <button
                type="button"
                onClick={() => { handleModeChange("traveler"); document.getElementById("content")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
                className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  mode === "traveler" ? "bg-[#d63b2e]/10 text-[#d63b2e]" : "text-black/70 hover:bg-black/5"
                }`}
              >
                Для путешественников
              </button>
              <button
                type="button"
                onClick={() => { handleModeChange("host"); document.getElementById("content")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
                className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  mode === "host" ? "bg-[#d63b2e]/10 text-[#d63b2e]" : "text-black/70 hover:bg-black/5"
                }`}
              >
                Для хостов
              </button>
              <Link
                href="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-black/70 transition-colors hover:bg-black/5"
              >
                Документы
              </Link>
              <Link
                href="/contacts"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-black/70 transition-colors hover:bg-black/5"
              >
                Контакты
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="border-b border-black/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="space-y-8">

            {/* ── HERO: заголовок + логотип ── */}
            <div className="relative">
              <div className="space-y-4 lg:pr-[420px]">
                <h1 className="font-old text-4xl font-bold leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
                  ЛЮДИ ЕДУТ К ЛЮДЯМ
                </h1>
                <p className="font-old text-xl text-[#d63b2e]">
                  Путешествия, которые соединяют людей
                </p>
                <p className="max-w-xl text-base leading-7 text-black/70">
                  Волонтёрский туризм по всей России — помогай интересным людям и проектам
                  в обмен на жильё, питание и настоящий культурный опыт
                </p>
              </div>

              {/* Логотип — только desktop */}
              <div className="pointer-events-none hidden lg:block lg:absolute lg:right-0 lg:top-0">
                <Image
                  src="/test_logo.svg"
                  alt="Логотип проекта"
                  width={630}
                  height={630}
                  className="h-auto w-[390px] xl:w-[440px]"
                />
              </div>
            </div>

            {/* ── СТАТИСТИКА ── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-2xl">
              <div className="rounded-2xl border border-black/15 bg-white/40 px-4 py-4">
                <div className="font-old text-3xl font-bold text-[#d63b2e]">15</div>
                <div className="mt-1 text-xs font-medium text-black/60">проектов по России</div>
              </div>
              <div className="rounded-2xl border border-black/15 bg-white/40 px-4 py-4">
                <div className="font-old text-3xl font-bold text-[#d63b2e]">15</div>
                <div className="mt-1 text-xs font-medium text-black/60">регионов</div>
              </div>
              <div className="rounded-2xl border border-black/15 bg-white/40 px-4 py-4">
                <div className="font-old text-3xl font-bold text-[#d63b2e]">4.8</div>
                <div className="mt-1 text-xs font-medium text-black/60">средний рейтинг</div>
              </div>
              <div className="rounded-2xl border border-black/15 bg-white/40 px-4 py-4">
                <div className="font-old text-3xl font-bold text-[#d63b2e]">100%</div>
                <div className="mt-1 text-xs font-medium text-black/60">ручная верификация</div>
              </div>
            </div>

            {/* ── ВЫБОР РЕЖИМА: одинаковые карточки ── */}
            <div className="grid gap-4 md:grid-cols-2">

              {/* Путешественник */}
              <button
                type="button"
                onClick={() => handleModeChange("traveler")}
                className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all duration-200 ${
                  mode === "traveler"
                    ? "border-[#d63b2e]/30 bg-white shadow-sm"
                    : "border-black/10 bg-white/50 hover:border-black/20 hover:bg-white/70"
                }`}
              >
                <UserRound
                  className={`mb-4 h-8 w-8 transition-colors duration-200 ${
                    mode === "traveler" ? "text-[#d63b2e]" : "text-black/30 group-hover:text-[#d63b2e]"
                  }`}
                />
                <div className="font-old text-2xl font-bold text-black">Еду</div>
                <div className="mt-1.5 text-sm leading-6 text-black/55">
                  Найди проекты со всей России и поезжай
                </div>
                <div
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    mode === "traveler" ? "text-[#d63b2e]" : "text-black/30 group-hover:text-[#d63b2e]"
                  }`}
                >
                  Смотреть проекты
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>

              {/* Хост */}
              <button
                type="button"
                onClick={() => handleModeChange("host")}
                className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all duration-200 ${
                  mode === "host"
                    ? "border-[#d63b2e]/30 bg-white shadow-sm"
                    : "border-black/10 bg-white/50 hover:border-black/20 hover:bg-white/70"
                }`}
              >
                <Heart
                  className={`mb-4 h-8 w-8 transition-colors duration-200 ${
                    mode === "host" ? "text-[#d63b2e]" : "text-black/30 group-hover:text-[#d63b2e]"
                  }`}
                />
                <div className="font-old text-2xl font-bold text-black">Приглашаю</div>
                <div className="mt-1.5 text-sm leading-6 text-black/55">
                  Разместите площадку бесплатно и принимайте проверенных гостей
                </div>
                <div
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    mode === "host" ? "text-[#d63b2e]" : "text-black/30 group-hover:text-[#d63b2e]"
                  }`}
                >
                  Стать хостом
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ТИКЕР — бегущая строка проектов
      ══════════════════════════════════════════ */}
      <div className="overflow-hidden border-b border-black/10 py-3">
        <div className="ticker-track">
          {[...projects, ...projects].map((p, i) => (
            <span
              key={`${p.id}-${i}`}
              className="mx-8 inline-flex items-center gap-2 whitespace-nowrap text-sm text-black/60"
            >
              <span className="text-[#d63b2e]">✦</span>
              <span className="font-medium text-black/75">{p.title}</span>
              <span className="text-black/40">—</span>
              <span>{p.region}</span>
            </span>
          ))}
        </div>
      </div>

      <section id="content" className="mx-auto max-w-7xl px-6 py-10">
        {mode === "traveler" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">

              {/* ── КАК ЭТО РАБОТАЕТ: Путешественник ── */}
              <div className="rounded-3xl border-2 border-black/10 bg-white/60 p-6">
                <div className="font-old text-2xl font-semibold">Как стать участником</div>
                <p className="mt-1 text-sm text-black/60">
                  4–5 часов помощи в день — в обмен на жильё, питание и незабываемый опыт
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">1</div>
                    <div className="text-sm font-semibold">Найди проект</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Фильтры по региону, сезону и типу работ</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">2</div>
                    <div className="text-sm font-semibold">Заполни анкету</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Расскажи о себе и прикрепи фото</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">3</div>
                    <div className="text-sm font-semibold">Хост выходит на связь</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Знакомство и обсуждение деталей поездки</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#d63b2e] text-sm font-bold text-white">4</div>
                    <div className="text-sm font-semibold">Поезжай!</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Погружайся в культуру и жизнь региона</div>
                  </div>
                </div>
              </div>

              {/* ── ПРОЕКТ НЕДЕЛИ ── */}
              <div className="overflow-hidden rounded-3xl border-2 border-[#d63b2e]/50 bg-[#1b1b1b] shadow-lg shadow-[#d63b2e]/5">
                {weekProject.imageUrl && (
                  <div className="relative h-64 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={weekProject.imageUrl}
                      alt={weekProject.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] via-[#1b1b1b]/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#d63b2e] px-3 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3 fill-white text-white" />
                      Проект недели
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {weekProject.workTypes.map((wt) => (
                      <Pill key={wt}>{wt}</Pill>
                    ))}
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-white" />
                      Проверено
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="font-old text-2xl font-bold text-white">{weekProject.title}</div>
                    <div className="mt-2 text-sm leading-6 text-white/80">{weekProject.description}</div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="h-4 w-4 text-white/80" />
                      {weekProject.region}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Calendar className="h-4 w-4 text-white/80" />
                      {weekProject.dates}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Users className="h-4 w-4 text-white/80" />
                      до {weekProject.seats} человек
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Star className="h-4 w-4 fill-[#d63b2e] text-[#d63b2e]" />
                      {weekProject.rating}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/apply/${weekProject.id}`}
                      className="rounded-2xl bg-[#d63b2e] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                    >
                      Откликнуться
                    </Link>
                    <Link
                      href={`/projects/${weekProject.id}`}
                      className="rounded-2xl border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>

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
                      className="cursor-pointer overflow-hidden rounded-3xl border-2 border-black bg-[#1b1b1b] transition-all duration-200 hover:border-[#d63b2e]/70 hover:shadow-lg hover:shadow-black/20"
                    >
                      {item.imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              const parent = (e.currentTarget as HTMLImageElement).parentElement;
                              if (parent) parent.style.display = "none";
                            }}
                          />
                          {/* Плавный переход изображения в карточку */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] via-[#1b1b1b]/10 to-transparent" />
                        </div>
                      )}
                      <div className="p-5">
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

                      {/* Хост — скрыт без подписки */}
                      <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                        <span className="text-xs text-white/40">Хост:</span>
                        {isPaid ? (
                          <span className="font-medium text-white/80">{item.host}</span>
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-0.5 text-xs text-white/40">
                            <Lock className="h-3 w-3" />
                            Скрыто — нужна подписка
                          </span>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {isPaid ? (
                          <Link
                            href={`/apply/${item.id}`}
                            className="rounded-2xl bg-[#d63b2e] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                          >
                            Откликнуться
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowPricing(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/50 transition hover:border-[#d63b2e]/40 hover:text-white/70"
                          >
                            <Lock className="h-3.5 w-3.5" />
                            Откликнуться
                          </button>
                        )}
                        <Link
                          href={`/projects/${item.id}`}
                          className="rounded-2xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
                        >
                          Подробнее
                        </Link>
                      </div>
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

              {/* ══ ТАРИФЫ ══ */}
              {(showPricing || !isPaid) && (
                <div id="pricing" className="rounded-3xl border border-[#d63b2e]/30 bg-[#efeae2] p-6">
                  <div className="font-old text-2xl font-bold text-black">
                    {isPaid ? "Ваш доступ активен" : "Откройте полный доступ"}
                  </div>
                  <p className="mt-1 text-sm text-black/60">
                    {isPaid
                      ? "Вы можете откликаться на проекты и видеть контакты хостов"
                      : "Подпишитесь, чтобы видеть контакты хостов и подавать заявки"}
                  </p>

                  {!isPaid && (
                    <>
                      {/* Карточки тарифов */}
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-black/10 bg-white p-4">
                          <div className="text-xs font-semibold uppercase tracking-wide text-black/40">На 3 месяца</div>
                          <div className="mt-2 font-old text-3xl font-bold text-black">1 989 ₽</div>
                          <ul className="mt-3 space-y-1.5">
                            {["Полный доступ к каталогу", "Контакты всех хостов", "Неограниченные отклики"].map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-black/65">
                                <Check className="h-3.5 w-3.5 shrink-0 text-[#d63b2e]" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <a
                            href="mailto:pkn048@yandex.ru?subject=Подписка на 3 месяца — 1989 руб"
                            className="mt-4 block rounded-xl border border-black/15 bg-black/5 px-4 py-2 text-center text-sm font-semibold text-black/70 transition hover:bg-black/10"
                          >
                            Оплатить
                          </a>
                        </div>

                        <div className="rounded-2xl border-2 border-[#d63b2e]/30 bg-white p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold uppercase tracking-wide text-black/40">На 1 год</div>
                            <span className="rounded-full bg-[#d63b2e] px-2 py-0.5 text-xs font-bold text-white">Выгодно</span>
                          </div>
                          <div className="mt-2 font-old text-3xl font-bold text-black">2 989 ₽</div>
                          <ul className="mt-3 space-y-1.5">
                            {["Полный доступ к каталогу", "Контакты всех хостов", "Неограниченные отклики", "Приоритет в поиске хостов"].map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-black/65">
                                <Check className="h-3.5 w-3.5 shrink-0 text-[#d63b2e]" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <a
                            href="mailto:pkn048@yandex.ru?subject=Подписка на 1 год — 2989 руб"
                            className="mt-4 block rounded-xl bg-[#d63b2e] px-4 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
                          >
                            Оплатить
                          </a>
                        </div>
                      </div>

                      {/* Промокод */}
                      <div className="mt-5 border-t border-black/10 pt-4">
                        <div className="text-xs font-medium text-black/50">Есть промокод?</div>
                        <form onSubmit={handlePromoSubmit} className="mt-2 flex gap-2">
                          <input
                            value={promoCode}
                            onChange={(e) => { setPromoCode(e.target.value); setPromoError(false); }}
                            placeholder="Введите код"
                            className="flex-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/30"
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-[#1b1b1b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                          >
                            Применить
                          </button>
                        </form>
                        {promoError && (
                          <p className="mt-1.5 text-xs text-[#d63b2e]">Код не подошёл. Проверьте написание.</p>
                        )}
                      </div>
                    </>
                  )}

                  {isPaid && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#d63b2e]/20 bg-[#d63b2e]/5 px-4 py-3 text-sm font-medium text-[#d63b2e]">
                      <Check className="h-4 w-4" />
                      Подписка активна
                    </div>
                  )}
                </div>
              )}
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

              {/* ── ОТЗЫВЫ ── */}
              <div className="rounded-3xl border-2 border-white/10 bg-black p-5 text-white">
                <div className="font-old text-2xl font-semibold">Отзывы путешественников</div>
                <div className="mt-4 space-y-4">
                  {REVIEWS.map((review) => (
                    <div key={review.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d63b2e] text-xs font-bold text-white">
                          {review.initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{review.name}</div>
                          <div className="text-xs text-white/50">{review.city}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#d63b2e] text-[#d63b2e]" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/80">«{review.text}»</p>
                      <div className="mt-2 text-xs text-white/40">{review.project}</div>
                    </div>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">

              {/* ── КАК ЭТО РАБОТАЕТ: Хост ── */}
              <div className="rounded-3xl border-2 border-black/10 bg-white/60 p-6">
                <div className="font-old text-2xl font-semibold">Как принять путешественника</div>
                <p className="mt-1 text-sm text-black/60">
                  Бесплатно разместите площадку и получайте заявки от проверенных участников
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">1</div>
                    <div className="text-sm font-semibold">Заполни анкету</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Опиши площадку, задачи и условия проживания</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">2</div>
                    <div className="text-sm font-semibold">Пройди проверку</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Модератор верифицирует данные и контакты</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">3</div>
                    <div className="text-sm font-semibold">Получи отклики</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Путешественники находят тебя по фильтрам</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#d63b2e] text-sm font-bold text-white">4</div>
                    <div className="text-sm font-semibold">Кабинет хоста</div>
                    <div className="mt-1 text-xs leading-5 text-black/60">Управляй заявками и выбирай гостей</div>
                  </div>
                </div>
              </div>

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

      <footer id="footer" className="border-t border-black/10 bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium text-black/80">© 2025 Люди едут к людям</div>
            <div className="font-old text-xs text-[#d63b2e]/70 mt-0.5">Путешествия, которые соединяют людей</div>
          </div>
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
