const STAGES = [
  {
    key: "submitted",
    label: "Submitted",
    description: "Your listing request has been received.",
  },
  {
    key: "agent_assigned",
    label: "Agent assigned",
    description: "An Asmaan agent has been assigned to your property.",
  },
  {
    key: "visit_scheduled",
    label: "Visit scheduled",
    description: "The agent will visit the property for physical verification.",
  },
  {
    key: "verification_complete",
    label: "Verification complete",
    description: "Property has been inspected and photos collected.",
  },
  {
    key: "admin_review",
    label: "Admin review",
    description: "Your listing is being reviewed before going live.",
  },
  {
    key: "live",
    label: "Live on Asmaan",
    description: "Your property is now visible to buyers and renters.",
  },
];

const STATUS_INDEX = STAGES.reduce((acc, s, i) => {
  acc[s.key] = i;
  return acc;
}, {});

export default function SellerStatusTrail({ currentStatus = "submitted" }) {
  const currentIndex = STATUS_INDEX[currentStatus] ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Listing status</h2>
      <p className="text-sm text-gray-400 mb-8">Track where your property is in the verification process.</p>

      <div className="relative">
        {STAGES.map((stage, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isPending = i > currentIndex;
          const isLast = i === STAGES.length - 1;

          return (
            <div key={stage.key} className="flex gap-4">
              {/* Left column — dot + line */}
              <div className="flex flex-col items-center">
                {/* Dot */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  isDone
                    ? "bg-gray-900 border-gray-900"
                    : isCurrent
                    ? "bg-white border-gray-900"
                    : "bg-white border-gray-200"
                }`}>
                  {isDone ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  )}
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div className={`w-px flex-1 my-1 min-h-[2rem] ${
                    isDone ? "bg-gray-900" : "bg-gray-200"
                  }`} />
                )}
              </div>

              {/* Right column — text */}
              <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                <p className={`text-sm font-semibold leading-none mb-1 mt-1.5 ${
                  isPending ? "text-gray-300" : "text-gray-900"
                }`}>
                  {stage.label}
                  {isCurrent && (
                    <span className="ml-2 text-[10px] font-medium bg-gray-900 text-white px-2 py-0.5 rounded-full align-middle">
                      Current
                    </span>
                  )}
                </p>
                <p className={`text-xs leading-relaxed ${
                  isPending ? "text-gray-300" : "text-gray-400"
                }`}>
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}