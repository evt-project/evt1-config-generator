import { Component, ViewChild } from '@angular/core';
import { ListItemConfig, ListConfig } from 'src/app/evt-config.models';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map, first } from 'rxjs/operators';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entities-lists-config',
  templateUrl: './entities-lists-config.component.html',
  styleUrls: ['./entities-lists-config.component.scss']
})
export class EntitiesListsConfigComponent {
  @ViewChild('listsAccordion', { static: false }) listsAccordion: NgbAccordion;
  public lists$ = this.evtConfigService.configs$.pipe(
    map(configs => configs ? configs.tools.lists : []));

  constructor(private evtConfigService: EvtConfigService) { }

  addAttribute(item: ListItemConfig) {
    if (!item.attributes) {
      item.attributes = [];
    }
    item.attributes.push({ key: '', value: '' });
  }

  removeAttribute(item: ListItemConfig, indexAttr) {
    item.attributes.splice(indexAttr, 1);
  }

  addGroup() {
    this.lists$.pipe(first())
      .subscribe(lists => {
        const newList = {
          groupLabel: '',
          active: true,
          items: []
        };
        this.addItem(newList);
        this.listsAccordion.ngAfterContentChecked = () => {
          this.listsAccordion.expand(this.listsAccordion.panels.last.id);
          this.listsAccordion.ngAfterContentChecked = () => {};
        };
        lists.push(newList);
      });
  }

  removeGroup(index) {
    this.lists$.pipe(first())
      .subscribe(lists => lists.splice(index, 1));
  }

  addItem(list: ListConfig) {
    list.items.push({ tag: '', label: '', active: true });
  }

  removeItem(list: ListConfig, index) {
    list.items.splice(index, 1);
  }
}
