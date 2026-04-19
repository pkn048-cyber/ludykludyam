"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Users,
  HeartHandshake,
  Star,
  MessageCircle,
  Calendar,
  BadgeCheck,
  TentTree,
  Building2,
  UserRound,
  CheckCircle2,
  ScrollText,
  Phone,
  Mail,
  Home,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const projectsSeed = [
  {
    id: 1,
    title: "Эко-ферма в Карелии",
    region: "Карелия",
    type: "Экотуризм",
    format: "Проживание + волонтёрство",
    dates: "10 мая — 30 сентября",
    seats: 4,
    verified: true,
    safeForSolo: true,
    rating: 4.9,
    host: "Северный дом",
    hours: "4–5 часов в день",
    housing: "Гостевой дом на 2–3 человека",
    food: "Домашнее питание 3 раза в день",
    description:
      "Небольшая семейная ферма у озера. Ищем гостей, которым близки спокойный ритм, ручной труд, северная природа и включённость в жизнь места.",
    tasks: ["Помощь на ферме", "Уход за животными", "Подготовка мероприятий"],
    tags: ["Природа", "Женщинам solo", "Без алкоголя"],
  },
  {
    id: 2,
    title: "Арт-резиденция в Дагестане",
    region: "Дагестан",
    type: "Культура",
    format: "Культурный обмен",
    dates: "Круглый год",
    seats: 6,
    verified: true,
    safeForSolo: true,
    rating: 4.8,
    host: "Горы и люди",
    hours: "2–4 часа в день",
    housing: "Комнаты в гостевом доме",
    food: "Кухня общего пользования + ужины с командой",
    description:
      "Культурный центр в селе. Здесь помогают на событиях, знакомятся с локальной культурой, снимают контент и участвуют в жизни сообщества.",
    tasks: ["Помощь на событиях", "Фото/видео", "Работа с гостями"],
    tags: ["Контент", "Комьюнити", "Локальная кухня"],
  },
  {
    id: 3,
    title: "Заповедный лагерь на Алтае",
    region: "Алтай",
    type: "Экология",
    format: "Волонтёрский лагерь",
    dates: "1 июня — 20 августа",
    seats: 10,
    verified: false,
    safeForSolo: false,
    rating: 4.5,
    host: "Алтай рядом",
    hours: "5 часов в день",
    housing: "Палаточный лагерь",
    food: "Полевая кухня",
    description:
      "Природная площадка с базовой инфраструктурой. Идёт повторная проверка регламентов и условий безопасности.",
    tasks: ["Эко-тропы", "Уборка территории", "Помощь координатору"],
    tags: ["Походный быт", "Лето", "Природа"],
  },
  {
    id: 4,
    title: "Музейное село в Псковской области",
    region: "Псковская область",
    type: "Наследие",
    format: "Проживание + помощь проекту",
    dates: "Апрель — октябрь",
    seats: 3,
    verified: true,
    safeForSolo: true,
    rating: 4.7,
    host: "Дом традиций",
    hours: "3–4 часа в день",
    housing: "Гостевые комнаты в старом доме",
    food: "Общая кухня и локальные продукты",
    description:
      "Локальный проект по сохранению культурного наследия. Подходит тем, кто хочет включиться в жизнь сообщества и работать с живой историей.",
    tasks: ["Экскурсии", "Архив", "Подготовка пространства"],
    tags: ["История", "Спокойный ритм", "Обучение"],
  },
];

const initialApplications = [
  { id: 1, project: "Эко-ферма в Карелии", applicant: "Анна Смирнова", status: "Новая", role: "Путешественник" },
  { id: 2, project: "Арт-резиденция в Дагестане", applicant: "Илья Кравцов", status: "На рассмотрении", role: "Путешественник" },
  { id: 3, project: "Дом традиций", applicant: "Команда хоста", status: "Проверка хоста", role: "Хост" },
];

const steps = [
  { title: "Создай профиль", desc: "Путешественник или хост — с понятной анкетой и ролью." },
  { title: "Пройди проверку", desc: "Хосты проходят модерацию, путешественники заполняют профиль участия." },
  { title: "Найди проект", desc: "Каталог с фильтрами по регионам, формату поездки и интересам." },
  { title: "Откликнись", desc: "Заявка, безопасная коммуникация и понятные условия участия." },
];

const metrics = [
  { label: "Проверенные хосты", value: 82 },
  { label: "Проекты для solo-путешествий", value: 71 },
  { label: "Истории поездок", value: 64 },
  { label: "Средний рейтинг опыта", value: 96, suffix: "%" },
];

function FolkDivider() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-px flex-1 bg-[#d7b77b]" />
      <div className="flex items-center gap-2 text-[#9f3b24]">
        <span>✦</span>
        <span className="text-[11px] uppercase tracking-[0.35em]">люди едут к людям</span>
        <span>✦</span>
      </div>
      <div className="h-px flex-1 bg-[#d7b77b]" />
    </div>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h2>
      {desc ? <p className="max-w-3xl text-sm leading-6 text-stone-600">{desc}</p> : null}
    </div>
  );
}

export default function Prototype() {
  const [projects, setProjects] = useState(projectsSeed);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState(projectsSeed[0]);
  const [applications, setApplications] = useState(initialApplications);
  const [travelerForm, setTravelerForm] = useState({ name: "", email: "", telegram: "", motivation: "" });
  const [hostForm, setHostForm] = useState({
    hostName: "",
    projectTitle: "",
    region: "",
    format: "",
    description: "",
    contact: "",
  });
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.host.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q);
      const matchesRegion = region === "all" ? true : item.region === region;
      const matchesType = type === "all" ? true : item.type === type;
      return matchesQuery && matchesRegion && matchesType;
    });
  }, [projects, query, region, type]);

  const submitTravelerApplication = () => {
    if (!travelerForm.name || !travelerForm.email || !travelerForm.motivation) {
      setMessage("Заполни имя, email и мотивацию для участия.");
      return;
    }
    const nextItem = {
      id: applications.length + 1,
      project: selected.title,
      applicant: travelerForm.name,
      status: "Новая",
      role: "Путешественник",
    };
    setApplications([nextItem, ...applications]);
    setTravelerForm({ name: "", email: "", telegram: "", motivation: "" });
    setMessage(`Заявка на проект «${selected.title}» отправлена. Она появилась в разделе модерации.`);
  };

  const submitHostApplication = () => {
    if (!hostForm.hostName || !hostForm.projectTitle || !hostForm.region || !hostForm.description) {
      setMessage("Для заявки хоста заполни название проекта, имя хоста, регион и описание площадки.");
      return;
    }
    const newProject = {
      id: projects.length + 1,
      title: hostForm.projectTitle,
      region: hostForm.region,
      type: "Культура",
      format: hostForm.format || "Гостевание + участие",
      dates: "По согласованию",
      seats: 4,
      verified: false,
      safeForSolo: true,
      rating: 0,
      host: hostForm.hostName,
      hours: "Обсуждается индивидуально",
      housing: "Уточняется после модерации",
      food: "Уточняется после модерации",
      description: hostForm.description,
      tasks: ["Описание задач после проверки"],
      tags: ["Новая площадка", "Модерация"],
    };
    const nextModerationItem = {
      id: applications.length + 1,
      project: hostForm.projectTitle,
      applicant: hostForm.hostName,
      status: "Проверка хоста",
      role: "Хост",
    };
    setProjects([newProject, ...projects]);
    setApplications([nextModerationItem, ...applications]);
    setHostForm({ hostName: "", projectTitle: "", region: "", format: "", description: "", contact: "" });
    setMessage("Площадка отправлена на модерацию. После проверки она сможет появиться в каталоге как подтверждённая.");
  };

  const moderationSummary = useMemo(() => {
    return {
      newCount: applications.filter((item) => item.status === "Новая").length,
      hostChecks: applications.filter((item) => item.status === "Проверка хоста").length,
      reviewCount: applications.filter((item) => item.status === "На рассмотрении").length,
    };
  }, [applications]);

  return (
    <div
      className="min-h-screen bg-[#f8f1e6] text-stone-900"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(191,130,74,0.10), transparent 28%), linear-gradient(to bottom, rgba(248,241,230,1), rgba(255,250,242,1))",
      }}
    >
      <section className="relative overflow-hidden border-b border-[#d9c39d] bg-[#fffaf2]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#7f1d1d_0%,#b45309_20%,#d7b77b_50%,#b45309_80%,#7f1d1d_100%)] opacity-90" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-[#d9c39d] bg-[#f5e6c8] px-4 py-1.5 text-[#8a2e1b] shadow-none">
                Люди едут к людям
              </Badge>
              <Badge variant="outline" className="rounded-full border-[#d9c39d] bg-transparent px-4 py-1.5 text-stone-700">
                культурные поездки по России
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="max-w-max rounded-full border border-[#d9c39d] bg-[#fbf2e1] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#9f3b24]">
                локальное гостеприимство • доверие • комьюнити
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-stone-900 lg:text-5xl">
                Платформа культурных поездок, локального гостеприимства и волонтёрского туризма
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-700 lg:text-lg">
                Открой для себя поездки по России через реальные локальные сообщества: фермы, арт-резиденции, культурные центры, заповедники и гостевые пространства. Здесь люди едут не только в место, но и к людям.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-[1.3rem] bg-[#8a2e1b] px-6 hover:bg-[#742414]">
                Найти поездку
              </Button>
              <Button size="lg" variant="outline" className="rounded-[1.3rem] border-[#caa56a] bg-[#fffaf2] px-6 text-stone-800">
                Стать хостом
              </Button>
            </div>

            <FolkDivider />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((item) => (
                <Card key={item.label} className="rounded-[1.75rem] border border-[#dcc8a6] bg-[#fffaf2] shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-2xl font-semibold text-stone-900">
                      {item.value}
                      {item.suffix || ""}
                    </div>
                    <div className="mt-1 text-sm text-stone-600">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-stone-900">Как устроена платформа</CardTitle>
              <CardDescription className="text-stone-600">
                Понятный путь для путешественников и хостов: от профиля до участия в поездке.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-3 rounded-[1.5rem] bg-[#f7ecd9] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8a2e1b] text-sm font-medium text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-stone-900">{step.title}</div>
                    <div className="text-sm text-stone-600">{step.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          title="Платформа для путешественников и хостов"
          desc="Ниже — рабочая демонстрация основных функций: каталог, карточка проекта, форма отклика, заявка для хоста и базовый блок модерации."
        />
        <FolkDivider />

        <Tabs defaultValue="traveler" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-[1.4rem] border border-[#d9c39d] bg-[#f7ecd9] p-1">
            <TabsTrigger value="traveler" className="rounded-[1rem]">
              Путешественник
            </TabsTrigger>
            <TabsTrigger value="host" className="rounded-[1rem]">
              Хост
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traveler" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
              <div className="space-y-5">
                <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
                  <CardContent className="grid gap-4 p-5 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск по регионам, форматам и хостам"
                        className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8] pl-9"
                      />
                    </div>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]">
                        <SelectValue placeholder="Регион" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все регионы</SelectItem>
                        <SelectItem value="Карелия">Карелия</SelectItem>
                        <SelectItem value="Дагестан">Дагестан</SelectItem>
                        <SelectItem value="Алтай">Алтай</SelectItem>
                        <SelectItem value="Псковская область">Псковская область</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]">
                        <SelectValue placeholder="Тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все форматы</SelectItem>
                        <SelectItem value="Экотуризм">Экотуризм</SelectItem>
                        <SelectItem value="Культура">Культура</SelectItem>
                        <SelectItem value="Экология">Экология</SelectItem>
                        <SelectItem value="Наследие">Наследие</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  {filtered.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer rounded-[2rem] border bg-[#fffaf2] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        selected.id === item.id ? "border-[#8a2e1b] ring-2 ring-[#8a2e1b]/15" : "border-[#d9c39d]"
                      }`}
                      onClick={() => setSelected(item)}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="rounded-full bg-[#f2e2be] text-stone-800">
                                {item.type}
                              </Badge>
                              <Badge variant="outline" className="rounded-full border-[#d3b07a]">
                                {item.format}
                              </Badge>
                              {item.verified ? (
                                <Badge className="rounded-full bg-[#8a2e1b]">
                                  <BadgeCheck className="mr-1 h-3.5 w-3.5" /> Проверено
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="rounded-full border-[#c78e58] text-[#9f3b24]">
                                  На проверке
                                </Badge>
                              )}
                              {item.safeForSolo && (
                                <Badge variant="secondary" className="rounded-full bg-[#efe6d5] text-stone-800">
                                  Подходит для solo
                                </Badge>
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-stone-900">{item.title}</h3>
                              <p className="mt-1 text-sm leading-6 text-stone-600">{item.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{item.region}</span>
                              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{item.dates}</span>
                              <span className="flex items-center gap-1"><Users className="h-4 w-4" />до {item.seats} человек</span>
                              <span className="flex items-center gap-1"><Star className="h-4 w-4" />{item.rating || "новый"}</span>
                            </div>
                          </div>
                          <div className="flex min-w-[180px] flex-col gap-2">
                            <Button className="rounded-[1.2rem] bg-[#8a2e1b] hover:bg-[#742414]">Выбрать проект</Button>
                            <Button variant="outline" className="rounded-[1.2rem] border-[#d3b07a] bg-[#fffaf2]">
                              Подробнее
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Карточка проекта</CardTitle>
                    <CardDescription className="text-stone-600">
                      Структурированная подача помогает быстро понять формат, быт и уровень доверия.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-semibold text-stone-900">{selected.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                        <Building2 className="h-4 w-4" /> {selected.host}
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-[1.5rem] bg-[#f7ecd9] p-4 text-sm text-stone-700">
                      <div className="flex items-center justify-between"><span>Регион</span><span className="font-medium">{selected.region}</span></div>
                      <div className="flex items-center justify-between"><span>Формат</span><span className="font-medium">{selected.format}</span></div>
                      <div className="flex items-center justify-between"><span>Период</span><span className="font-medium">{selected.dates}</span></div>
                      <div className="flex items-center justify-between"><span>Занятость</span><span className="font-medium">{selected.hours}</span></div>
                      <div className="flex items-center justify-between"><span>Проживание</span><span className="font-medium">{selected.housing}</span></div>
                      <div className="flex items-center justify-between"><span>Питание</span><span className="font-medium">{selected.food}</span></div>
                    </div>

                    <div>
                      <div className="mb-2 font-medium text-stone-900">Что нужно делать</div>
                      <div className="flex flex-wrap gap-2">
                        {selected.tasks.map((task) => (
                          <Badge key={task} variant="outline" className="rounded-full border-[#d3b07a] bg-[#fffaf2]">
                            {task}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 font-medium text-stone-900">Метки доверия</div>
                      <div className="space-y-2 text-sm text-stone-600">
                        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Ручная проверка площадки и контактов</div>
                        <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Коммуникация только после отклика</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Единый стандарт описания условий</div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 font-medium text-stone-900">Теги</div>
                      <div className="flex flex-wrap gap-2">
                        {selected.tags.map((tag) => (
                          <Badge key={tag} className="rounded-full bg-[#f2e2be] text-stone-800 hover:bg-[#edd8ac]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Отклик на поездку</CardTitle>
                    <CardDescription className="text-stone-600">
                      Базовая форма заявки, которую потом можно подключить к реальной базе данных.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      value={travelerForm.name}
                      onChange={(e) => setTravelerForm({ ...travelerForm, name: e.target.value })}
                      placeholder="Имя и фамилия"
                      className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                    />
                    <Input
                      value={travelerForm.email}
                      onChange={(e) => setTravelerForm({ ...travelerForm, email: e.target.value })}
                      placeholder="Email"
                      className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                    />
                    <Input
                      value={travelerForm.telegram}
                      onChange={(e) => setTravelerForm({ ...travelerForm, telegram: e.target.value })}
                      placeholder="Telegram / телефон"
                      className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                    />
                    <Textarea
                      value={travelerForm.motivation}
                      onChange={(e) => setTravelerForm({ ...travelerForm, motivation: e.target.value })}
                      placeholder="Почему вам интересен этот проект?"
                      className="min-h-[110px] rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                    />
                    <Button className="w-full rounded-[1.2rem] bg-[#8a2e1b] hover:bg-[#742414]" onClick={submitTravelerApplication}>
                      Отправить заявку
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="host" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
              <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Размещение новой площадки</CardTitle>
                  <CardDescription className="text-stone-600">
                    Форма для хоста. После отправки площадка попадает в блок ручной модерации.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={hostForm.hostName}
                    onChange={(e) => setHostForm({ ...hostForm, hostName: e.target.value })}
                    placeholder="Название хоста / пространства"
                    className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                  />
                  <Input
                    value={hostForm.projectTitle}
                    onChange={(e) => setHostForm({ ...hostForm, projectTitle: e.target.value })}
                    placeholder="Название проекта"
                    className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                  />
                  <Input
                    value={hostForm.region}
                    onChange={(e) => setHostForm({ ...hostForm, region: e.target.value })}
                    placeholder="Регион"
                    className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                  />
                  <Input
                    value={hostForm.format}
                    onChange={(e) => setHostForm({ ...hostForm, format: e.target.value })}
                    placeholder="Формат участия"
                    className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      value={hostForm.description}
                      onChange={(e) => setHostForm({ ...hostForm, description: e.target.value })}
                      placeholder="Кратко опишите пространство, условия и кого вы ищете"
                      className="min-h-[130px] rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8]"
                    />
                  </div>
                  <Input
                    value={hostForm.contact}
                    onChange={(e) => setHostForm({ ...hostForm, contact: e.target.value })}
                    placeholder="Контакт для связи"
                    className="rounded-[1.2rem] border-[#dcc8a6] bg-[#fffdf8] md:col-span-2"
                  />
                  <div className="md:col-span-2">
                    <Button className="w-full rounded-[1.2rem] bg-[#8a2e1b] hover:bg-[#742414]" onClick={submitHostApplication}>
                      Отправить площадку на модерацию
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Что получает хост</CardTitle>
                  <CardDescription className="text-stone-600">
                    Базовая логика кабинета для принимающей стороны.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: <TentTree className="h-5 w-5" />,
                      title: "Карточка площадки",
                      text: "Название, регион, формат участия, описание пространства, условия и количество мест.",
                    },
                    {
                      icon: <ShieldCheck className="h-5 w-5" />,
                      title: "Верификация",
                      text: "Ручная проверка контактов, условий участия, правил безопасности и достоверности описания.",
                    },
                    {
                      icon: <Users className="h-5 w-5" />,
                      title: "Отклики",
                      text: "Список заявок со статусами, понятная приоритизация и базовая коммуникация.",
                    },
                    {
                      icon: <HeartHandshake className="h-5 w-5" />,
                      title: "Репутация",
                      text: "Отзывы после поездки, рост доверия и более сильное присутствие в каталоге.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] bg-[#f7ecd9] p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[#fffaf2] text-[#8a2e1b] shadow-sm">
                        {item.icon}
                      </div>
                      <div className="font-medium text-stone-900">{item.title}</div>
                      <div className="mt-1 text-sm leading-6 text-stone-600">{item.text}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <SectionTitle
          title="Ручная модерация и базовая админка"
          desc="Это демонстрация того, как ты как владелец платформы видишь заявки, новые проекты и этапы проверки."
        />
        <FolkDivider />

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Сводка модерации</CardTitle>
              <CardDescription className="text-stone-600">Минимальный контур контроля до запуска полноценной CRM или админ-панели.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  { label: "Новые заявки", value: moderationSummary.newCount, icon: <ScrollText className="h-4 w-4" /> },
                  { label: "Проверка хостов", value: moderationSummary.hostChecks, icon: <ShieldCheck className="h-4 w-4" /> },
                  { label: "На рассмотрении", value: moderationSummary.reviewCount, icon: <Sparkles className="h-4 w-4" /> },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] bg-[#f7ecd9] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#8a2e1b]">{item.icon}<span className="text-sm">{item.label}</span></div>
                    <div className="text-2xl font-semibold text-stone-900">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-[#e2cfad] bg-[#fffdf8] p-4 text-sm leading-6 text-stone-600">
                Здесь можно проверять, какие проекты попали в каталог, какие заявки отправлены, какие хосты ждут подтверждения. На следующем этапе этот блок можно связать с Supabase и сделать настоящую админку с ролями доступа.
              </div>

              {message ? (
                <div className="rounded-[1.4rem] border border-[#d7b77b] bg-[#fbf2e1] p-4 text-sm text-stone-700">
                  {message}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Список заявок и проверок</CardTitle>
              <CardDescription className="text-stone-600">Новые записи появляются здесь после отправки формы путешественника или хоста.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {applications.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-[#e1cfad] bg-[#fffdf8] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-stone-900">{item.project}</span>
                      <Badge className="rounded-full bg-[#f2e2be] text-stone-800">{item.role}</Badge>
                    </div>
                    <div className="text-sm text-stone-600">{item.applicant}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-full ${
                        item.status === "Новая"
                          ? "border-[#8a2e1b] text-[#8a2e1b]"
                          : item.status === "Проверка хоста"
                          ? "border-[#b45309] text-[#9f3b24]"
                          : "border-[#7c6a4f] text-stone-700"
                      }`}
                    >
                      {item.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="rounded-full border-[#d3b07a] bg-[#fffaf2]">
                      Открыть
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <SectionTitle title="Что уже реализовано в этом коде" />
        <FolkDivider />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Пользовательские функции</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-stone-600">
              <div className="flex items-center gap-2"><UserRound className="h-4 w-4" /> Каталог проектов и фильтры</div>
              <div className="flex items-center gap-2"><Search className="h-4 w-4" /> Поиск по регионам, хостам и описаниям</div>
              <div className="flex items-center gap-2"><ScrollText className="h-4 w-4" /> Карточка проекта с условиями</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> Форма отправки заявки</div>
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Базовый поток отклика</div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Функции для хостов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-stone-600">
              <div className="flex items-center gap-2"><Home className="h-4 w-4" /> Форма подачи площадки</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Статус проверки и логика модерации</div>
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Базовая публикация проекта в каталоге</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> Поле контакта для связи</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4" /> Основа под рейтинг и доверие</div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-[#d9c39d] bg-[#fffaf2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Контур платформы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-stone-600">
              <div>Frontend: React / Next.js</div>
              <div>Backend: Supabase</div>
              <div>Авторизация: email magic link + Telegram позже</div>
              <div>Админка: ручная модерация + роли</div>
              <div>Уведомления: Telegram Bot API / email</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
