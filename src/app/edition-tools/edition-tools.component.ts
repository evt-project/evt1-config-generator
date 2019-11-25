import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditionTools } from '../evt-config.models';
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

    viscoll_button: false,
    viscoll_scheme_path: '',
    viscoll_image_list_path: '',

    image_frame: true,
    double_view: true,
    regesto: false,
    frontInfo: true,
    msDesc: true,
    headerInfo: true,
    bibliography: true,
    translation: true,
    left_frame_default_content: 'image',
    right_frame_default_content: 'info',


    search: true,
    virtual_keyboard_search: true,
    bottom_navbar: false,
    bottom_navbar_initial_status: 'closed',
    prose_verses_toggler: false,
    lang_tooltip: false,
    list_person: true,
    list_place: true,
    list_org: true,
    list_term: false,
    list_gloss: false,
    list_doc: false,
    lists: []
  };

  private subscription: Subscription;

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
