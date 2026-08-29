import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

export default function ApplicationDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const [aiKind, setAiKind] = useState("email");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .getApplication(id, token)
      .then((data) => {
        setApplication(data);
        setForm(data);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id, token]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    if (!form.company.trim() || !form.role.trim()) {
      setSaveError("Company and role are required.");
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateApplication(id, form, token);
      setApplication(updated);
      setEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this application? This can't be undone.")) return;
    try {
      await api.deleteApplication(id, token);
      navigate("/");
    } catch (err) {
      setLoadError(err.message);
    }
  };

  const handleGenerate = async () => {
    setAiError("");
    setAiLoading(true);
    try {
      const result = await api.draftFollowup(id, aiKind, token);
      setApplication((a) => ({ ...a, aiDraft: result.draft }));
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">Loading application…</div>
      </Layout>
    );
  }

  if (loadError || !application) {
    return (
      <Layout>
        <div className="form-banner error">{loadError || "Application not found."}</div>
        <Link to="/" className="btn-text">
          ← Back to dashboard
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/" className="btn-text" style={{ display: "inline-block", marginBottom: 20 }}>
        ← Back to dashboard
      </Link>

      <div className="detail-header">
        <div>
          <h1>{application.company}</h1>
          <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>{application.role}</p>
        </div>
        <div className="detail-actions">
          <StatusBadge status={application.status} />
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3>Details</h3>

          {!editing ? (
            <div>
              <p>
                <strong>Applied:</strong> {new Date(application.appliedDate).toLocaleDateString()}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>
                <strong>Notes:</strong>
                <br />
                {application.notes || "No notes yet."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} noValidate>
              {saveError && <div className="form-banner error">{saveError}</div>}
              <div className="field">
                <label htmlFor="company">Company</label>
                <input id="company" value={form.company} onChange={update("company")} />
              </div>
              <div className="field">
                <label htmlFor="role">Role</label>
                <input id="role" value={form.role} onChange={update("role")} />
              </div>
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={update("status")}>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" value={form.notes || ""} onChange={update("notes")} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm(application);
                    setEditing(false);
                    setSaveError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="panel">
          <h3>AI follow-up assistant</h3>
          <div className="kind-toggle">
            <button
              className={`filter-chip ${aiKind === "email" ? "active" : ""}`}
              onClick={() => setAiKind("email")}
              type="button"
            >
              Follow-up email
            </button>
            <button
              className={`filter-chip ${aiKind === "resume_notes" ? "active" : ""}`}
              onClick={() => setAiKind("resume_notes")}
              type="button"
            >
              Resume bullets
            </button>
          </div>

          {aiError && <div className="form-banner error">{aiError}</div>}

          <button className="btn btn-primary" onClick={handleGenerate} disabled={aiLoading} style={{ marginBottom: 14 }}>
            {aiLoading ? "Generating…" : "Generate draft"}
          </button>

          <div className="ai-draft-box">
            {application.aiDraft || "No draft yet — generate one above."}
          </div>
        </div>
      </div>
    </Layout>
  );
}
