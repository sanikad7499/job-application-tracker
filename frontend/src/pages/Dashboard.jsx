import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function Dashboard() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listApplications(token)
      .then((data) => {
        if (!cancelled) setApplications(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const visible = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <h1>Your applications</h1>
          <p>{applications.length} tracked so far</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          + Add application
        </Link>
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-chip ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <div className="loading-state">Loading applications…</div>}

      {!loading && error && <div className="form-banner error">{error}</div>}

      {!loading && !error && visible.length === 0 && (
        <div className="empty-state">
          <h3>Nothing here yet</h3>
          <p>Add your first application to start tracking it.</p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="card-list">
          {visible.map((app) => (
            <Link key={app.id} to={`/applications/${app.id}`} className="app-card">
              <div className="app-card-main">
                <div className="company">{app.company}</div>
                <div className="role">{app.role}</div>
              </div>
              <div className="app-card-meta">
                <span className="app-card-date">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </span>
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
