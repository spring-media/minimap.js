// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JasmineDOM from '@testing-library/jasmine-dom/dist';

beforeAll(() => {
  jasmine.getEnv().addMatchers(JasmineDOM);
});
