// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JasmineDOM from '@testing-library/jasmine-dom/dist';

beforeAll(() => {
  removeMarginFromPage();
  addMatchers();
});

function addMatchers() {
  // https://github.com/testing-library/jasmine-dom
  jasmine.getEnv().addMatchers(JasmineDOM);
}

function removeMarginFromPage() {
  document.body.style.margin = '0';
}
