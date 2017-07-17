import { Neuro.IOPage } from './app.po';

describe('neuro.io App', () => {
  let page: Neuro.IOPage;

  beforeEach(() => {
    page = new Neuro.IOPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
