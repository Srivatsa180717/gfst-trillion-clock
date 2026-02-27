import { STATES_DATA } from "@/lib/data";
import { StateDetailClient } from "./StateDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return STATES_DATA.map((s) => ({ code: s.code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const state = STATES_DATA.find((s) => s.code === code.toUpperCase());
  if (!state) return { title: "State Not Found" };
  return {
    title: `${state.name} — GFST Economy Clock`,
    description: `GDP projections and economic data for ${state.name} (${state.code})`,
  };
}

export default async function StatePage({ params }: PageProps) {
  const { code } = await params;
  const state = STATES_DATA.find((s) => s.code === code.toUpperCase());
  if (!state) notFound();
  return <StateDetailClient stateCode={state.code} />;
}
