import { Minimap } from '../src/minimap';
import { GradientPlugin } from '../src/plugins/gradient/gradient-plugin';
import rectangleSVGUrl from './images/rectangle.svg';

import 'modern-css-reset/dist/reset.css';
import '../src/styles/themes/default-theme.scss';
import './style.scss';
import './gradient-plugin-overrides.scss';

const minimap = new Minimap({
  plugins: [GradientPlugin],
  dynamicElements: [
    {
      selector: 'header',
      classes: ['minimap-header-class'],
      render(element: HTMLElement): string {
        return `<div>${element.innerText}</div>`;
      },
    },
    {
      selector: 'p',
      classes: ['minimap-paragraph-class'],
      render(element: HTMLElement): string {
        return element.innerHTML;
      },
    },
    {
      selector: 'aside',
      imageUrl: rectangleSVGUrl,
    },
    {
      selector: 'footer',
      classes: ['minimap-footer-class'],
      childElements: [
        {
          selector: 'li',
          imageUrl: rectangleSVGUrl,
        },
      ],
      render(element: HTMLElement): string {
        return `<div>${element.innerText}</div>`;
      },
    },
  ],
});

minimap.render();
