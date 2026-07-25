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

export type Database = {
  public: {
    Tables: {
      releases: {
        Row: Release;
        Insert: ReleaseInsert;
        Update: ReleaseUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
