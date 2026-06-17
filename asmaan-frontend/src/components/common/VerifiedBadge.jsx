export default function VerifiedBadge() {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: '#dcfce7',
      color: '#166534',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
    }}>
      ✓ Verified
    </span>
  )
}