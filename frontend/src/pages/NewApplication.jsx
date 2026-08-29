import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

export default function NewApplication() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ company: "", role: "", status: "applied", appliedDate: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and role are required.");
      return;
    }

    setSaving(true);
    try {
      const created = await api.createApplication(form, token);
      navigate(`/applications/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="main" style={{ maxWidth: 560 }}>
        <Link to="/" className="btn-text" style={{ display: "inline-block", marginBottom: 20 }}>
          ← Back to dashboard
        </Link>
        <h1>Add an application</h1>
        <div className="panel" style={{ marginTop: 20 }}>
          {error && <div className="form-banner error">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="appliedDate">Date applied</label>
              <input id="appliedDate" type="date" value={form.appliedDate} onChange={update("appliedDate")} />
            </div>
            <div className="field">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                placeholder="Anything worth remembering — referral, key requirements, interview prep…"
                value={form.notes}
                onChange={update("notes")}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
