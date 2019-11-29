import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edition-tools',
  templateUrl: './edition-tools.component.html',
  styleUrls: ['./edition-tools.component.scss']
})
export class EditionToolsComponent implements AfterViewInit {
  @ViewChild('imageTools', { static: true }) imageToolsElement: ElementRef;
  @ViewChild('navigation', { static: true }) navigationElement: ElementRef;
  @ViewChild('views', { static: true }) viewsElement: ElementRef;
  @ViewChild('prefatoryMatter', { static: true }) prefatoryMatterElement: ElementRef;
  @ViewChild('search', { static: true }) searchElement: ElementRef;
  @ViewChild('viscoll', { static: true }) viscollElement: ElementRef;
  @ViewChild('poetry', { static: true }) poetryElement: ElementRef;
  @ViewChild('listsNE', { static: true }) listsNEElement: ElementRef;

  @Output() sectionInit: EventEmitter<EditionToolsInit> = new EventEmitter();

  ngAfterViewInit() {
    this.sectionInit.emit({
      imageToolsOffset: this.imageToolsElement.nativeElement.offsetTop,
      navigationOffset: this.navigationElement.nativeElement.offsetTop,
      viewsOffset: this.viewsElement.nativeElement.offsetTop,
      prefatoryMatterOffset: this.prefatoryMatterElement.nativeElement.offsetTop,
      searchOffset: this.searchElement.nativeElement.offsetTop,
      viscollOffset: this.viscollElement.nativeElement.offsetTop,
      poetryOffset: this.poetryElement.nativeElement.offsetTop,
      listsNEOffset: this.listsNEElement.nativeElement.offsetTop,
    });
  }
}

export interface EditionToolsInit {
  imageToolsOffset: number;
  navigationOffset: number;
  viewsOffset: number;
  prefatoryMatterOffset: number;
  searchOffset: number;
  viscollOffset: number;
  poetryOffset: number;
  listsNEOffset: number;
}
