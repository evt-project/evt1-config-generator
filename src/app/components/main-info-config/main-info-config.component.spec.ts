import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInfoConfigComponent } from './main-info-config.component';

describe('MainInfoConfigComponent', () => {
  let component: MainInfoConfigComponent;
  let fixture: ComponentFixture<MainInfoConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainInfoConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainInfoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
