import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ListConfig, ListItemConfig } from 'src/app/evt-config.models';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { Subscription } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-entities-lists-config',
  templateUrl: './entities-lists-config.component.html',
  styleUrls: ['./entities-lists-config.component.scss']
})
export class EntitiesListsConfigComponent {
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
}
