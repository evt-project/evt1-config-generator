import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedConfigsComponent } from './advanced-configs.component';

describe('AdvancedConfigsComponent', () => {
  let component: AdvancedConfigsComponent;
  let fixture: ComponentFixture<AdvancedConfigsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedConfigsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
