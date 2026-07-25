import { supabase } from "@/lib/supabase";
import { ReleaseTracker } from "@/components/ReleaseTracker";

export default async function Home() {
  const { data, error } = await supabase
    .from("releases")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ReleaseTracker initialReleases={data ?? []} loadError={error?.message ?? null} />
  );
}
