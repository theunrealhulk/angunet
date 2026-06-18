import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificator } from './email-verificator';

describe('EmailVerificator', () => {
  let component: EmailVerificator;
  let fixture: ComponentFixture<EmailVerificator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificator],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
