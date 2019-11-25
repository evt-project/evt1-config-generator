import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionToolsComponent } from './edition-tools.component';

describe('EditionToolsComponent', () => {
  let component: EditionToolsComponent;
  let fixture: ComponentFixture<EditionToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
