const LABELS = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

export default function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{LABELS[status] || status}</span>;
}
