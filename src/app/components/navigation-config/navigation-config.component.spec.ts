import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationConfigComponent } from './navigation-config.component';

describe('NavigationConfigComponent', () => {
  let component: NavigationConfigComponent;
  let fixture: ComponentFixture<NavigationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
