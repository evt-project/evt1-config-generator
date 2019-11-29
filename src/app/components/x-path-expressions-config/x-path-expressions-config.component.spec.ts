import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPathExpressionsConfigComponent } from './x-path-expressions-config.component';

describe('XPathExpressionsConfigComponent', () => {
  let component: XPathExpressionsConfigComponent;
  let fixture: ComponentFixture<XPathExpressionsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPathExpressionsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XPathExpressionsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
