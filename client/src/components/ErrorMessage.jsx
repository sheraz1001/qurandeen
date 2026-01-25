function ErrorMessage({ message, onRetry, title, showContent = true }) {
  return (
    <div className="error-container">
      <div className="error-icon">🔄</div>
      <h3>{title || 'Loading content'}</h3>
      <p>{message || 'Please wait while we load the content for you.'}</p>
      {showContent && (
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '1rem' }}>
          This page contains Islamic content from QuranDeen. If loading takes too long, please refresh the page.
        </p>
      )}
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Reload Content
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
