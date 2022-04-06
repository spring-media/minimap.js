import { Minimap } from './minimap';

function renderHtml({ pageHeightInPx }: { pageHeightInPx: number }): void {
  document.body.style.margin = '0';
  document.body.innerHTML = `
      <div style="height: ${pageHeightInPx}px">
        <header style="height: 10%">Header</header>
        <div style="height: 80%">Body</div>
        <footer style="height: 10%">Footer</footer>
      </div>
    `;
}

describe('Minimap with default options', () => {
  beforeEach(() => {
    renderHtml({ pageHeightInPx: 10_000 });
    new Minimap().render();
  });

  it('should use the default theme', () => {
    expect(document.querySelector('.minimap-default-theme')).toBeInTheDocument();
  });
});
