"use client"; // Error components must be Client Components
import "./components/chat.scss";

// import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO make css for the error
  // TODO offer sending error to a reporting service
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__body">
          <ul className="chat-display">
            <pre className="post__text">{error.message}</pre>
          </ul>
        </div>
        <div>
          <form>
            <input type="text" name="message" id="chat-input" maxLength={20} />
            <button type="submit" onClick={() => reset()}>
              Try Again
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
