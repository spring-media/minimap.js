<div align="center">
    <h1>Minimap.js</h1>
    <p>A minimap for web pages.</p>
    <p>
      <img alt="Version" src="https://img.shields.io/badge/version-1.0.0--beta.0-blue.svg" />
      <img src="https://img.shields.io/badge/node-14-blue.svg"  alt="Node 14"/>
    </p>
</div>

## Installation

```bash
npm install @weltn24/minimap.js
```

## Usage

```ts
import { Minimap } from '@weltn24/minimap.js';

const minimap = new Minimap({
  elements: [
    {
      selector: 'p',
      classes: ['minimap-paragraph-class'],
      render(element: HTMLElement): string {
        return element.innerText;
      },
    },
  ],
});

minimap.render();
```

You also need to add the following stylesheets to your HTML file:

```html
<link rel="stylesheet" href="minimap.css" />
```

```html
<link rel="stylesheet" href="themes/default-theme.css" />
```

## Theming

In case you want to use a different layout, you can use the `theme` option. When doing so, it is not necessary anymore to add the `default-theme.css` file to your HTML file. Instead, you need to provide your own styles.

```ts
new Minimap({
  theme: 'custom-theme',
});
```

In a custom theme all selectors from `minimap.css` can be used to style the minimap elements. Take a look at the `default-theme.css` file for an example.

## Development

```bash
npm run dev
```

Open http://localhost:3000/ in your browser.

The development server uses the `index.html` file from the root directory.

## API

### constructor

```ts
constructor(options?: MinimapOptions)
```

Creates a new minimap. See [MinimapOptions](#MinimapOptions) for details.

### render

```ts
render();
```

Renders the minimap.

### destroy

```ts
destroy();
```

Destroys the minimap.

### getElements

```ts
getElements();
```

Returns all HTML elements of the minimap.

### on

```ts
on(event: MinimapEvent, callback: VoidFunction)()
```

Registers event listeners. `MinimapEvent` is a union of all possible events:

- `minimap.scroll`

#### MinimapOptions

```ts
elements?: ElementConfig[];
staticElements?: HTMLElement[];
pageContainer?: HTMLElement;
theme?: string;
```

- `elements`: An array of HTML elements from the page which should be rendered in the minimap.
- `staticElements`: An array of HTML elements that should be rendered in the minimap. In contrast to `elements`, static elements are always rendered as they are not selecting anything from the page.
- `pageContainer`: The container of the page (default is `document.body`).
- `theme`: The theme of the minimap (default theme is used if not set).

---

##### ElementConfig

```ts
selector: string;
imageUrl?: string;
backgroundColor?: string;
classes?: string[];
childElements?: ElementConfig[];
render?(element: HTMLElement): string;
condition?(element: HTMLElement): boolean;
```

`selector: string`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
    },
  ],
});
```

Defines which elements of the page should be shown in the minimap.

`imageUrl: string`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
      imageUrl: 'https://www.example.com/image.png',
    },
  ],
});
```

The selected element will be rendered as an image when `imageUrl` is set.

`backgroundColor: string`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
      backgroundColor: '#fff',
    },
  ],
});
```

The selected element will be rendered with the defined background color.

`classes: string[]`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
      classes: ['some-class', 'another-class'],
    },
  ],
});
```

The selected element will be rendered with the defined class(es).

`childElements: ElementConfig[]`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
      childElements: [
        {
          selector: 'p',
        },
      ],
    },
  ],
});
```

The selected element and all selected child elements will be rendered in the minimap.

`render(element: HTMLElement): string`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
      render(element: HTMLElement): string {
        return element.innerText;
      },
    },
  ],
});
```

The `render` method is called for each selected element. It can be used e.g. for extracting the inner text of an element.

`condition(element: HTMLElement): boolean`:

```ts
new Minimap({
  elements: [
    {
      selector: 'div',
      condition(element: HTMLElement): boolean {
        return element.hasChildNodes();
      },
    },
  ],
});
```

The `condition` method is called for each selected element. It can be used e.g. to filter out elements that do not have child nodes.

## Contribution

See [Contribution Guide](/CONTRIBUTING.md).
