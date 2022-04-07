import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {
  debounce,
  dimensions,
  getPageHeightInPx,
  getScrollInPercentageAsDecimal,
  getViewportHeightInPx,
  position,
  throttle,
} from './minimap-utils';

describe('Minimap Utils', () => {
  let oldInnerHtml: string;

  beforeEach(() => {
    oldInnerHtml = document.body.innerHTML;
  });

  afterEach(() => {
    document.body.innerHTML = oldInnerHtml;
    sinon.restore();
  });

  it('should get the viewport height in pixels', () => {
    viewport.set(1024, 768);
    expect(getViewportHeightInPx()).toBe(768);
  });

  it('should get the page height in pixels', () => {
    document.body.innerHTML = `<div style="height: 5000px"></div>`;
    expect(getPageHeightInPx()).toBe(5000);
  });

  it('should get the position of an element relative to the whole page', () => {
    document.body.innerHTML = `<div style="position: absolute; top: 200px; left: 300px" id="element">Element</div>`;
    expect(position(document.getElementById('element')!)).toEqual({ left: 300, top: 200 });
  });

  it('should get the position of an element relative to a parent element', () => {
    document.body.innerHTML = `
      <div style="position: relative; top: 200px; left: 300px" id="element-parent">
        <div style="position: absolute; top: 500px; left: 100px" id="element-child">Element</div>
    </div>
    `;
    expect(position(document.getElementById('element-child')!, document.getElementById('element-parent')!)).toEqual({
      left: 100,
      top: 500,
    });
  });

  it('should get the dimensions of an element', () => {
    document.body.innerHTML = `<div style="width: 100px; height: 200px" id="element">Element</div>`;
    expect(dimensions(document.getElementById('element')!)).toEqual({ width: 100, height: 200 });
  });

  it('should get the scroll position in percentage as decimal', () => {
    viewport.set(1000, 1000);
    document.body.innerHTML = `<div style="width: 100%; height: 11000px">Content</div>`;
    window.scrollTo(0, 1000);
    expect(getScrollInPercentageAsDecimal()).toEqual(0.1);
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
