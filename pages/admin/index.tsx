import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface DashboardData {
  totalItems: number;
  itemsLast24h: number;
  totalSources: number;
  enabledSources: number;
  failedRunsLast24h: number;
  duplicateRate: number;
  degradedSources: Array<{ id: string; name: string; consecutiveFailures: number }>;
  recentRuns: Array<{
    id: string;
    startedAt: string;
    finishedAt: string | null;
    status: string;
    stats: Record<string, number> | null;
    errors: Array<{ source: string; error: string }> | null;
  }>;
}

interface Source {
  id: string;
  name: string;
  type: string;
  url: string;
  trustTier: string;
  enabled: boolean;
  tags: string[];
  _count: { items: number };
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "sources" | "runs">("dashboard");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  function headers() {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async function login() {
    setAuthenticated(true);
    loadData();
  }

  async function loadData() {
    setLoading(true);
    try {
      const [dashRes, srcRes] = await Promise.all([
        fetch("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/sources", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (dashRes.ok) setDashboard(await dashRes.json());
      if (srcRes.ok) setSources(await srcRes.json());
    } catch (e) {
      console.error("Failed to load admin data:", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (authenticated) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, tab]);

  async function toggleSource(id: string, enabled: boolean) {
    await fetch(`/api/admin/sources/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ enabled: !enabled }),
    });
    loadData();
  }


  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  async function triggerIngestion(sourceId?: string) {
    setIngestStatus("Triggering ingestion...");
    try {
      const res = await fetch("/api/admin/ingest-manual", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(sourceId ? { sourceId } : {}),
      });
      const data = await res.json();
      if (res.ok) {
        setIngestStatus(`✅ ${data.message} (run ID: ${data.runId || "N/A"})`);
      } else {
        setIngestStatus(`❌ Error: ${data.error || data.message}`);
      }
    } catch (e: any) {
      setIngestStatus(`❌ Exception: ${e.message}`);
    }
    loadData();
  }

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - AI News Hub</title>
        </Head>
        <Header />
        <div className="login">
          <div className="login__card">
            <h2 className="login__title">🔐 Admin Access</h2>
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

  return (
    <>
      <Head>
        <title>Admin - AI News Hub</title>
      </Head>
      <Header />

      <div className="admin">

        <div className="admin__header">
          <h1 className="admin__title">Admin Dashboard</h1>
          <button className="btn btn--primary" onClick={() => triggerIngestion()}>
            🚀 Trigger Manual Ingestion
          </button>
        </div>
        {ingestStatus && (
          <div style={{ margin: "20px 0", minHeight: 30 }}>
            <pre>{ingestStatus}</pre>
          </div>
        )}

        <nav className="admin__nav">
          <a
            href="#"
            className={tab === "dashboard" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); setTab("dashboard"); }}
          >
            📊 Dashboard
          </a>
          <a
            href="#"
            className={tab === "sources" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); setTab("sources"); }}
          >
            📡 Sources
          </a>
          <a
            href="#"
            className={tab === "runs" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); setTab("runs"); }}
          >
            🔄 Ingestion Runs
          </a>
        </nav>

        {loading && <p>Loading...</p>}

        {/* Dashboard Tab */}
        {tab === "dashboard" && dashboard && (
          <>
            <div className="admin__stats">
              <div className="stat-card">
                <div className="stat-card__value">{dashboard.totalItems}</div>
                <div className="stat-card__label">Total Items</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">{dashboard.itemsLast24h}</div>
                <div className="stat-card__label">Items (24h)</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">
                  {dashboard.enabledSources}/{dashboard.totalSources}
                </div>
                <div className="stat-card__label">Active Sources</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">{dashboard.failedRunsLast24h}</div>
                <div className="stat-card__label">Failed Runs (24h)</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">{dashboard.duplicateRate}%</div>
                <div className="stat-card__label">Duplicate Rate</div>
              </div>
            </div>

            {dashboard.degradedSources.length > 0 && (
              <div className="mb-2">
                <h3>⚠️ Degraded Sources</h3>
                <ul>
                  {dashboard.degradedSources.map((s) => (
                    <li key={s.id}>
                      {s.name} - {s.consecutiveFailures} consecutive failures
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Sources Tab */}
        {tab === "sources" && (
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
                  <td>{s.trustTier.replace("_", " ")}</td>
                  <td>{s._count.items}</td>
                  <td>
                    <span
                      className={`status-dot status-dot--${s.enabled ? "success" : "failed"}`}
                    />{" "}
                    {s.enabled ? "Active" : "Disabled"}
                  </td>
                  <td>
                    <button
                      className={`btn ${s.enabled ? "btn--warning" : "btn--success"}`}
                      onClick={() => toggleSource(s.id, s.enabled)}
                    >
                      {s.enabled ? "Disable" : "Enable"}
                    </button>{" "}
                    <button
                      className="btn btn--outline"
                      onClick={() => triggerIngestion(s.id)}
                    >
                      Re-run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Runs Tab */}
        {tab === "runs" && dashboard?.recentRuns && (
          <table className="admin__table">
            <thead>
              <tr>
                <th>Started</th>
                <th>Status</th>
                <th>Stats</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentRuns.map((run) => (
                <tr key={run.id}>
                  <td>{new Date(run.startedAt).toLocaleString()}</td>
                  <td>
                    <span className={`status-dot status-dot--${run.status}`} />{" "}
                    {run.status}
                  </td>
                  <td>
                    {run.stats ? (
                      <small>
                        Total: {run.stats.total}, Inserted: {run.stats.inserted},
                        Dupes: {run.stats.duplicates}, Errors: {run.stats.errors}
                      </small>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {run.errors && Array.isArray(run.errors) ? (
                      <details>
                        <summary>{run.errors.length} error(s)</summary>
                        <ul>
                          {run.errors.map((e, i) => (
                            <li key={i}>
                              <strong>{e.source}</strong>: {e.error}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
