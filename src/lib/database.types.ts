export type Environment = "production" | "staging";
export type ReleaseStatus = "in_production" | "rolled_back" | "current_version";

export type Release = {
  id: string;
  environment: Environment;
  status: ReleaseStatus;
  major: number;
  minor: number;
  patch: number;
  version: string;
  notes: string | null;
  created_at: string;
};

export type ReleaseInsert = Pick<Release, "environment" | "status"> &
  Partial<Pick<Release, "notes">>;

export type ReleaseUpdate = Partial<
  Pick<Release, "status" | "notes" | "environment">
>;

export type PushSubscriptionRow = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
};

export type PushSubscriptionInsert = Pick<
  PushSubscriptionRow,
  "endpoint" | "p256dh" | "auth"
>;

export type Database = {
  public: {
    Tables: {
      releases: {
        Row: Release;
        Insert: ReleaseInsert;
        Update: ReleaseUpdate;
        Relationships: [];
      };
      push_subscriptions: {
        Row: PushSubscriptionRow;
        Insert: PushSubscriptionInsert;
        Update: Partial<PushSubscriptionInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
