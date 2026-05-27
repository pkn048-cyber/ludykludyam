"use client";

import { ChangeEvent, FormEvent, use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Image as ImageIcon, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { projects } from "@/data/projects";
import { saveApplication } from "@/lib/applications";

type ApplyPageProps = {
  params: Promise<{ id: string }>;
};

export default function ApplyForm({ params }: ApplyPageProps) {
  const router = useRouter();
  const { id: resolvedId } = use(params);
  const [travelerName, setTravelerName] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [error, setError] = useState("");

  const project = useMemo(
    () => projects.find((p) => String(p.id) === resolvedId),
    [resolvedId]
  );

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!project) {
      setError("Проект не найден");
      return;
    }
    if (!travelerName.trim() || !about.trim() || !skills.trim() || !photoDataUrl) {
      setError("Заполните имя, описание, умения и загрузите фото");
      return;
    }

    saveApplication({
      id: crypto.randomUUID(),
      projectId: project.id,
      projectTitle: project.title,
      travelerName: travelerName.trim(),
      city: city.trim(),
      age: age.trim(),
      about: about.trim(),
      skills: skills.trim(),
      photoDataUrl,
      createdAt: new Date().toISOString(),
    });

    router.push("/host/cabinet");
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#efeae2] p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-black/20 bg-white/40 p-6">
          <div className="font-old text-3xl">Проект не найден</div>
          <Link href="/" className="mt-4 inline-flex rounded-2xl border border-black px-4 py-2">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">

      {/* Шапка */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#efeae2]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-old text-lg font-bold leading-tight text-[#1b1b1b]">
            Люди едут к людям
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-black/15 bg-white/50 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* Левая колонка — информация о проекте */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#1b1b1b]">
              {project.imageUrl && (
                <div className="relative h-56 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] via-[#1b1b1b]/10 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {project.verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Проверено
                    </span>
                  )}
                  {project.safeForSolo && (
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white">
                      Solo-friendly
                    </span>
                  )}
                </div>
                <h1 className="mt-4 font-old text-2xl font-bold text-white">{project.title}</h1>
                <p className="mt-2 text-sm leading-6 text-white/75">{project.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {project.region}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="h-4 w-4 shrink-0" />
                    {project.dates}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="h-4 w-4 shrink-0" />
                    до {project.seats} человек
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Star className="h-4 w-4 shrink-0 fill-[#d63b2e] text-[#d63b2e]" />
                    <span className="font-medium text-white">{project.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Задачи */}
            <div className="rounded-3xl border border-black/10 bg-white/60 p-5">
              <div className="font-old text-lg font-semibold">Что нужно делать</div>
              <ul className="mt-3 space-y-2">
                {project.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="mt-0.5 text-[#d63b2e]">✦</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            {/* Формат */}
            <div className="rounded-3xl border border-black/10 bg-white/60 p-5">
              <div className="font-old text-lg font-semibold">Формат участия</div>
              <p className="mt-2 text-sm text-black/70">{project.format}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-medium text-black/50">Хост:</span>
                <span className="text-sm font-medium text-black/80">{project.host}</span>
              </div>
            </div>
          </div>

          {/* Правая колонка — форма */}
          <div>
            <div className="rounded-3xl border border-black/10 bg-white/60 p-6">
              <div className="font-old text-2xl font-semibold text-black">Подать заявку</div>
              <p className="mt-1 text-sm text-black/55">
                Расскажите о себе — хост получит вашу анкету и выйдет на связь
              </p>

              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <div className="text-xs font-medium text-black/60">Имя и фамилия</div>
                    <input
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      className="w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                      placeholder="Иван Иванов"
                    />
                  </label>
                  <label className="space-y-2">
                    <div className="text-xs font-medium text-black/60">Город</div>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                      placeholder="Москва"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <div className="text-xs font-medium text-black/60">Возраст</div>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                    placeholder="27"
                  />
                </label>

                <label className="space-y-2">
                  <div className="text-xs font-medium text-black/60">Расскажите о себе</div>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="min-h-[120px] w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                    placeholder="Почему хотите поехать, какой у вас опыт"
                  />
                </label>

                <label className="space-y-2">
                  <div className="text-xs font-medium text-black/60">Ваши умения</div>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="min-h-[100px] w-full rounded-2xl border border-black/15 bg-white/80 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/40 focus:bg-white"
                    placeholder="Организация, коммуникация, фото, работа с детьми, ручной труд"
                  />
                </label>

                <div className="space-y-3 rounded-2xl border border-black/10 bg-white/50 p-4">
                  <div className="text-sm font-semibold text-black/80">Фотография</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="block w-full text-sm text-black/70 file:mr-3 file:rounded-xl file:border-0 file:bg-black/10 file:px-3 file:py-2 file:text-black/70 hover:file:bg-black/15"
                  />
                  <div className="aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-white/40">
                    {photoDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoDataUrl} alt="Фото путешественника" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center gap-2 text-black/40">
                        <ImageIcon className="h-5 w-5" />
                        Загрузите фотографию
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-[#d63b2e]/40 bg-[#d63b2e]/8 px-4 py-3 text-sm text-[#d63b2e]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#d63b2e] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

