import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import { Minimap } from './minimap';
import { createElement, THROTTLE_DEFAULT_WAIT_TIME_IN_MS } from './utils';

function renderHtml({ pageHeightInPx }: { pageHeightInPx: number }): HTMLElement {
  const newElement = createElement(`
    <div style="height: ${pageHeightInPx}px">
      <header style="height: 10%">Header</header>
      <main>
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

async function scrollToYPosition(position: number): Promise<void> {
  const scrollEventListener = waitForScrollEvent();
  window.scrollTo(0, position);
  await scrollEventListener;
}

function waitForScrollEvent(): Promise<void> {
  return new Promise<void>((resolve) => {
    window.addEventListener('scroll', () => resolve(), { once: true });
  });
}

describe('Minimap', () => {
  let minimap: Minimap;
  let fixture: HTMLElement;
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    fixture = renderHtml({ pageHeightInPx: 50_000 });
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    viewport.set(1_000 + scrollbarWidth, 1_000);
  });

  afterEach(() => {
    minimap.destroy();
    fixture.remove();
    clock.restore();
  });

  it('should use the default theme by default when not set via options', () => {
    minimap = new Minimap().render();
    expect(document.querySelector('.minimap-default-theme')).toBeInTheDocument();
  });

  it('should render all elements and also their children', () => {
    minimap = new Minimap({
      staticElements: [
        createElement('<div class="minimap-static-element-1">Static Element 1</div>'),
        createElement('<div class="minimap-static-element-2">Static Element 2</div>'),
      ],
      dynamicElements: [
        {
          selector: 'header',
          classes: ['minimap-header-element'],
        },
        {
          selector: 'main',
          childElements: [
            {
              selector: 'p',
              classes: ['minimap-p-element'],
            },
          ],
        },
        {
          selector: 'footer',
          classes: ['minimap-footer-element'],
        },
      ],
    }).render();

    expect(document.querySelector('.minimap-static-element-1')).toBeInTheDocument();
    expect(document.querySelector('.minimap-static-element-2')).toBeInTheDocument();
    expect(document.querySelector('.minimap-static-element-2')).toBeInTheDocument();
    expect(document.querySelector('.minimap-header-element')).toBeInTheDocument();
    expect(document.querySelectorAll('.minimap-p-element').length).toBe(3);
    expect(document.querySelector('.minimap-footer-element')).toBeInTheDocument();
  });

  it('should define the content of a minimap element by a render method', () => {
    minimap = new Minimap({
      dynamicElements: [
        {
          selector: 'p',
          classes: ['minimap-p-element'],
          render(element: HTMLElement): string {
            return element.innerText;
          },
        },
      ],
    }).render();

    const allParagraphElements = document.querySelectorAll('.minimap-p-element');
    expect(allParagraphElements[0]).toHaveTextContent('Text 1');
    expect(allParagraphElements[1]).toHaveTextContent('Text 2');
    expect(allParagraphElements[2]).toHaveTextContent('Text 3');
  });

  it('should render elements when they met a condition', () => {
    minimap = new Minimap({
      dynamicElements: [
        {
          selector: 'p',
          classes: ['minimap-p-element'],
          render(element: HTMLElement): string {
            return element.innerText;
          },
          condition(element: HTMLElement): boolean {
            return ['Text 1', 'Text 3'].includes(element.innerText);
          },
        },
      ],
    }).render();

    const allParagraphElements = document.querySelectorAll('.minimap-p-element');
    expect(allParagraphElements.length).toBe(2);
    expect(allParagraphElements[0]).toHaveTextContent('Text 1');
    expect(allParagraphElements[1]).toHaveTextContent('Text 3');
  });

  it('should set the background color of an element', () => {
    minimap = new Minimap({
      dynamicElements: [
        {
          selector: 'header',
          classes: ['minimap-header-element'],
          backgroundColor: '#fff',
        },
      ],
    }).render();

    expect(document.querySelector('.minimap-header-element')).toHaveStyle('background-color: #fff');
  });

  it('should init plugins', () => {
    const spy: SinonSpy = sinon.spy();
    minimap = new Minimap({
      plugins: [
        {
          init(): void {
            spy();
          },
        },
        {
          init(): void {
            spy();
          },
        },
      ],
    }).render();

    expect(spy.callCount).toBe(2);
  });

  it('should emit throttled scroll events', async () => {
    const spy: SinonSpy = sinon.spy();
    minimap = new Minimap();

    minimap.on('minimap.scroll', spy);
    minimap.render();

    await scrollToYPosition(100);
    await scrollToYPosition(150);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);
    await scrollToYPosition(200);
    await scrollToYPosition(250);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);

    expect(spy.callCount).toBe(2);
  });

  it('should change the position of the minimap content container when scrolled', async () => {
    minimap = new Minimap().render();

    await scrollToYPosition(24_500);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);
    expect(minimap.getElements().content.style.transform).toEqual('translateY(-2000px)');

    await scrollToYPosition(49_000);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);
    expect(minimap.getElements().content.style.transform).toEqual('translateY(-4000px)');
  });

  it('should change the position of the minimap drag container when scrolled', async () => {
    minimap = new Minimap().render();

    await scrollToYPosition(24_500);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);
    expect(minimap.getElements().dragContainer.style.transform).toEqual('translateY(500px)');

    await scrollToYPosition(49_000);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);
    expect(minimap.getElements().dragContainer.style.transform).toEqual('translateY(1000px)');
  });

  it('should scroll to a specific position when clicked within the minimap viewport', async () => {
    const simulateViewportClick = (x: number, y: number) => {
      minimap.getElements().viewport.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: x,
          clientY: y,
        }),
      );
    };
    minimap = new Minimap().render();

    (document.elementFromPoint(950, 600) as HTMLElement).click();

    simulateViewportClick(950, 540);
    await waitForScrollEvent();
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);

    expect(window.scrollY).toBe(24_500);
    expect(minimap.getElements().content.style.transform).toEqual('translateY(-2000px)');
    expect(minimap.getElements().dragContainer.style.transform).toEqual('translateY(500px)');
  });
});
