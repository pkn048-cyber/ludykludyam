"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Users, FolderOpenDot } from "lucide-react";
import { projects } from "@/data/projects";
import { readApplications } from "@/lib/applications";

export default function AdminDashboard() {
  const [applications] = useState(() => readApplications());

  const projectMap = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    []
  );

  const communications = useMemo(() => {
    return applications.map((application) => {
      const project = projectMap.get(application.projectId);
      return {
        id: application.id,
        projectTitle: project?.title ?? application.projectTitle,
        host: project?.host ?? "Хост",
        traveler: application.travelerName,
        messages: [
          {
            by: "Путешественник",
            text: `Здравствуйте! Я хочу откликнуться на проект "${project?.title ?? application.projectTitle}". ${application.about}`,
          },
          {
            by: "Хост",
            text: "Спасибо за отклик. Мы изучаем анкету и свяжемся с вами в чате.",
          },
        ],
      };
    });
  }, [applications, projectMap]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-black/10 bg-white/50 p-4">
          <div className="text-xs text-black/60">Проектов на платформе</div>
          <div className="mt-1 text-3xl font-semibold">{projects.length}</div>
        </div>
        <div className="rounded-3xl border-2 border-black/10 bg-white/50 p-4">
          <div className="text-xs text-black/60">Путешественников в откликах</div>
          <div className="mt-1 text-3xl font-semibold">{applications.length}</div>
        </div>
        <div className="rounded-3xl border-2 border-black/10 bg-white/50 p-4">
          <div className="text-xs text-black/60">Диалогов</div>
          <div className="mt-1 text-3xl font-semibold">{communications.length}</div>
        </div>
      </div>

      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border-2 border-black/10 bg-white/50 px-3 py-1 text-sm font-medium">
          <FolderOpenDot className="h-4 w-4" />
          Все проекты
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-3xl border-2 border-black bg-[#1b1b1b] p-4 text-white">
              <div className="font-old text-2xl">{project.title}</div>
              <div className="mt-1 text-sm text-white/70">
                {project.region} · {project.host}
              </div>
              <div className="mt-3 text-sm text-white/85">{project.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border-2 border-black/10 bg-white/50 px-3 py-1 text-sm font-medium">
          <Users className="h-4 w-4" />
          Все откликнувшиеся путешественники
        </div>
        {applications.length === 0 ? (
          <div className="rounded-3xl border-2 border-black/10 bg-white/50 p-5 text-sm text-black/70">
            Пока нет откликов путешественников
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {applications.map((application) => (
              <div key={application.id} className="rounded-3xl border-2 border-black/10 bg-white/60 p-4">
                <div className="font-semibold">{application.travelerName}</div>
                <div className="text-xs text-black/60">
                  {application.city || "Город не указан"} {application.age ? `· ${application.age} лет` : ""}
                </div>
                <div className="mt-2 text-sm text-black/80">
                  <span className="font-medium">Проект:</span> {application.projectTitle}
                </div>
                <div className="mt-2 text-sm text-black/80">
                  <span className="font-medium">Умения:</span> {application.skills}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border-2 border-black/10 bg-white/50 px-3 py-1 text-sm font-medium">
          <MessageCircle className="h-4 w-4" />
          Коммуникация на платформе
        </div>
        {communications.length === 0 ? (
          <div className="rounded-3xl border-2 border-black/10 bg-white/50 p-5 text-sm text-black/70">
            Диалогов пока нет
          </div>
        ) : (
          <div className="space-y-4">
            {communications.map((chat) => (
              <div key={chat.id} className="rounded-3xl border-2 border-black/10 bg-white/60 p-4">
                <div className="text-sm text-black/60">
                  Проект: <span className="font-medium text-black/90">{chat.projectTitle}</span> · Хост:{" "}
                  <span className="font-medium text-black/90">{chat.host}</span> · Путешественник:{" "}
                  <span className="font-medium text-black/90">{chat.traveler}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {chat.messages.map((message, idx) => (
                    <div key={idx} className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-sm">
                      <span className="font-medium">{message.by}:</span> {message.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

