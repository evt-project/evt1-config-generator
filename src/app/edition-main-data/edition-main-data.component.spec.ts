import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionMainDataComponent } from './edition-main-data.component';

describe('EditionMainDataComponent', () => {
  let component: EditionMainDataComponent;
  let fixture: ComponentFixture<EditionMainDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionMainDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
