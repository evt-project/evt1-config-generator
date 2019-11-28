import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefatoryMatterConfigComponent } from './prefatory-matter-config.component';

describe('PrefatoryMatterConfigComponent', () => {
  let component: PrefatoryMatterConfigComponent;
  let fixture: ComponentFixture<PrefatoryMatterConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefatoryMatterConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefatoryMatterConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
