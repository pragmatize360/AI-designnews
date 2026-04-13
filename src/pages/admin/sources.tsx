import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";

interface Source {
  id: string;
  name: string;
  type: string;
  url: string;
  trustTier: string;
  enabled: boolean;
  tags: string[];
  htmlSelector: string | null;
  channelId: string | null;
  consecutiveFailures: number;
  _count: { items: number };
}

const EMPTY_FORM = {
  name: "",
  type: "rss",
  url: "",
  trustTier: "reputed_press",
  enabled: true,
  tags: "",
  htmlSelector: "",
  channelId: "",
};

export default function SourcesPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState("");

  const headers = useCallback(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const loadSources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setSources(await res.json());
    } catch (e) {
      console.error("Failed to load sources:", e);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (authenticated) loadSources();
  }, [authenticated, loadSources]);

  async function login() {
    // Validate token by making a test request
    try {
      const res = await fetch("/api/admin/sources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Invalid admin token");
        return;
      }
      setSources(await res.json());
      setAuthenticated(true);
    } catch {
      setError("Failed to connect");
    }
  }

  function startEdit(src: Source) {
    setEditingId(src.id);
    setForm({
      name: src.name,
      type: src.type,
      url: src.url,
      trustTier: src.trustTier,
      enabled: src.enabled,
      tags: src.tags.join(", "),
      htmlSelector: src.htmlSelector || "",
      channelId: src.channelId || "",
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
  }

  async function saveSource() {
    setError("");
    if (!form.name || !form.url) {
      setError("Name and URL are required");
      return;
    }

    const body = {
      name: form.name,
      type: form.type,
      url: form.url,
      trustTier: form.trustTier,
      enabled: form.enabled,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      htmlSelector: form.htmlSelector || null,
      channelId: form.channelId || null,
    };

    try {
      const url = editingId
        ? `/api/admin/sources/${editingId}`
        : "/api/admin/sources";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      cancelEdit();
      loadSources();
    } catch (e) {
      setError("Network error");
      console.error(e);
    }
  }

  async function deleteSource(id: string) {
    if (!confirm("Delete this source and all its items?")) return;
    try {
      await fetch(`/api/admin/sources/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      loadSources();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  }

  async function toggleEnabled(src: Source) {
    try {
      const res = await fetch(`/api/admin/sources/${src.id}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ enabled: !src.enabled }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to toggle source");
      }
    } catch (e) {
      setError("Network error toggling source");
      console.error("Toggle failed:", e);
    }
    loadSources();
  }

  // ── Login screen ──────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Source Management - AI News Hub</title>
        </Head>
        <Header />
        <div className="login">
          <div className="login__card">
            <h2 className="login__title">🔐 Admin Access</h2>
            {error && (
              <p style={{ color: "var(--danger)", marginBottom: "0.5rem" }}>{error}</p>
            )}
            <div className="form-group">
              <label>Admin Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token..."
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            <button
              className="btn btn--primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
              onClick={login}
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Main page ─────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Source Management - AI News Hub</title>
      </Head>
      <Header />

      <div className="admin">
        <div className="admin__header">
          <h1 className="admin__title">📡 Source Management</h1>
          <div>
            <Link href="/admin" className="btn btn--outline" style={{ marginRight: "0.5rem" }}>
              ← Dashboard
            </Link>
            <button
              className="btn btn--primary"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY_FORM });
                setError("");
                // Scroll to form
                document.getElementById("source-form")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              + Add Source
            </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}

        {/* Source table */}
        <table className="admin__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Trust Tier</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.name}</strong>
                  <br />
                  <small style={{ color: "var(--text-muted)" }}>{s.url}</small>
                </td>
                <td>{s.type}</td>
                <td>{s.trustTier.replace(/_/g, " ")}</td>
                <td>{s._count.items}</td>
                <td>
                  <span
                    className={`status-dot status-dot--${s.enabled ? "success" : "failed"}`}
                  />{" "}
                  {s.enabled ? "Active" : "Disabled"}
                  {s.consecutiveFailures > 0 && (
                    <small style={{ color: "var(--danger)", display: "block" }}>
                      {s.consecutiveFailures} failure(s)
                    </small>
                  )}
                </td>
                <td>
                  <button
                    className={`btn ${s.enabled ? "btn--warning" : "btn--success"}`}
                    onClick={() => toggleEnabled(s)}
                  >
                    {s.enabled ? "Disable" : "Enable"}
                  </button>{" "}
                  <button className="btn btn--outline" onClick={() => startEdit(s)}>
                    Edit
                  </button>{" "}
                  <button className="btn btn--danger" onClick={() => deleteSource(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add / Edit form */}
        <div id="source-form" style={{ marginTop: "2rem" }}>
          <h2>{editingId ? "Edit Source" : "Add New Source"}</h2>

          {error && (
            <p style={{ color: "var(--danger)", marginBottom: "0.5rem" }}>{error}</p>
          )}

          <div style={{ display: "grid", gap: "1rem", maxWidth: 600 }}>
            <div className="form-group">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. OpenAI Blog"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="rss">RSS</option>
                <option value="youtube">YouTube</option>
                <option value="html">HTML</option>
                <option value="api">API</option>
              </select>
            </div>

            <div className="form-group">
              <label>URL</label>
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com/feed.xml"
              />
            </div>

            <div className="form-group">
              <label>Trust Tier</label>
              <select
                value={form.trustTier}
                onChange={(e) => setForm({ ...form, trustTier: e.target.value })}
              >
                <option value="official_vendor">Official Vendor</option>
                <option value="reputed_press">Reputed Press</option>
                <option value="research_university">Research / University</option>
                <option value="influencer">Creator / Influencer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="ai, research, llm"
              />
            </div>

            {form.type === "youtube" && (
              <div className="form-group">
                <label>YouTube Channel ID</label>
                <input
                  value={form.channelId}
                  onChange={(e) => setForm({ ...form, channelId: e.target.value })}
                  placeholder="UCxxxxxxx"
                />
              </div>
            )}

            {form.type === "html" && (
              <div className="form-group">
                <label>HTML Selector Config (JSON)</label>
                <textarea
                  value={form.htmlSelector}
                  onChange={(e) => setForm({ ...form, htmlSelector: e.target.value })}
                  placeholder='{"articleContainer":"article","title":"h2 a","link":"h2 a"}'
                  rows={3}
                />
              </div>
            )}

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                />
                Enabled
              </label>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn--primary" onClick={saveSource}>
                {editingId ? "Update Source" : "Create Source"}
              </button>
              {editingId && (
                <button className="btn btn--outline" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
