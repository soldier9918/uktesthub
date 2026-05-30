// Server-only GitHub Contents API helper.
// Used by csv-import.functions.ts to commit JSON files directly to main.

const OWNER = "soldier9918";
const REPO = "uktesthub";
const BRANCH = "main";
const API = "https://api.github.com";

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "uktesthub-admin",
  };
}

/** Returns the existing file's content (decoded) and sha, or null if missing. */
export async function getFile(filePath: string): Promise<{ content: string; sha: string } | null> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(filePath)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { content: string; sha: string; encoding: string };
  const content = data.encoding === "base64"
    ? Buffer.from(data.content, "base64").toString("utf8")
    : data.content;
  return { content, sha: data.sha };
}

/** Creates or updates a file at `filePath`. Returns the new commit sha + html_url. */
export async function commitFile(opts: {
  filePath: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<{ commitSha: string; commitUrl: string }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(opts.filePath)}`;
  const body = {
    message: opts.message,
    content: Buffer.from(opts.content, "utf8").toString("base64"),
    branch: BRANCH,
    ...(opts.sha ? { sha: opts.sha } : {}),
  };
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub commit failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as {
    commit: { sha: string; html_url: string };
  };
  return { commitSha: data.commit.sha, commitUrl: data.commit.html_url };
}

export const GITHUB_REPO = { owner: OWNER, repo: REPO, branch: BRANCH };
