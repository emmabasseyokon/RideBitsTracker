"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Environment, ReleaseStatus } from "@/lib/database.types";

export async function createRelease(input: {
  environment: Environment;
  status: ReleaseStatus;
  notes?: string;
}) {
  const { error } = await supabase.from("releases").insert({
    environment: input.environment,
    status: input.status,
    notes: input.notes?.trim() || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function updateRelease(
  id: string,
  input: { status: ReleaseStatus; notes?: string },
) {
  const { error } = await supabase
    .from("releases")
    .update({ status: input.status, notes: input.notes?.trim() || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/releases/${id}`);
}

export async function deleteRelease(id: string) {
  const { error } = await supabase.from("releases").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/releases/${id}`);
}
