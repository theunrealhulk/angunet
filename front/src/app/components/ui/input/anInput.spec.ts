import { ComponentFixture, TestBed } from '@angular/core/testing';

import { anInput } from './anInput';

describe('Input', () => {
  let component: anInput;
  let fixture: ComponentFixture<anInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [anInput],
    }).compileComponents();

    fixture = TestBed.createComponent(anInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
