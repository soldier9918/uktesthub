// Server functions for the Blank Options Health admin page.
// Reads + writes the static topic JSON in github main branch.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { commitFile, getFile } from "@/lib/admin/github.server";
import { repairBankBlanks, scanBankForBlankOptionIssues } from "@/lib/admin/blank-options";

async function assertAdmin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin role required");
}

const TopicInput = z.object({ topic: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/) });

/** Repair a single topic JSON and commit the result to github main. */
export const repairTopicBlankOptions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => TopicInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const filePath = `public/mocks/${data.topic}.json`;
    const existing = await getFile(filePath);
    if (!existing) throw new Error(`Topic file not found: ${filePath}`);
    let parsed: { bank?: unknown[] } & Record<string, unknown>;
    try {
      parsed = JSON.parse(existing.content);
    } catch (e) {
      throw new Error(`Could not parse ${filePath}: ${(e as Error).message}`);
    }
    const bank = Array.isArray(parsed.bank) ? parsed.bank : [];
    const before = scanBankForBlankOptionIssues(bank).length;
    const { optionsFixed, optionsRemoved } = repairBankBlanks(bank);
    const after = scanBankForBlankOptionIssues(bank).length;

    if (optionsFixed === 0 && optionsRemoved === 0) {
      return {
        topic: data.topic,
        committed: false,
        message: "No malformed dropdown options found.",
        beforeIssues: before,
        afterIssues: after,
        optionsFixed,
        optionsRemoved,
      };
    }

    const newContent = JSON.stringify(parsed, null, 2) + "\n";
    const commit = await commitFile({
      filePath,
      content: newContent,
      message: `Admin: repair malformed dropdown options in ${data.topic} (${optionsFixed} cleaned, ${optionsRemoved} trailing leaks removed)`,
      sha: existing.sha,
    });
    return {
      topic: data.topic,
      committed: true,
      message: "Committed.",
      beforeIssues: before,
      afterIssues: after,
      optionsFixed,
      optionsRemoved,
      commitSha: commit.commitSha,
      commitUrl: commit.commitUrl,
    };
  });
