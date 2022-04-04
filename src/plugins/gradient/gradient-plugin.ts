import { Minimap, Plugin } from '../../minimap';

import './gradient-plugin.scss';
import { getScrollInPercentageAsDecimal } from '../../utils';

const cssClasses = {
  startGradient: 'minimap-gradient-plugin__start',
  endGradient: 'minimap-gradient-plugin__end',
};

function setStartAndEndGradients(viewportElement: HTMLElement): void {
  if (getScrollInPercentageAsDecimal() > 0) {
    viewportElement.classList.add(cssClasses.startGradient);

    if (getScrollInPercentageAsDecimal() < 1) {
      viewportElement.classList.add(cssClasses.endGradient);
    } else {
      viewportElement.classList.remove(cssClasses.endGradient);
    }
  } else {
    viewportElement.classList.remove(cssClasses.startGradient);
  }
}

export const GradientPlugin: Plugin = {
  init: (minimap: Minimap) => {
    setStartAndEndGradients(minimap.getElements().viewport);
    minimap.on('minimap.scroll', () => setStartAndEndGradients(minimap.getElements().viewport));
  },
};
