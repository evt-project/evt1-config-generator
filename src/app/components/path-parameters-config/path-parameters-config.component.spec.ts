import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathParametersConfigComponent } from './path-parameters-config.component';

describe('PathParametersConfigComponent', () => {
  let component: PathParametersConfigComponent;
  let fixture: ComponentFixture<PathParametersConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathParametersConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathParametersConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
