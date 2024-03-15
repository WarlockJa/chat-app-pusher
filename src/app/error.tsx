"use client"; // Error components must be Client Components
import { format } from "date-fns";
import "./components/Chat/OuterContextsWrapper/InnerContextsWrapper/innercontextswrapper.scss";
import "./error.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO offer sending error to a reporting service
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chatHeader">
          <p className="chatHeader--roomOwnerName">Error</p>
        </div>
        <div className="chat__body">
          <ul className="chatDisplay">
            <li className="post post--left">
              <div className={"post__header post__header--user"}>
                <span className="post__header--name"></span>
                <span className="post__header--time">
                  {format(new Date(), "k:mm")}
                </span>
              </div>
              <div className="post__text">{error.message}</div>
            </li>
          </ul>
        </div>
        <button className="errorButton" onClick={() => reset()}>
          Try Again
        </button>
      </div>
    </div>
  );
}
