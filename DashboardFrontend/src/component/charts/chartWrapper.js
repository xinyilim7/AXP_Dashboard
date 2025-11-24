// Wrapper for common chart logic (loading, errors)
import "../dashboardLayout";

export function ChartWrapper({
  title,
  loading,
  error,
  children,
  headerActions,
  icon,
}) {
  //1. Error State
  if (error) {
    return (
      <div className="chart-error">
        <h3 className="chart-title error">{title}</h3>
        <p className="chart-message">Data Error: Could not load data.</p>
        <p className="chart-error-detail">{error}</p>
      </div>
    );
  }
  //2. Loading state
  if (loading) {
    return (
      <div className="chart-loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading {title}</p>
      </div>
    );
  }
  //3. Success State
  return (
    <div className="chart-wrapper">
      <div className="flex justify-between items-center mb-4">
        <div className="chart-title-container">
          {icon}
          <h3 className="chart-title">{title}</h3>
        </div>
        <div className="chart-actions">{headerActions}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default ChartWrapper;
