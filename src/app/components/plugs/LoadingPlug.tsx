import "../chat.scss";

export default function LoadingPlug() {
  // TODO add loading animation
  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__body">
          <ul className="chat-display">
            <li className="post__text">Loading...</li>
          </ul>
        </div>
        <div>
          <form>
            <input type="text" name="message" id="chat-input" maxLength={20} />
            <button type="submit" disabled>
              Loading
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
