import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoetryConfigComponent } from './poetry-config.component';

describe('PoetryConfigComponent', () => {
  let component: PoetryConfigComponent;
  let fixture: ComponentFixture<PoetryConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoetryConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoetryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
