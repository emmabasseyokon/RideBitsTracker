import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ReleaseDetails } from "@/components/ReleaseDetails";

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: release, error } = await supabase
    .from("releases")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !release) notFound();

  return <ReleaseDetails release={release} />;
}
