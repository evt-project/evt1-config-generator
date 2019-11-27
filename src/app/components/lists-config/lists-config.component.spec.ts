import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsConfigComponent } from './lists-config.component';

describe('ListsConfigComponent', () => {
  let component: ListsConfigComponent;
  let fixture: ComponentFixture<ListsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
