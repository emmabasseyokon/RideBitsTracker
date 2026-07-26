"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { sendPushNotification } from "@/lib/push";
import { ENVIRONMENT_LABELS } from "@/lib/status";
import type { Environment, ReleaseStatus } from "@/lib/database.types";

export async function createRelease(
  input: {
    environment: Environment;
    status: ReleaseStatus;
    notes?: string;
  },
  subscriberEndpoint?: string,
) {
  const { data, error } = await supabase
    .from("releases")
    .insert({
      environment: input.environment,
      status: input.status,
      notes: input.notes?.trim() || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  await sendPushNotification(
    `New release ${data.version} created in ${ENVIRONMENT_LABELS[data.environment]}`,
    subscriberEndpoint,
  );
}

export async function updateRelease(
  id: string,
  input: { status: ReleaseStatus; notes?: string; environment?: Environment },
  subscriberEndpoint?: string,
) {
  const { data, error } = await supabase
    .from("releases")
    .update({
      status: input.status,
      notes: input.notes?.trim() || null,
      ...(input.environment ? { environment: input.environment } : {}),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/releases/${id}`);
  const action = input.status === "rolled_back" ? "rolled back" : "updated";
  await sendPushNotification(
    `Release ${data.version} ${action} in ${ENVIRONMENT_LABELS[data.environment]}`,
    subscriberEndpoint,
  );
}

export async function deleteRelease(id: string, subscriberEndpoint?: string) {
  const { data, error } = await supabase
    .from("releases")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/releases/${id}`);
  await sendPushNotification(
    `Release ${data.version} deleted from ${ENVIRONMENT_LABELS[data.environment]}`,
    subscriberEndpoint,
  );
}
