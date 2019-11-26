import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditionMainData } from '../evt-config.models';
import { EvtConfigService } from '../services/evt-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edition-main-data',
  templateUrl: './edition-main-data.component.html',
  styleUrls: ['./edition-main-data.component.scss']
})
export class EditionMainDataComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  configs: EditionMainData = {
    index_title: 'CodexViewer',
    badge: true,
    badge_text: '',
    webSite: '',
    imageExt: 'jpg',
    welcomeMsg: '',
    fb_thumb: 'thumb_fb.jpg',
    edition_array: [],
    edition_level_selector: true,
    translation: false
  };

  supportConfigs = {
  };

  availableEditionLevel = {
    Diplomatic: true,
    Interpretative: true
  };
  constructor(private evtConfigService: EvtConfigService) {
    this.initConfigs();
  }

  ngOnInit() {
    this.subscription = this.evtConfigService.getUploadedConfigEmitter()
      .subscribe(newConfigs => this.initConfigs());
  }

  initConfigs() {
    for (const key in this.configs) {
      if (this.configs.hasOwnProperty(key)) {
        this.configs[key] = this.evtConfigService.getProperty(key);
      }
    }
    for (const key in this.supportConfigs) {
      if (this.supportConfigs.hasOwnProperty(key)) {
        this.supportConfigs[key] = this.evtConfigService.getSupportProperty(key);
      }
    }
  }

  updateValue(event) {
    const propertyName = event.target.name;
    const value = event.target.value;
    this.evtConfigService.setValue(propertyName, value);
  }

  updateValueCheckbox(event) {
    const propertyName = event.target.name;
    const value = event.target.checked;
    this.evtConfigService.setValue(propertyName, value);
  }

  updateSupportValue(event) {
    const propertyName = event.target.name;
    const value = event.target.value;
    this.evtConfigService.setSupportValue(propertyName, value);
  }

  updateSupportValueCheckbox(event) {
    const propertyName = event.source.name;
    const value = event.target.checked;
    this.evtConfigService.setSupportValue(propertyName, value);
  }

  updateProperty(propertyName) {
    this.evtConfigService.setValue(propertyName, this.configs[propertyName]);
  }

  onAddEditionLevel() {
    this.configs.edition_array.push({
      label: 'Custom',
      value: 'Custom',
      prefix: 'custom',
      visible: true
    });
    this.evtConfigService.setValue('edition_array', this.configs.edition_array);
  }

  onRemoveEditionLevel(index) {
    this.configs.edition_array.splice(index, 1);
    this.evtConfigService.setValue('edition_array', this.configs.edition_array);
  }

  updateEditionLevels(event) {
    this.availableEditionLevel[event.value] = event.source.checked;
    this.evtConfigService.updateEditionLevelVisibility(event.value, event.source.checked);
    if (this.getEditionSelected() > 1) {
      this.configs.edition_level_selector = true;
      this.updateEditionSelectorVisibility();
    }
  }

  isEditionLevelAvailable(editionLevel) {
    return this.availableEditionLevel[editionLevel];
  }

  updateEditionSelectorVisibility() {
    this.evtConfigService.setValue('edition_level_selector', this.configs.edition_level_selector);
  }

  getEditionSelected() {
    let count = 0;
    for (const key in this.availableEditionLevel) {
      if (this.availableEditionLevel[key]) {
        count++;
      }
    }
    return count;
  }

  updateEditionLevelLabel(event, editionLevel) {
    this.evtConfigService.updateEditionLevelLabel(editionLevel, event.target.value);
  }

  updateEditionLevelPrefix(event, editionLevel) {
    this.evtConfigService.updateEditionLevelPrefix(editionLevel, event.target.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
