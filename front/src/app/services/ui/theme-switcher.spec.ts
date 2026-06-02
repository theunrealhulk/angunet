import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ThemeSwitcher } from './theme-switcher';

describe('ThemeSwitcher', () => {
  let service: ThemeSwitcher;

  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeSwitcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
