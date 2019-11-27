import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditionTools, ListItemConfig, ListConfig } from '../evt-config.models';
import { EvtConfigService } from '../services/evt-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edition-tools',
  templateUrl: './edition-tools.component.html',
  styleUrls: ['./edition-tools.component.scss']
})
export class EditionToolsComponent implements OnInit, OnDestroy {

  configs: EditionTools = {
    txtimg_link_button: true,
    hs_button: true,
    mag_button: true,

    thumbs_button: true,
    pp_selector_doc_grouping: false,
    pp_selector_doc_tooltip: false,
    document_navigation: false,
    pp_selector_pos: 'left',
    bottom_navbar: false,
    bottom_navbar_initial_status: 'closed',

    image_frame: true,
    double_view: true,

    left_frame_default_content: 'image',
    right_frame_default_content: 'info',

    headerInfo: true,
    bibliography: true,
    msDesc: true,
    regesto: false,
    frontInfo: true,

    search: true,
    virtual_keyboard_search: true,

    viscoll_button: false,
    viscoll_scheme_path: '',
    viscoll_image_list_path: '',

    prose_verses_toggler: false,

    list_person: true,
    list_place: true,
    list_org: true,
    list_term: false,
    list_gloss: false,
    list_doc: false,
    lists: [],
    lang_tooltip: false,
  };

  public supportConfig: {
    textPrefatoryMatter?: boolean,
    textPrefatoryMatterType: 'regesto' | 'front'
  } = {
      textPrefatoryMatter: true,
      textPrefatoryMatterType: 'front'
    };

  private subscription: Subscription;

  constructor(private evtConfigService: EvtConfigService) {
    this.initConfigs();
  }

  ngOnInit() {
    this.subscription = this.evtConfigService.uploadedConfig.subscribe(newConfigs => this.initConfigs());
  }

  initConfigs() {
    for (const key in this.configs) {
      if (this.configs.hasOwnProperty(key)) {
        this.configs[key] = this.evtConfigService.getProperty(key);
      }
    }
    this.supportConfig.textPrefatoryMatter = this.configs.frontInfo || this.configs.regesto;
    if (this.configs.frontInfo) {
      this.supportConfig.textPrefatoryMatterType = 'front';
    } else if (this.configs.regesto) {
      this.supportConfig.textPrefatoryMatterType = 'regesto';
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

  updatePrefatoryMatterConfigs() {
    this.configs.frontInfo = this.supportConfig.textPrefatoryMatter && this.supportConfig.textPrefatoryMatterType === 'front';
    this.configs.regesto = this.supportConfig.textPrefatoryMatter && this.supportConfig.textPrefatoryMatterType === 'regesto';
    this.updateProperty('frontInfo');
    this.updateProperty('regesto');
  }

  updateListsValue(newListsConfig: ListConfig) {
    // this.evtConfigService.setValue('lists', newListsConfig);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
