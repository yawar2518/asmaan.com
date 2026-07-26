export default function PropertyDetailCard({ property }) {
  if (!property) return null;

  const {
    title,
    price,
    category,
    status: availabilityStatus,
    area_sqft,
    bedrooms,
    bathrooms,
    floor,
    furnishing,
    property_age,
    description,
    is_verified,
    area: area_name,
    city,
    contact_name,
    contact_phone,
  } = property;

  const STATUS_LABELS = { available: 'Available', sold: 'Sold', rented: 'Rented' };
  const STATUS_STYLES = {
    available: 'border-green-200 bg-green-50 text-green-700',
    sold: 'border-red-200 bg-red-50 text-red-700',
    rented: 'border-amber-200 bg-amber-50 text-amber-700',
  };

  const whatsappLink = contact_phone
    ? `https://wa.me/92${contact_phone}?text=Hi, I saw your property listing on Asmaan.com — ${title}`
    : null;

  const categoryLabel = {
    buy: "For Sale",
    rent: "For Rent",
    plot: "Plot",
  }[category] || category;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl mx-auto space-y-6">

      {/* Title + verified badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{title}</h1>
          {is_verified && (
            <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-white bg-gray-900 px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">
          {[area_name, city].filter(Boolean).join(", ")}
        </p>
      </div>

      {/* Price + category */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            PKR {Number(price).toLocaleString()}
          </p>
          <span className="text-xs text-gray-400">{categoryLabel}</span>
        </div>

        {/* Availability badge */}
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${STATUS_STYLES[availabilityStatus] || STATUS_STYLES.available}`}>
          {STATUS_LABELS[availabilityStatus] || "Available"}
        </span>
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Area", value: area_sqft ? `${area_sqft} sq. ft.` : null },
          { label: "Bedrooms", value: bedrooms ?? null },
          { label: "Bathrooms", value: bathrooms ?? null },
          { label: "Floor", value: floor || null },
          { label: "Age", value: property_age != null ? `${property_age} yrs` : null },
          {
            label: "Furnishing",
            value: furnishing
              ? { unfurnished: "Unfurnished", semi_furnished: "Semi-Furnished", fully_furnished: "Fully Furnished" }[furnishing] || furnishing
              : null,
          },
          { label: "Type", value: categoryLabel },
        ]
          .filter((s) => s.value !== null && s.value !== undefined)
          .map((spec) => (
            <div key={spec.label} className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">{spec.label}</p>
              <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
            </div>
          ))}
      </div>

      {/* Description */}
      {description && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
            About this property
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Contact section */}
      <div className="border-t border-gray-100 pt-5 space-y-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Contact seller
        </p>
        {contact_name && (
          <p className="text-sm font-medium text-gray-900">{contact_name}</p>
        )}

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe5d] transition-colors"
          >
            {/* WhatsApp icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.826L.057 23.428a.5.5 0 00.609.61l5.652-1.479A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.378l-.36-.214-3.733.977.997-3.645-.235-.374A9.845 9.845 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.467 0 9.882 4.415 9.882 9.882 0 5.467-4.415 9.882-9.882 9.882z"/>
            </svg>
            Inquire on WhatsApp
          </a>
        ) : (
          <div className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 text-sm text-center">
            No contact info available
          </div>
        )}
      </div>

    </div>
  );
}