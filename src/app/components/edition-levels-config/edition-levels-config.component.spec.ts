import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionLevelsConfigComponent } from './edition-levels-config.component';

describe('EditionLevelsConfigComponent', () => {
  let component: EditionLevelsConfigComponent;
  let fixture: ComponentFixture<EditionLevelsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionLevelsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionLevelsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
