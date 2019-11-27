import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListConfig, ListItemConfig } from 'src/app/evt-config.models';

@Component({
  selector: 'app-entities-lists-config',
  templateUrl: './entities-lists-config.component.html',
  styleUrls: ['./entities-lists-config.component.scss']
})
export class EntitiesListsConfigComponent implements OnInit {
  @Input() lists: ListConfig;
  @Output() editLists: EventEmitter<ListConfig> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }


  addAttribute(item: ListItemConfig) {
    if (!item.attributes) {
      item.attributes = [];
    }
    item.attributes.push({ key: '', value: '' });
    this.editLists.emit(this.lists);
  }

  removeAttribute(item: ListItemConfig, indexAttr) {
    item.attributes.splice(indexAttr, 1);
    this.editLists.emit(this.lists);
  }

}
