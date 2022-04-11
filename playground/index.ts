import { Minimap } from '../src/minimap';
import squareSVGUrl from './images/square.svg';

import 'modern-css-reset/dist/reset.css';
import './style.css';

const minimap = new Minimap({
  elements: [
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
      imageUrl: squareSVGUrl,
    },
    {
      selector: 'footer',
      classes: ['minimap-footer-class'],
      childElements: [
        {
          selector: 'li',
          imageUrl: squareSVGUrl,
        },
      ],
      render(element: HTMLElement): string {
        return `<div>${element.innerText}</div>`;
      },
    },
  ],
});

minimap.render();
