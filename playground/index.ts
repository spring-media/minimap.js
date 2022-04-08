import { Minimap } from '../src/minimap';
import rectangleSVGUrl from './images/rectangle.svg';

import 'modern-css-reset/dist/reset.css';
import './style.css';
import './gradient-plugin-overrides.css';

const minimap = new Minimap({
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
