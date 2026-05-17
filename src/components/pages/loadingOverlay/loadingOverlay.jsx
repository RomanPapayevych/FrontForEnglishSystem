const LoadingOverlay = ({isVisible}) => {
    if(!isVisible) return null;

    return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner" />
        <p>Please wait…</p>
      </div>
    </div>
  );
}
export default LoadingOverlay;