import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MockOverride = {
  topic_slug: string;
  mock_slug: string;
  disabled: boolean;
};

let cache: Promise<Set<string>> | null = null;

/** Returns set of disabled mock slugs (cached for the session). */
export async function getDisabledMockSlugs(): Promise<Set<string>> {
  if (cache) return cache;
  cache = (async () => {
    const { data } = await supabase
      .from("mock_overrides")
      .select("mock_slug,disabled")
      .eq("disabled", true);
    return new Set((data ?? []).map((r) => (r as { mock_slug: string }).mock_slug));
  })();
  return cache;
}

export function invalidateMockOverridesCache() {
  cache = null;
}

export async function isMockDisabled(slug: string): Promise<boolean> {
  return (await getDisabledMockSlugs()).has(slug);
}

export function useMockOverrides() {
  const [rows, setRows] = useState<MockOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("mock_overrides")
      .select("topic_slug,mock_slug,disabled");
    setRows((data ?? []) as MockOverride[]);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { rows, loading, refresh };
}
