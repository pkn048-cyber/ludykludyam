"use client";

import { ChangeEvent, FormEvent, use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
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
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/20 bg-white/35 px-4 py-2 text-sm font-medium hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к проектам
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-3xl border-2 border-black bg-[#1b1b1b] p-6 text-white">
          <div className="font-old text-3xl">Отклик на проект</div>
          <div className="mt-2 text-white/80">
            {project.title} · {project.region}
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <div className="text-xs font-medium text-white/70">Имя и фамилия</div>
                <input
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                  placeholder="Иван Иванов"
                />
              </label>
              <label className="space-y-2">
                <div className="text-xs font-medium text-white/70">Город</div>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                  placeholder="Москва"
                />
              </label>
            </div>

            <label className="space-y-2">
              <div className="text-xs font-medium text-white/70">Возраст</div>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                placeholder="27"
              />
            </label>

            <label className="space-y-2">
              <div className="text-xs font-medium text-white/70">Расскажите о себе</div>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                placeholder="Почему хотите поехать, какой у вас опыт"
              />
            </label>

            <label className="space-y-2">
              <div className="text-xs font-medium text-white/70">Ваши умения</div>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="min-h-[100px] w-full rounded-2xl border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none focus:border-black"
                placeholder="Организация, коммуникация, фото, работа с детьми, ручной труд"
              />
            </label>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Фотография путешественника</div>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="block w-full text-sm text-white/90 file:mr-3 file:rounded-xl file:border-0 file:bg-white/15 file:px-3 file:py-2 file:text-white hover:file:bg-white/20"
              />

              <div className="aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-black/40">
                {photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoDataUrl} alt="Фото путешественника" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center gap-2 text-white/60">
                    <ImageIcon className="h-5 w-5" />
                    Загрузите фотографию
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-[#d63b2e]/50 bg-[#d63b2e]/15 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#d63b2e] px-4 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              Отправить отклик
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

