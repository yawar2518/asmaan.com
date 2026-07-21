const BEDROOM_OPTIONS = ["Any", "1", "2", "3", "4", "5+"];

export default function FilterBar({ filters, setFilters }) {
  const update = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const clearAll = () =>
    setFilters({ bedrooms: "Any", min_area: "", max_area: "" });

  const hasActive =
    filters.bedrooms !== "Any" || filters.min_area || filters.max_area;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-white border-b border-gray-100 flex-wrap">

      {/* Bedrooms */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Beds</span>
        <div className="flex gap-1">
          {BEDROOM_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update("bedrooms", opt)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                filters.bedrooms === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-gray-200" />

      {/* Area range */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Area (sq.ft)</span>
        <input
          type="number"
          placeholder="Min"
          value={filters.min_area || ""}
          onChange={(e) => update("min_area", e.target.value)}
          className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <span className="text-xs text-gray-300">—</span>
        <input
          type="number"
          placeholder="Max"
          value={filters.max_area || ""}
          onChange={(e) => update("max_area", e.target.value)}
          className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* Clear */}
      {hasActive && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors ml-1"
        >
          Clear
        </button>
      )}
    </div>
  );
}