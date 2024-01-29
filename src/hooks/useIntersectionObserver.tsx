import { useEffect, useRef, useState } from "react";

interface IUseIntersectionObserverElement {
  elementRef: HTMLElement;
  callbackOnIntersect: (args: any) => void;
  args: any;
}
export default function useIntersectionObserver(
  element: IUseIntersectionObserverElement
) {
  // IntersectionObserver instance reference
  const observerRef = useRef<IntersectionObserver | null>(null);
  // dynamic list of elements to oberve
  const [elementsList, setElementsList] = useState<
    IUseIntersectionObserverElement[]
  >([]);

  // initializing observer
  useEffect(() => {
    const options = {
      // root: null, // use the viewport as the root
      // rootMargin: '0px', // no margin
      threshold: 0.8, // 0 means fully out of the viewport, 1 means fully in the viewport
    };

    // custom handler. Manages cases for unread messages and pagination marker
    const handleIntersection: IntersectionObserverCallback = (
      entries,
      observer
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is in the viewport
          // removing observer from the element
          observerRef.current?.unobserve(entry.target);

          // running callback for the intersecting element
          const intersectingElement = elementsList.find(
            (item) => item.elementRef === entry.target
          );
          intersectingElement?.callbackOnIntersect(intersectingElement.args);
          // removing intersecting element from the list
          setElementsList(
            elementsList.filter((item) => item.elementRef !== entry.target)
          );

          // console.log("between: ", unreadMessagesRefsArray.current.length);

          // updating status for the message as being read
          // dispatch({
          //   type: "setMessageAsRead",
          //   room_id: activeRoom,
          //   msgID: entry.target.id,
          // });

          // TODO add db call to update lastaccess. use entry.time to debounce DB requests
        }
        // else {
        //   // Element is out of the viewport
        //   console.log("Element is out of the viewport:", entry.target);
        // }
      });
    };

    // Create an intersection observer with the specified callback and options
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Cleanup the observer when the component is unmounted
    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, []);

  // refreshing observed elements
  useEffect(() => {
    // TODO add cutoff for unnecessary check on elementsList reduction?
    elementsList.forEach((listEl) => {
      if (!listEl.elementRef || !observerRef.current) return;
      // checking if element is already being observed
      if (
        !observerRef.current
          .takeRecords()
          .some((entry) => entry.target === listEl.elementRef)
      ) {
        observerRef.current.observe(listEl.elementRef);
      }
    });
  }, [elementsList.length]);

  // checking if element is new
  const isNewElement =
    elementsList.findIndex(
      (observedElement) => observedElement.elementRef === element.elementRef
    ) === -1;
  // element already exists in the array
  if (!isNewElement) return;
  // adding new array element to observe
  setElementsList([...elementsList, element]);
}
