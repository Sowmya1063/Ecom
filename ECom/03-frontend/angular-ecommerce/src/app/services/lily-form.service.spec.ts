import { TestBed } from '@angular/core/testing';

import { LilyFormService } from './lily-form.service';

describe('LilyFormService', () => {
  let service: LilyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LilyFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
