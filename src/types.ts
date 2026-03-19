export type Lead = {
  id: string;
  category_title: string;
  created_at: string;
  location_text: string;
  scheduled_at?: string | null;
  description: string;
  contact: { phone: string };
};

export type WorkStatus = "new" | "in_progress";


