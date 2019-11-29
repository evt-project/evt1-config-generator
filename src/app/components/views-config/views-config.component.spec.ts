import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsConfigComponent } from './views-config.component';

describe('ViewsConfigComponent', () => {
  let component: ViewsConfigComponent;
  let fixture: ComponentFixture<ViewsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
