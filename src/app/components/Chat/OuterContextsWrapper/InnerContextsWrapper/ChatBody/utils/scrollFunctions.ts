// returns true if element is scrolled to the bottom otherwise returns false
export function isScrolledBottom(element: HTMLDivElement) {
  if (!element) return false;

  return (
    Math.abs(
      element.scrollHeight - (element.scrollTop + element.clientHeight)
    ) <= 1
  );
}

// returns true if element is scrolled to the bottom otherwise returns false
export function isScrolledTop(element: HTMLDivElement) {
  if (!element) return;
  return element.scrollTop <= 1;
}
