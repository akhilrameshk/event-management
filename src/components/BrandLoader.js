// Full-screen animated loader (server-renderable, pure CSS, so it shows before any JavaScript runs).
export default function BrandLoader({ id, route = false }) {
  return (
    <div id={id} className={`ee-loader${route ? ' route' : ''}`} role="status" aria-live="polite" aria-label="Loading">
      <div className="ee-mark">
        <span className="ee-ring" />
        <span className="ee-ring2" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ee-shield" src="/shield.png" alt="" width="58" height="65" />
      </div>
      <div className="ee-name">Elegant Events</div>
      <div className="ee-bar"><i /></div>
    </div>
  );
}
