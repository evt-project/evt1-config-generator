import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFormatConfigComponent } from './data-format-config.component';

describe('DataFormatConfigComponent', () => {
  let component: DataFormatConfigComponent;
  let fixture: ComponentFixture<DataFormatConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFormatConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFormatConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
