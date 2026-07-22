const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-600",
  agent_assigned: "bg-blue-50 text-blue-700",
  visit_scheduled: "bg-amber-50 text-amber-700",
  visit_completed: "bg-purple-50 text-purple-700",
  under_review: "bg-indigo-50 text-indigo-700",
  live: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  agent_assigned: "Agent Assigned",
  visit_scheduled: "Visit Scheduled",
  visit_completed: "Visit Completed",
  under_review: "Under Review",
  live: "Live",
  rejected: "Rejected",
};

export default function ListingStatusBadge({ status }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
