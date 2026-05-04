import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdSlotRow = {
  id: string;
  slot_key: string;
  label: string;
  placement: string;
  size: string | null;
  ad_slot_id: string | null;
  enabled: boolean;
  updated_at: string;
};

let cache: AdSlotRow[] | null = null;
let inflight: Promise<AdSlotRow[]> | null = null;

export async function loadAdSlots(force = false): Promise<AdSlotRow[]> {
  if (cache && !force) return cache;
  if (inflight && !force) return inflight;
  inflight = (async () => {
    const { data } = await supabase
      .from("ad_slots")
      .select("*")
      .order("slot_key", { ascending: true });
    cache = (data ?? []) as AdSlotRow[];
    return cache;
  })();
  return inflight;
}

export function invalidateAdSlots() {
  cache = null;
  inflight = null;
}

export function useAdSlot(slotKey: string) {
  const [slot, setSlot] = useState<AdSlotRow | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadAdSlots().then((rows) => {
      if (!cancelled) setSlot(rows.find((r) => r.slot_key === slotKey) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slotKey]);
  return slot;
}
