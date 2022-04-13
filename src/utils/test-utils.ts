import { createElement } from './minimap-utils';

export function renderHtml({ pageHeightInPx }: { pageHeightInPx: number }): HTMLElement {
  const newElement = createElement(`
    <div style="height: ${pageHeightInPx}px; display: flex; flex-direction: column">
      <header style="height: 10%; margin: 0 50px">Header</header>
      <main style="flex-grow: 1; width: 50%">
        <p>Text 1</p>
        <p>Text 2</p>
        <p>Text 3</p>
      </main>
      <footer style="height: 10%">Footer</footer>
    </div>
  `);
  document.body.appendChild(newElement);

  return newElement;
}

export async function scrollToYPosition(position: number): Promise<void> {
  const scrollEventListener = waitForScrollEvent();
  window.scrollTo(0, position);
  await scrollEventListener;
}

export function waitForScrollEvent(): Promise<void> {
  return new Promise<void>((resolve) => {
    window.addEventListener('scroll', () => resolve(), { once: true });
  });
}
