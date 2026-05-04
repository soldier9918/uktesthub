import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminSettings = {
  hide_ads_globally: boolean;
  preview_without_ads: boolean;
  adsense_client_id: string;
  default_meta_description: string;
  default_og_image: string;
};

const DEFAULTS: AdminSettings = {
  hide_ads_globally: false,
  preview_without_ads: false,
  adsense_client_id: "",
  default_meta_description: "",
  default_og_image: "",
};

let cache: AdminSettings | null = null;
let inflight: Promise<AdminSettings> | null = null;

export async function loadAdminSettings(force = false): Promise<AdminSettings> {
  if (cache && !force) return cache;
  if (inflight && !force) return inflight;
  inflight = (async () => {
    const { data } = await supabase.from("admin_settings").select("key,value");
    const out: AdminSettings = { ...DEFAULTS };
    for (const row of data ?? []) {
      const k = row.key as keyof AdminSettings;
      if (k in out) (out as Record<string, unknown>)[k] = row.value as unknown;
    }
    cache = out;
    return out;
  })();
  return inflight;
}

export function invalidateAdminSettings() {
  cache = null;
  inflight = null;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(cache);
  useEffect(() => {
    let cancelled = false;
    loadAdminSettings().then((s) => {
      if (!cancelled) setSettings(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return settings;
}
