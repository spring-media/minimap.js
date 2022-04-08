import sinon, { SinonFakeTimers, SinonFakeTimersConfig } from 'sinon';
import { Minimap } from '../../minimap';
import { THROTTLE_DEFAULT_WAIT_TIME_IN_MS } from '../../utils';
import { renderHtml, scrollToYPosition } from '../../utils/test-utils';
import { GradientPlugin } from './gradient-plugin';

describe('Gradient Plugin', () => {
  let minimap: Minimap;
  let fixture: HTMLElement;
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ shouldClearNativeTimers: true } as unknown as Partial<SinonFakeTimersConfig>);
    fixture = renderHtml({ pageHeightInPx: 5_000 });
    viewport.set(1_000, 1_000);
    minimap = new Minimap({ plugins: [GradientPlugin] }).render();
  });

  afterEach(() => {
    clock.restore();
    minimap.destroy();
    fixture.remove();
  });

  it('should not show a start gradient when the page was not scrolled down', async () => {
    expect(minimap.getElements().viewport).not.toHaveClass('minimap-gradient-plugin__start');
  });

  it('should show a start gradient when the page was scrolled down', async () => {
    await scrollToYPosition(1);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);

    expect(minimap.getElements().viewport).toHaveClass('minimap-gradient-plugin__start');
  });

  it('should show an end gradient when the page is not scrolled to the end', async () => {
    expect(minimap.getElements().viewport).toHaveClass('minimap-gradient-plugin__end');
  });

  it('should not show an end gradient when the page is scrolled to the end', async () => {
    await scrollToYPosition(4_000);
    clock.tick(THROTTLE_DEFAULT_WAIT_TIME_IN_MS);

    expect(minimap.getElements().viewport).not.toHaveClass('minimap-gradient-plugin__end');
  });
});
