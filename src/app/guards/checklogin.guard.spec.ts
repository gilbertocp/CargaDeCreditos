import { TestBed } from '@angular/core/testing';

import { CheckloginGuard } from './checklogin.guard';

describe('CheckloginGuard', () => {
  let guard: CheckloginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckloginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
