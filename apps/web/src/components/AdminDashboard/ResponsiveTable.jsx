/**
 * Responsive Table Wrapper Component
 * Provides horizontal scrolling on mobile with visual hints
 */
export default function ResponsiveTable({
  children,
  minWidth = "1000px",
  showMobileHint = true,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mobile scroll hint */}
      {showMobileHint && (
        <div className="p-4 border-b border-gray-200 lg:hidden bg-gray-50">
          <p className="text-sm text-gray-600">
            Scroll horizontally to view all columns →
          </p>
        </div>
      )}

      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>{children}</div>
      </div>
    </div>
  );
}
