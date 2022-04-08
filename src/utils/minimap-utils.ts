export type Position = { top: number; left: number };
export type Dimensions = { width: number; height: number };

export const THROTTLE_DEFAULT_WAIT_TIME_IN_MS = 50;
export const DEBOUNCE_DEFAULT_WAIT_TIME_IN_MS = 300;

export function getViewportHeightInPx(): number {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

export function getPageHeightInPx(): number {
  const { body } = document;
  const html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

export function dimensions(element: HTMLElement): Dimensions {
  const { width, height } = element.getBoundingClientRect();

  return { width, height };
}

export function position(element: HTMLElement, parentElement?: HTMLElement): Position {
  const pos: Position = { left: 0, top: 0 };

  if (parentElement) {
    const thisPos = position(element);
    const parentPos = position(parentElement);

    pos.left = thisPos.left - parentPos.left;
    pos.top = thisPos.top - parentPos.top;
  } else {
    const rect = element.getBoundingClientRect();

    pos.top = rect.top + window.scrollY;
    pos.left = rect.left + window.scrollX;
  }

  return pos;
}

export function getScrollInPercentageAsDecimal(): number {
  const pageHeight = getPageHeightInPx();
  const viewportHeight = getViewportHeightInPx();
  const scrollYPos = window.scrollY;

  return scrollYPos / (pageHeight - viewportHeight);
}

export function debounce(callback: VoidFunction, waitTimeInMs = DEBOUNCE_DEFAULT_WAIT_TIME_IN_MS): VoidFunction {
  let timeoutId: number | null = null;

  return (): void => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback();
      timeoutId = null;
    }, waitTimeInMs);
  };
}

export function throttle(callback: VoidFunction, waitTimeInMs = THROTTLE_DEFAULT_WAIT_TIME_IN_MS): VoidFunction {
  let timeoutId: number | null = null;

  return (): void => {
    if (timeoutId) {
      return;
    }

    timeoutId = window.setTimeout(() => {
      callback();
      timeoutId = null;
    }, waitTimeInMs);
  };
}

export function createElement(html: string): HTMLElement {
  const element: HTMLElement = document.createElement('div');
  element.innerHTML = html.trim();

  return element.firstElementChild as HTMLElement;
}
