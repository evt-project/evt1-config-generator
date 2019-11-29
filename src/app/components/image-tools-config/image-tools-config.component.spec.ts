import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageToolsConfigComponent } from './image-tools-config.component';

describe('ImageToolsConfigComponent', () => {
  let component: ImageToolsConfigComponent;
  let fixture: ComponentFixture<ImageToolsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageToolsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageToolsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
