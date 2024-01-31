import { useEffect, useRef } from "react";

interface IUseIOPaginationMarkerProps {
  callback: () => void;
  observableHTMLDivElement: React.RefObject<HTMLDivElement>;
}

export default function useIntersectionObserver({
  callback,
  observableHTMLDivElement,
}: IUseIOPaginationMarkerProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // removing observer if pagination marker undefined
    if (!observableHTMLDivElement.current) {
      observerRef.current?.disconnect();
      return;
    }

    // InterectionOberver options
    const options = {
      // root: null, // use the viewport as the root
      // rootMargin: '0px', // no margin
      threshold: 1, // 0 means fully out of the viewport, 1 means fully in the viewport
    };

    const handleIntersection: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        // Element is in the viewport
        // console.log("Element is in the viewport:", entry.target);

        callback();
      } else {
        // Element is out of the viewport
        // console.log("Element is out of the viewport:", entry.target);
      }
    };

    // Create an intersection observer with the specified callback and options
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    observerRef.current.observe(observableHTMLDivElement.current);

    // Cleanup the observer when the component is unmounted
    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, [observableHTMLDivElement.current]);
}
