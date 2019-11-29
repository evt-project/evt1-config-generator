import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edition-main-data',
  templateUrl: './edition-main-data.component.html',
  styleUrls: ['./edition-main-data.component.scss']
})
export class EditionMainDataComponent implements AfterViewInit {
  @ViewChild('editionMainInfo', { static: true }) editionMainInfoElement: ElementRef;
  @ViewChild('editionLevels', { static: true }) editionLevelsElement: ElementRef;
  @ViewChild('additionalContent', { static: true }) additionalContentElement: ElementRef;
  @ViewChild('dataFormat', { static: true }) dataFormatElement: ElementRef;

  @Output() sectionInit: EventEmitter<EditionMainDataInit> = new EventEmitter();

  ngAfterViewInit() {
    this.sectionInit.emit({
      editionMainInfoOffset: this.editionMainInfoElement.nativeElement.offsetTop,
      editionLevelsOffset: this.editionLevelsElement.nativeElement.offsetTop,
      additionalContentOffset: this.additionalContentElement.nativeElement.offsetTop,
      dataFormatOffset: this.dataFormatElement.nativeElement.offsetTop,
    });
  }
}

export interface EditionMainDataInit {
  editionMainInfoOffset: number;
  editionLevelsOffset: number;
  additionalContentOffset: number;
  dataFormatOffset: number;
}
