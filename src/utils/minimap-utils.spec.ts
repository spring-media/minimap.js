import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {
  createElement,
  debounce,
  getDimensions,
  getPageHeightInPx,
  getScrollDepthInPercentageAsDecimal,
  getViewportHeightInPx,
  getPosition,
  throttle,
} from './minimap-utils';

function renderHtml(html: string) {
  document.body.appendChild(createElement(`<div id="fixture">${html}</div>`));
}

describe('Minimap Utils', () => {
  afterEach(() => {
    document.getElementById('fixture')?.remove();
    sinon.restore();
  });

  it('should get the viewport height in pixels', () => {
    viewport.set(1024, 768);
    expect(getViewportHeightInPx()).toBe(768);
  });

  it('should get the page height in pixels', () => {
    renderHtml(`<div style="height: 5000px"></div>`);
    expect(getPageHeightInPx()).toBe(5000);
  });

  it('should get the position of an element relative to the whole page', () => {
    renderHtml(`<div style="position: absolute; top: 200px; left: 300px" id="element">Element</div>`);
    expect(getPosition(document.getElementById('element')!)).toEqual({ left: 300, top: 200 });
  });

  it('should get the position of an element relative to a parent element', () => {
    renderHtml(`
      <div style="position: relative; top: 200px; left: 300px" id="element-parent">
        <div style="position: absolute; top: 500px; left: 100px" id="element-child">Element</div>
    </div>
    `);
    expect(getPosition(document.getElementById('element-child')!, document.getElementById('element-parent')!)).toEqual({
      left: 100,
      top: 500,
    });
  });

  it('should get the dimensions of an element', () => {
    renderHtml(`<div style="width: 100px; height: 200px" id="element">Element</div>`);
    expect(getDimensions(document.getElementById('element')!)).toEqual({ width: 100, height: 200 });
  });

  it('should get the scroll depth in percentage as decimal', () => {
    viewport.set(1_000, 1_000);
    renderHtml(`<div style="width: 100%; height: 11000px">Content</div>`);
    window.scrollTo(0, 1_000);
    expect(getScrollDepthInPercentageAsDecimal()).toEqual(0.1);
  });

  it('should debounce calls of a method for a specific time', () => {
    const clock: SinonFakeTimers = sinon.useFakeTimers();
    const spy: SinonSpy = sinon.spy();
    const waitTimeInMs = 100;
    const method = debounce(() => spy(), waitTimeInMs);

    clock.tick(waitTimeInMs - 1);
    method();
    expect(spy.callCount).toBe(0);

    clock.tick(waitTimeInMs - 1);
    method();
    expect(spy.callCount).toBe(0);

    clock.tick(waitTimeInMs);
    expect(spy.callCount).toBe(1);

    clock.restore();
  });

  it('should throttle calls of a method for a specific time', () => {
    const clock: SinonFakeTimers = sinon.useFakeTimers();
    const spy: SinonSpy = sinon.spy();
    const waitTimeInMs = 100;
    const method = throttle(() => spy(), waitTimeInMs);

    method();
    method();
    method();

    clock.tick(waitTimeInMs - 1);
    expect(spy.callCount).toBe(0);

    clock.tick(waitTimeInMs + 1);
    expect(spy.callCount).toBe(1);

    clock.restore();
  });
});
