import webpush from "web-push";
import { supabase } from "@/lib/supabase";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webpush.setVapidDetails(
    "mailto:emmabasseyokon@gmail.com",
    publicKey,
    privateKey,
  );
}

export async function sendPushNotification(
  body: string,
  excludeEndpoint?: string,
) {
  if (!publicKey || !privateKey) return;

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*");
  if (!subscriptions) return;

  const payload = JSON.stringify({ title: "RideBits", body });

  await Promise.all(
    subscriptions
      .filter((sub) => sub.endpoint !== excludeEndpoint)
      .map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
          );
        } catch (err) {
          const statusCode = (err as { statusCode?: number }).statusCode;
          if (statusCode === 404 || statusCode === 410) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint);
          }
        }
      }),
  );
}
