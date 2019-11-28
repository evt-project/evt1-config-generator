import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConfigComponent } from './search-config.component';

describe('SearchConfigComponent', () => {
  let component: SearchConfigComponent;
  let fixture: ComponentFixture<SearchConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
