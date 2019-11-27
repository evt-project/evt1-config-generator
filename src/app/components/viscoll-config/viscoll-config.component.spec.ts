import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViscollConfigComponent } from './viscoll-config.component';

describe('ViscollConfigComponent', () => {
  let component: ViscollConfigComponent;
  let fixture: ComponentFixture<ViscollConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViscollConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViscollConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
