import "./offlinedivider.scss";

export default function OfflineDivider() {
  return (
    <div className="offlineDivider">
      <div className="offlineDivider--lineStart"></div>
      <div className="offlineDivider--text">Offline</div>
      <div className="offlineDivider--lineEnd"></div>
    </div>
  );
}
