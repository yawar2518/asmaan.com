import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { propertyService } from "../../services/api";

const STATUS_OPTIONS = [
  { value: "available", label: "Available", style: "bg-green-50 text-green-700 border-green-200" },
  { value: "sold", label: "Sold", style: "bg-red-50 text-red-700 border-red-200" },
  { value: "rented", label: "Rented", style: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    propertyService.listAll().then(setProperties).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await propertyService.updateStatus(id, status);
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Live properties</h1>
            <p className="text-sm text-gray-400">Update availability status shown to buyers.</p>
          </div>
          <Link to="/admin/queue" className="text-sm font-medium text-gray-900 underline">
            ← Listing queue
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/property/${p.id}`} className="font-medium text-gray-900 hover:underline">
                        {p.title}
                      </Link>
                      <p className="text-xs text-gray-400">{p.area}, {p.city}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">PKR {Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            disabled={busyId === p.id}
                            onClick={() => handleStatusChange(p.id, opt.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-opacity disabled:opacity-40 ${
                              p.status === opt.value ? opt.style : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
