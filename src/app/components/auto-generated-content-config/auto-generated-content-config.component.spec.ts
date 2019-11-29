import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGeneratedContentConfigComponent } from './auto-generated-content-config.component';

describe('AutoGeneratedContentConfigComponent', () => {
  let component: AutoGeneratedContentConfigComponent;
  let fixture: ComponentFixture<AutoGeneratedContentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoGeneratedContentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGeneratedContentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
