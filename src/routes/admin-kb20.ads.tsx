import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { invalidateAdSlots, loadAdSlots, type AdSlotRow } from "@/lib/admin/ad-slots";
import { invalidateAdminSettings, loadAdminSettings, type AdminSettings } from "@/lib/admin/settings";
import { logAdminAction } from "@/lib/admin/audit";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-kb20/ads")({
  head: () => ({
    meta: [
      { title: "AdSense Manager — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <AdsManager />
    </AdminGate>
  ),
});

function AdsManager() {
  const [slots, setSlots] = useState<AdSlotRow[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [s, set] = await Promise.all([loadAdSlots(true), loadAdminSettings(true)]);
    setSlots(s);
    setSettings(set);
    setLoading(false);
  };
  useEffect(() => {
    void load();
  }, []);

  const updateSlot = async (key: string, patch: Partial<AdSlotRow>) => {
    setSlots((prev) => prev.map((s) => (s.slot_key === key ? { ...s, ...patch } : s)));
    const { error } = await supabase
      .from("ad_slots")
      .update(patch as never)
      .eq("slot_key", key);
    if (error) {
      toast.error(error.message);
    } else {
      invalidateAdSlots();
      await logAdminAction("ads.slot.update", key, patch as Record<string, unknown>);
    }
  };

  const updateSetting = async <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    const { error } = await supabase
      .from("public_settings")
      .upsert([{ key: key as string, value: value as never }]);
    if (error) {
      toast.error(error.message);
    } else {
      invalidateAdminSettings();
      await logAdminAction("ads.setting.update", String(key), { value });
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">AdSense Manager</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Toggle individual ad slots, set the AdSense slot IDs, and preview the site without ads.
      </p>

      {settings && (
        <section className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold">Global controls</h2>
          <div className="mt-3 space-y-3">
            <Toggle
              label="Hide all ads sitewide"
              description="Use during AdSense review or to clean the layout temporarily."
              checked={settings.hide_ads_globally}
              onChange={(v) => updateSetting("hide_ads_globally", v)}
            />
            <Toggle
              label="Preview without ads"
              description="Renders the layout exactly as users see it but suppresses ad calls."
              checked={settings.preview_without_ads}
              onChange={(v) => updateSetting("preview_without_ads", v)}
            />
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                AdSense client ID (ca-pub-XXXXXXXXXXXXXXXX)
              </div>
              <Input
                value={settings.adsense_client_id}
                onChange={(e) => setSettings({ ...settings, adsense_client_id: e.target.value })}
                onBlur={() => updateSetting("adsense_client_id", settings.adsense_client_id)}
                placeholder="ca-pub-…"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Note: the live publisher ID is also configurable via the VITE_ADSENSE_CLIENT_ID
                build env var. This DB value is informational until ads are switched on.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Ad slots</h2>
        {loading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {slots.map((s) => (
              <li key={s.slot_key} className="py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.label}</span>
                      <Badge variant="outline">{s.size ?? "—"}</Badge>
                      {s.enabled ? (
                        <Badge className="bg-emerald-600 text-white">enabled</Badge>
                      ) : (
                        <Badge variant="secondary">disabled</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <code>{s.slot_key}</code> · {s.placement}
                    </div>
                  </div>
                  <Switch
                    checked={s.enabled}
                    onCheckedChange={(v) => updateSlot(s.slot_key, { enabled: v })}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={s.ad_slot_id ?? ""}
                    onChange={(e) =>
                      setSlots((prev) =>
                        prev.map((row) =>
                          row.slot_key === s.slot_key
                            ? { ...row, ad_slot_id: e.target.value }
                            : row,
                        ),
                      )
                    }
                    onBlur={() => updateSlot(s.slot_key, { ad_slot_id: s.ad_slot_id })}
                    placeholder="data-ad-slot ID"
                    className="max-w-xs font-mono text-xs"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
          Pass <code>slotKey="header-leaderboard"</code> (etc.) to the <code>AdSlot</code>{" "}
          component to use the values configured here.
        </p>
      </section>

      <section className="mt-6">
        <Button asChild variant="outline">
          <Link to="/">Open site preview →</Link>
        </Button>
      </section>
    </main>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
