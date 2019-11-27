import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ListConfig, ListItemConfig } from 'src/app/evt-config.models';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entities-lists-config',
  templateUrl: './entities-lists-config.component.html',
  styleUrls: ['./entities-lists-config.component.scss']
})
export class EntitiesListsConfigComponent implements OnInit, OnDestroy {
  public lists: ListConfig;
  private subscriptions: Subscription[] = [];
  constructor(private evtConfigService: EvtConfigService) { }

  ngOnInit() {
    this.lists = this.evtConfigService.getProperty('lists');
    this.subscriptions.push(
      this.evtConfigService.uploadedConfig
        .subscribe(newConfigs => this.lists = this.evtConfigService.getProperty('lists')));
  }


  addAttribute(item: ListItemConfig) {
    if (!item.attributes) {
      item.attributes = [];
    }
    item.attributes.push({ key: '', value: '' });
  }

  removeAttribute(item: ListItemConfig, indexAttr) {
    item.attributes.splice(indexAttr, 1);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
