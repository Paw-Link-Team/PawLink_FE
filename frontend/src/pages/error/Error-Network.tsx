import "./NetworkErrorPage.css";

export default function NetworkErrorPage() {
  const handleRetry = () => {
    window.location.replace("/");
  };

  return (
    <div className="network-error-root">
      <div className="network-error-icon">⚠️</div>

      <h1 className="network-error-title">
        네트워크 연결에 실패했어요
      </h1>

      <p className="network-error-desc">
        인터넷 연결 상태를 확인한 후 다시 시도해주세요.
      </p>

      <button className="network-error-button" onClick={handleRetry}>
        다시 시도
      </button>
    </div>
  );
}
