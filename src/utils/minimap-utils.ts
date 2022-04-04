export type Position = { top: number; left: number; width: number; height: number };

export function getViewportHeightInPx(): number {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

export function getPageHeightInPx(): number {
  const { body } = document;
  const html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

export function position(element: HTMLElement, parentElement?: HTMLElement): Position {
  const pos: Position = { left: 0, top: 0, width: 0, height: 0 };

  if (parentElement) {
    const thisPos = position(element);
    const parentPos = position(parentElement);

    pos.left = thisPos.left - parentPos.left;
    pos.top = thisPos.top - parentPos.top;
    pos.width = thisPos.width;
    pos.height = thisPos.height;
  } else {
    const rect = element.getBoundingClientRect();

    pos.top = rect.top + window.scrollY;
    pos.left = rect.left + window.scrollX;
    pos.width = rect.width;
    pos.height = rect.height;
  }

  return pos;
}

export function getScrollInPercentageAsDecimal(): number {
  const pageHeight = getPageHeightInPx();
  const viewportHeight = getViewportHeightInPx();
  const scrollYPos = window.scrollY;

  return scrollYPos / (pageHeight - viewportHeight);
}

export function debounce(callback: VoidFunction, timeoutInMs = 300): VoidFunction {
  let timeoutId: number | null = null;

  return (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback();
      timeoutId = null;
    }, timeoutInMs);
  };
}

export function throttle(callback: VoidFunction, timeoutInMs = 50): VoidFunction {
  let timeoutId: number | null = null;

  return (): void => {
    if (timeoutId) {
      return;
    }

    timeoutId = window.setTimeout(() => {
      callback();
      timeoutId = null;
    }, timeoutInMs);
  };
}

/**
 * HTML as string to (first) Node. Useful when receiving HTML via ajax.
 *
 * example:
 * const html: string = "<div>1</div><span>2</span>";
 * const node: HTMLElement = create(html);
 * node.textContent === "1"; // not "2"
 */
export function create(html: string): HTMLElement {
  const element: HTMLElement = document.createElement('div');
  element.innerHTML = html.trim();

  return element.firstElementChild as HTMLElement;
}
