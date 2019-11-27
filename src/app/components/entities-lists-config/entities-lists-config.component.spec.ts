import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesListsConfigComponent } from './entities-lists-config.component';

describe('EntitiesListsConfigComponent', () => {
  let component: EntitiesListsConfigComponent;
  let fixture: ComponentFixture<EntitiesListsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitiesListsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesListsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
