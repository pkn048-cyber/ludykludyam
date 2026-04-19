"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, FolderOpenDot, Users } from "lucide-react";
import { projects } from "@/data/projects";
import { readApplications, type TravelerApplication } from "@/lib/applications";

const hostNames = Array.from(new Set(projects.map((p) => p.host))).sort((a, b) =>
  a.localeCompare(b, "ru")
);

export default function HostCabinetPage() {
  const [selectedHost, setSelectedHost] = useState<string>(hostNames[0] ?? "");
  const [applications] = useState<TravelerApplication[]>(() => readApplications());

  const hostProjects = useMemo(
    () => projects.filter((p) => p.host === selectedHost),
    [selectedHost]
  );

  const hostProjectIds = useMemo(
    () => new Set(hostProjects.map((p) => p.id)),
    [hostProjects]
  );

  const hostApplications = useMemo(
    () => applications.filter((a) => hostProjectIds.has(a.projectId)),
    [applications, hostProjectIds]
  );

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">
      <section className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-old text-4xl font-bold">Личный кабинет хоста</div>
            <div className="mt-2 text-sm text-black/70">
              Здесь отображаются анкеты путешественников, откликнувшихся на ваши проекты
            </div>
          </div>

          <div className="w-full max-w-sm">
            <label className="text-xs font-medium text-black/70">Хост / площадка</label>
            <select
              value={selectedHost}
              onChange={(e) => setSelectedHost(e.target.value)}
              className="mt-2 w-full rounded-2xl border-2 border-black/20 bg-white/50 px-4 py-3 text-sm"
            >
              {hostNames.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border-2 border-black/10 bg-white/40 p-5">
          <div className="flex items-center gap-2 font-medium">
            <Building2 className="h-4 w-4" />
            {selectedHost}
          </div>
          <div className="mt-2 text-sm text-black/70">
            Проектов: {hostProjects.length} · Откликов: {hostApplications.length}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {hostProjects.map((project) => {
            const projectApplications = hostApplications.filter((a) => a.projectId === project.id);
            return (
              <div key={project.id} className="rounded-3xl border-2 border-black bg-[#1b1b1b] p-5 text-white">
                <div className="font-old text-2xl">{project.title}</div>
                <div className="mt-1 text-sm text-white/70">{project.region}</div>

                {projectApplications.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/75">
                    Пока нет откликов на этот проект
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {projectApplications.map((app) => (
                      <div key={app.id} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black/30">
                            {app.photoDataUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={app.photoDataUrl}
                                alt={app.travelerName}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold">{app.travelerName}</div>
                            <div className="text-xs text-white/70">
                              {app.city || "Город не указан"}
                              {app.age ? ` · ${app.age} лет` : ""}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-sm text-white/90">
                          <span className="font-medium">О себе:</span> {app.about}
                        </div>
                        <div className="mt-2 text-sm text-white/90">
                          <span className="font-medium">Умения:</span> {app.skills}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/20 bg-white/50 px-4 py-2 text-sm font-medium hover:bg-white/70"
          >
            <FolderOpenDot className="h-4 w-4" />
            К проектам
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/20 bg-white/50 px-4 py-2 text-sm font-medium hover:bg-white/70"
          >
            <Users className="h-4 w-4" />
            Режим путешественника
          </Link>
        </div>
      </section>
    </div>
  );
}

