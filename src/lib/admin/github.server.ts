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

/** Convert a GitHub HTTP failure into an admin-friendly message.
 *  Never leaks the token or full response bodies. */
function explainGitHubError(status: number, bodyText: string, context: string): Error {
  // Defensive: strip anything that even looks like a bearer token.
  const safeBody = bodyText.replace(/Bearer\s+[^\s"']+/gi, "Bearer ***").slice(0, 400);
  let msg: string;
  switch (status) {
    case 401:
      msg = "GitHub authentication failed. The token is invalid or expired.";
      break;
    case 403:
      if (/rate limit/i.test(safeBody)) {
        msg = "GitHub rate limit reached. Wait a few minutes and try again.";
      } else {
        msg = "GitHub denied the request. The token is missing 'Contents: Read and write' permission for this repo.";
      }
      break;
    case 404:
      if (/branch/i.test(context)) msg = `GitHub branch not found: ${BRANCH}.`;
      else if (/file/i.test(context) || /path/i.test(context)) msg = `GitHub file path not found: ${context.replace(/^[^:]+:\s*/, "")}.`;
      else msg = `GitHub repo not found or no access: ${OWNER}/${REPO}.`;
      break;
    case 409:
    case 422:
      if (/sha/i.test(safeBody) || /does not match/i.test(safeBody)) {
        msg = "GitHub SHA conflict: the file changed in main after preview. Refresh and preview again.";
      } else {
        msg = `GitHub rejected the request (${status}). ${safeBody}`;
      }
      break;
    case 429:
      msg = "GitHub rate limit reached. Wait a few minutes and try again.";
      break;
    default:
      msg = `GitHub error ${status} during ${context}. ${safeBody}`;
  }
  const err = new Error(msg);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err as any).github = { status, context };
  return err;
}

/** Returns the existing file's content (decoded) and sha, or null if missing. */
export async function getFile(filePath: string): Promise<{ content: string; sha: string } | null> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(filePath)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw explainGitHubError(res.status, await res.text(), `getFile ${filePath}`);
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
  if (!res.ok) throw explainGitHubError(res.status, await res.text(), `commitFile ${opts.filePath}`);
  const data = (await res.json()) as {
    commit: { sha: string; html_url: string };
  };
  return { commitSha: data.commit.sha, commitUrl: data.commit.html_url };
}

/** Returns the names of files directly inside `dirPath` on the target branch.
 *  Returns null if the directory does not exist. */
export async function listDir(dirPath: string): Promise<string[] | null> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(dirPath)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw explainGitHubError(res.status, await res.text(), `listDir ${dirPath}`);
  const data = (await res.json()) as Array<{ name: string; type: string }>;
  if (!Array.isArray(data)) return null;
  return data.filter((d) => d.type === "file").map((d) => d.name);
}

/** Diagnostic: verify the configured token has access to the repo, branch
 *  and Contents:write. Returns structured results, never throws. Never
 *  exposes the token. */
export async function testConnection(): Promise<{
  ok: boolean;
  token: { present: boolean };
  repo: { ok: boolean; full: string; error?: string };
  branch: { ok: boolean; name: string; error?: string };
  contentsWrite: { ok: boolean; error?: string };
}> {
  const result = {
    ok: false,
    token: { present: !!process.env.GITHUB_TOKEN },
    repo: { ok: false, full: `${OWNER}/${REPO}` } as { ok: boolean; full: string; error?: string },
    branch: { ok: false, name: BRANCH } as { ok: boolean; name: string; error?: string },
    contentsWrite: { ok: false } as { ok: boolean; error?: string },
  };
  if (!result.token.present) {
    result.repo.error = "GITHUB_TOKEN is not configured.";
    return result;
  }
  try {
    const repoRes = await fetch(`${API}/repos/${OWNER}/${REPO}`, { headers: authHeaders() });
    if (!repoRes.ok) {
      result.repo.error = explainGitHubError(repoRes.status, await repoRes.text(), "repo access").message;
      return result;
    }
    const repoJson = (await repoRes.json()) as {
      permissions?: { push?: boolean; admin?: boolean; maintain?: boolean };
    };
    result.repo.ok = true;
    const canWrite = !!(repoJson.permissions?.push || repoJson.permissions?.admin || repoJson.permissions?.maintain);
    result.contentsWrite.ok = canWrite;
    if (!canWrite) {
      result.contentsWrite.error = "Token lacks Contents: Read and write permission.";
    }

    const branchRes = await fetch(`${API}/repos/${OWNER}/${REPO}/branches/${BRANCH}`, { headers: authHeaders() });
    if (!branchRes.ok) {
      result.branch.error = explainGitHubError(branchRes.status, await branchRes.text(), "branch access").message;
      return result;
    }
    result.branch.ok = true;

    result.ok = result.repo.ok && result.branch.ok && result.contentsWrite.ok;
    return result;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!result.repo.ok) result.repo.error = msg;
    else if (!result.branch.ok) result.branch.error = msg;
    else result.contentsWrite.error = msg;
    return result;
  }
}

export const GITHUB_REPO = { owner: OWNER, repo: REPO, branch: BRANCH };
