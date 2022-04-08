import {
  createElement,
  debounce,
  dimensions,
  getPageHeightInPx,
  getScrollInPercentageAsDecimal,
  getViewportHeightInPx,
  position,
  throttle,
} from './utils';

import './styles/component/minimap.css';

export type MinimapOptions = {
  pageContainer?: HTMLElement;
  staticElements?: HTMLElement[];
  dynamicElements?: ElementConfig[];
  theme?: string;
  plugins?: Plugin[];
};

export type Plugin = {
  init: (minimap: Minimap) => void;
};

export type ElementConfig = {
  selector: string;
  imageUrl?: string;
  backgroundColor?: string;
  classes?: string[];
  childElements?: ElementConfig[];
  render?(element: HTMLElement): string;
  condition?(element: HTMLElement): boolean;
};

const htmlTemplates = {
  minimap: '<div class="minimap"></div>',
  viewport: '<div class="minimap__viewport"></div>',
  content: '<div class="minimap__content"></div>',
  dragContainer: '<div class="minimap__drag-container"></div>',
  element: '<div class="minimap__element"></div>',
};

const cssClasses = {
  loading: 'minimap--is-loading',
};

export class Minimap {
  private readonly minimapRootElement: HTMLElement;
  private readonly minimapViewportElement: HTMLElement;
  private readonly minimapContentElement: HTMLElement;
  private readonly minimapDragElement: HTMLElement;
  private readonly pageContainerElement: HTMLElement;
  private scaleFactor: number;
  private viewportContainerScrollFactor: number;
  private contentContainerScrollFactor: number;

  constructor(private readonly options: MinimapOptions = {}) {
    this.pageContainerElement = options.pageContainer || document.body;
    this.minimapContentElement = createElement(htmlTemplates.content);
    this.minimapDragElement = createElement(htmlTemplates.dragContainer);
    this.scaleFactor = 1;
    this.contentContainerScrollFactor = 1;
    this.viewportContainerScrollFactor = 1;

    const viewportElement = createElement(htmlTemplates.viewport);
    viewportElement.appendChild(this.minimapContentElement);
    viewportElement.appendChild(this.minimapDragElement);
    this.minimapViewportElement = viewportElement;

    this.minimapRootElement = createElement(htmlTemplates.minimap);
    this.minimapRootElement.appendChild(this.minimapViewportElement);
  }

  public render(): Minimap {
    this.initPlugins();
    this.setTheme();
    this.addToDom();
    this.renderContent();
    this.onDragStart();
    this.onScroll();
    this.onPageContainerResize();
    this.onWindowResize();

    return this;
  }

  public on(event: string, callback: VoidFunction): void {
    this.minimapRootElement.addEventListener(event, callback);
  }

  public getElements() {
    return {
      minimap: this.minimapRootElement,
      viewport: this.minimapViewportElement,
      content: this.minimapContentElement,
      dragContainer: this.minimapDragElement,
    };
  }

  public destroy(): void {
    this.minimapRootElement.remove();
  }

  private addToDom() {
    document.body.appendChild(this.minimapRootElement);
  }

  private setTheme(): void {
    this.minimapRootElement.classList.add(this.options.theme ?? 'minimap-default-theme');
  }

  private renderContent(): void {
    this.setLoadingClass();
    this.updateFactors();
    this.setContentHeight();
    this.setMaxViewportHeight();
    this.setDragElementPosition();
    this.setDragElementHeight();
    this.setContentPosition();
    this.cleanElements();
    this.renderElements();
    this.hideLoadingSpinner();
  }

  // We need to restrict the viewport height for the case where the content within the minimap is smaller than the minimap height.
  // Otherwise, the drag container could be scrolled until the end of the minimap.
  private setMaxViewportHeight() {
    this.minimapViewportElement.style.maxHeight = `${this.minimapContentElement.offsetHeight}px`;
  }

  private setContentHeight() {
    this.minimapContentElement.style.height = `${getPageHeightInPx() * this.scaleFactor}px`;
  }

  private setLoadingClass(): void {
    this.minimapRootElement.classList.add(cssClasses.loading);
  }

  private hideLoadingSpinner(): void {
    this.minimapRootElement.classList.remove(cssClasses.loading);
  }

  private renderElements(): void {
    this.minimapContentElement.append(...(this.options.staticElements ?? []), ...this.getDynamicElements());
  }

  private cleanElements(): void {
    this.minimapContentElement.innerHTML = '';
  }

  private onWindowResize(): void {
    window.addEventListener(
      'resize',
      debounce(() => {
        this.renderContent();
      }),
    );
  }

  private updateFactors(): void {
    this.scaleFactor = this.minimapRootElement.clientWidth / this.pageContainerElement.clientWidth;
    this.viewportContainerScrollFactor =
      (getPageHeightInPx() - getViewportHeightInPx()) /
      (this.minimapViewportElement.offsetHeight - this.minimapDragElement.clientHeight);
    this.contentContainerScrollFactor = getPageHeightInPx() / this.minimapContentElement.offsetHeight;
  }

  private onScroll(): void {
    window.addEventListener(
      'scroll',
      throttle(() => {
        this.dispatchScrollEvent();
        this.setDragElementPosition();
        this.setContentPosition();
      }),
    );
  }

  private dispatchScrollEvent(): void {
    this.minimapRootElement.dispatchEvent(new CustomEvent('minimap.scroll'));
  }

  private setDragElementHeight(): void {
    this.minimapDragElement.style.height = `${getViewportHeightInPx() * this.scaleFactor}px`;
  }

  private setDragElementPosition(): void {
    const marginTopInPx = window.scrollY / this.viewportContainerScrollFactor;

    this.minimapDragElement.style.transform = `translateY(${marginTopInPx}px)`;
  }

  private setContentPosition(): void {
    this.minimapContentElement.style.transform = `translateY(-${this.getContentElementTranslateYValue()}px)`;
  }

  private getContentElementTranslateYValue(): number {
    return Math.abs(
      getScrollInPercentageAsDecimal() *
        (this.minimapViewportElement.clientHeight - this.minimapContentElement.offsetHeight),
    );
  }

  private onPageContainerResize(): void {
    const observer = new ResizeObserver(
      debounce((): void => {
        this.renderContent();
      }),
    );

    observer.observe(this.pageContainerElement);
  }

  private onDragStart(): void {
    this.minimapViewportElement.addEventListener('mousedown', (event: MouseEvent): void => {
      const leftMouseButton = 0;

      if (event.button === leftMouseButton) {
        const isViewportClick = event.target !== this.minimapDragElement;

        if (isViewportClick) {
          this.updateScrollPositionOnViewportClick(event);
        }

        window.addEventListener('mousemove', this.updateScrollPositionOnDragMove);
        window.addEventListener('mouseup', (): void => {
          window.removeEventListener('mousemove', this.updateScrollPositionOnDragMove);
        });
      }
    });
  }

  private updateScrollPositionOnViewportClick = (event: MouseEvent): void => {
    const centeredDistance = this.getCenteredDistanceToTopOfPageInPx(event);
    const scrollYPosition =
      (this.getContentElementTranslateYValue() + centeredDistance) * this.contentContainerScrollFactor;

    window.scrollTo({ top: scrollYPosition });
  };

  private updateScrollPositionOnDragMove = (event: MouseEvent): void => {
    const centeredDistance = this.getCenteredDistanceToTopOfPageInPx(event);
    const scrollYPosition = centeredDistance * this.viewportContainerScrollFactor;

    window.scrollTo({ top: scrollYPosition });
  };

  private getCenteredDistanceToTopOfPageInPx(event: MouseEvent): number {
    const distanceBetweenClickPositionAndTopOfPageInPx = event.pageY - position(this.minimapViewportElement).top;

    return distanceBetweenClickPositionAndTopOfPageInPx - this.minimapDragElement.clientHeight / 2;
  }

  private getDynamicElements(): HTMLElement[] {
    const { dynamicElements = [] } = this.options;
    const fullHeightContainerScrollFactor = this.minimapContentElement.clientHeight / getPageHeightInPx();

    return dynamicElements.reduce((previousElements: HTMLElement[], elementConfig: ElementConfig) => {
      return [...previousElements, ...this.createElements(elementConfig, fullHeightContainerScrollFactor)];
    }, []);
  }

  private createElements(
    {
      backgroundColor,
      childElements = [],
      classes,
      condition,
      imageUrl,
      render: renderElement,
      selector,
    }: ElementConfig,
    fullHeightContainerScrollFactor: number,
    parentElement: HTMLElement = document.body,
  ): HTMLElement[] {
    const isAtLeastOnePixelHigh = (element: HTMLElement) => element.getBoundingClientRect().height > 0;
    const conditionIsMet = (element: HTMLElement) => condition?.(element) ?? true;

    return Array.from(parentElement.querySelectorAll<HTMLElement>(selector))
      .filter(isAtLeastOnePixelHigh)
      .filter(conditionIsMet)
      .reduce((previousElements: HTMLElement[], element: HTMLElement) => {
        const { height, width } = dimensions(element);
        const { left, top } = position(element, this.pageContainerElement);
        const newElement = createElement(htmlTemplates.element);

        newElement.style.top = `${top * fullHeightContainerScrollFactor}px`;
        newElement.style.left = `${left * fullHeightContainerScrollFactor}px`;
        newElement.style.width = `${width * fullHeightContainerScrollFactor}px`;
        newElement.style.height = `${height * fullHeightContainerScrollFactor}px`;

        if (backgroundColor) {
          newElement.style.backgroundColor = backgroundColor;
        }

        if (classes) {
          newElement.classList.add(...classes);
        }

        if (renderElement) {
          newElement.innerHTML = renderElement(element);
        }

        if (imageUrl) {
          const image = document.createElement('img');
          image.setAttribute('src', imageUrl);
          newElement.appendChild(image);
        }

        const renderedChildElements: HTMLElement[] = childElements.reduce(
          (previousChildElements: HTMLElement[], childElementConfig: ElementConfig) => {
            return [
              ...previousChildElements,
              ...this.createElements(childElementConfig, fullHeightContainerScrollFactor, element),
            ];
          },
          [],
        );

        return [...previousElements, newElement, ...renderedChildElements];
      }, []);
  }

  private initPlugins() {
    this.options.plugins?.forEach((plugin: Plugin) => {
      plugin.init(this);
    });
  }
}
