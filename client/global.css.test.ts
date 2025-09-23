import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

function readCSS() {
  const cssPath = path.resolve(__dirname, 'global.css');
  return fs.readFileSync(cssPath, 'utf8');
}

describe('global.css', () => {
  it('defines key CSS variables for dark mode', () => {
    const css = readCSS();
    const required = [
      '--background',
      '--foreground',
      '--glass-bg',
      '--glass-border',
      '--ring',
    ];
    required.forEach(token => {
      expect(css).toContain(token);
    });
  });

  it('includes body background radial-gradient and Inter font', () => {
    const css = readCSS();
    expect(css).toContain('radial-gradient');
    expect(css).toContain('font-family: "Inter", sans-serif');
  });

  it('declares Bebas Neue for headings', () => {
    const css = readCSS();
    expect(css).toContain('font-family: "Bebas Neue", sans-serif');
  });

  it('includes gradient and glass utility classes', () => {
    const css = readCSS();
    expect(css).toContain('.text-gradient');
    expect(css).toContain('.glass-card');
    expect(css).toContain('linear-gradient');
  });

  it('sets custom scrollbar styles', () => {
    const css = readCSS();
    expect(css).toContain('::-webkit-scrollbar');
    expect(css).toContain('::-webkit-scrollbar-thumb');
  });
});
