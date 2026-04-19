import { projects } from "@/data/projects";
import ApplyForm from "./apply-form";

export function generateStaticParams() {
  return projects.map((p) => ({ id: String(p.id) }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ApplyPage({ params }: PageProps) {
  return <ApplyForm params={params} />;
}
