import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }));
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((item) => String(item.id) === id);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#efeae2] text-[#111111]">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/20 bg-white/35 px-4 py-2 text-sm font-medium hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к списку проектов
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border-2 border-black bg-[#1b1b1b] p-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              {project.workTypes.map((workType) => (
                <span
                  key={workType}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs"
                >
                  {workType}
                </span>
              ))}
              {project.verified ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                  Проверено
                </span>
              ) : (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                  Проверяется
                </span>
              )}
            </div>

            <h1 className="mt-4 font-old text-4xl font-semibold leading-tight">{project.title}</h1>
            <p className="mt-4 text-white/85 leading-7">{project.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-white/85">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {project.region}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {project.dates}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                до {project.seats} человек
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {project.rating}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4">
              <div className="font-semibold text-white">Что нужно делать</div>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                {project.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <Link
                href={`/apply/${project.id}`}
                className="inline-flex rounded-2xl bg-[#d63b2e] px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
              >
                Откликнуться на проект
              </Link>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border-2 border-black bg-[#1b1b1b] p-5 text-white">
              <div className="font-old text-2xl font-semibold">О площадке</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/70">Хост</span>
                  <span className="inline-flex items-center gap-2 font-medium">
                    <Building2 className="h-4 w-4" />
                    {project.host}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/70">Формат</span>
                  <span className="font-medium">{project.format}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/70">Месяцы</span>
                  <span className="font-medium">{project.months.join(", ")}</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 font-medium">Теги</div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-black bg-[#1b1b1b] p-5 text-white">
              <div className="font-old text-xl">Метки доверия</div>
              <div className="mt-3 space-y-2 text-sm text-white/85">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Проверка площадки и контактов
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Общение после отклика
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Единый стандарт условий
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

