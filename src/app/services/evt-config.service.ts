import { Injectable, EventEmitter, Output } from '@angular/core';
import { EditionMainData, EditionTools, AdvancedConfigs, EVT1Config } from '../evt-config.models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvtConfigService {
  @Output() uploadedConfig: EventEmitter<any> = new EventEmitter();

  defaultConfigs: EVT1Config;
  configs: EVT1Config;
  defaultDataFolder = 'data';

  supportConfigs: any = {
    versionsAvailable: false,
    entitiesSelector: true,
    max_depth_pb: 'max(//tei:pb/count(ancestor-or-self::node())) - //node()[name()=$start_split]/count(ancestor-or-self::node())',
    max_depth_lb: 'max(//tei:lb/count(ancestor-or-self::node())) - //node()[name()=$start_split]/count(ancestor-or-self::node())',
    max_depth_cb: 'max(//tei:cb/count(ancestor-or-self::node())) - //node()[name()=$start_split]/count(ancestor-or-self::node())'
  };

  constructor() {
    this.setDefaults();
    this.configs = { ...this.defaultConfigs };
  }

  uploadConfig(XSLstring) {
    try {
      const domParser = new DOMParser();
      const xsltProcessor = new XSLTProcessor();
      const xsltDoc = domParser.parseFromString(XSLstring, 'text/xml');
      const xsltStyles = xsltDoc.children[0];

      for (const child of Array.from(xsltStyles.children)) {
        if (child.tagName === 'xsl:param' || child.tagName === 'xsl:variable') {
          const paramName = child.getAttribute('name');
          if (paramName.indexOf('ed_name') < 0) {
            let paramValue: any = '';
            if (child.getAttribute('as') === 'element()*') {
              paramValue = [];
              for (let j = 0; j < child.children.length; j++) {
                const subChild = child.children[j];
                if (paramName === 'edition_array') {
                  const prefixNode: any = xsltStyles.querySelectorAll('[name=\'ed_name' + (j + 1) + '\']');
                  const prefix = prefixNode && prefixNode[0] ? prefixNode[0].innerHTML : '';
                  paramValue.push({
                    label: subChild.innerHTML,
                    value: subChild.innerHTML,
                    prefix,
                    visible: subChild.innerHTML !== ''
                  });
                } else if (paramName === 'lists') {
                  const items = Array.from(subChild.children).map(i => {
                    return {
                      tag: i.tagName,
                      attributes: Array.from(i.attributes)
                        .filter(a => a.nodeName !== 'active')
                        .map(a => ({ key: a.nodeName, value: a.nodeValue })),
                      active: i.getAttribute('active') || false
                    };
                  });
                  paramValue.push({
                    groupLabel: subChild.getAttribute('label'),
                    active: subChild.getAttribute('active'),
                    items
                  });
                } else {
                  paramValue.push(subChild.tagName);
                }
              }
            } else {
              if (child.getAttribute('select')) {
                paramValue = child.getAttribute('select').replace(/'/g, '');
              } else {
                paramValue = child.innerHTML;
              }
              if (paramValue.indexOf('true()') >= 0) {
                paramValue = true;
              } else if (paramValue.indexOf('false()') >= 0) {
                paramValue = false;
              }
            }
            if (paramName === 'lists') {
              this.setValue('entitiesSelector', (paramValue.length > 0));
            }
            if (paramName === 'max_depth') {
              paramValue = this.splitMaxDepthXpath(paramValue);
            }
            this.setValue(paramName, paramValue);
          }
        }
      }
      this.uploadedConfig.emit(this.configs);
      console.log(this.configs);
    } catch (e) {
      console.log(e);
      // this.dialog.open(ErrorMessageDialogComponent, {
      //   data: 'There was an error in uploading your file. Please check your file and try again.'
      // });
    }
  }

  private splitMaxDepthXpath(value) {
    let openingBrackets = 0;
    try {
      openingBrackets = value.match(/max\(*max/)[0].match(/\(/g).length;
    } catch (e) { }
    const splittedValue = value.split(',');
    for (let x = 0; x < splittedValue.length; x++) {
      const xpathMatch = splittedValue[x].match(/max\(\/\/tei:.*\)/);
      let xpath = xpathMatch ? xpathMatch[0] : '';
      if (x === splittedValue.length - 1) {
        const closingBrackets = '\\){' + openingBrackets + '}';
        const regExpBrackets = new RegExp(closingBrackets, 'g');
        xpath = xpath.replace(regExpBrackets, '');
      }
      xpath = this.removeUnclosedBracketsFromXpathRule(xpath);

      if (xpath.indexOf('tei:pb') >= 0) {
        this.setSupportValue('max_depth_pb', xpath);
      } else if (xpath.indexOf('tei:lb') >= 0) {
        this.setSupportValue('max_depth_lb', xpath);
      } else if (xpath.indexOf('tei:cb') >= 0) {
        this.setSupportValue('max_depth_cb', xpath);
      }
    }
    return value;
  }

  private removeUnclosedBracketsFromXpathRule(value) {
    let openingBrackets = 0;
    try {
      openingBrackets = value.match(/\(/g).length;
    } catch (e) { }
    let closingBrackets = 0;
    try {
      closingBrackets = value.match(/\)/g).length;
    } catch (e) { }
    let i = value.length - 1;
    while (openingBrackets < closingBrackets && i >= 0) {
      if (value[i] === ')') {
        value = value.substr(0, i);
        closingBrackets--;
      }
      i--;
    }
    return value;
  }

  getConfigData() {
    return this.configs;
  }

  getProperty(propertyName: string, sectionName?: string) {
    if (!sectionName) {
      sectionName = this.findPropertySection(propertyName);
    }
    return this.configs[sectionName][propertyName];
  }

  setValue(propertyName: string, value: any, sectionName?: string) {
    if (!sectionName) {
      sectionName = this.findPropertySection(propertyName);
    }
    if (sectionName) {
      this.configs[sectionName][propertyName] = value;
    } else {
      console.log('Invalid property:', propertyName);
    }
  }

  getSupportProperty(propertyName: string) {
    return this.supportConfigs[propertyName];
  }

  setSupportValue(propertyName: string, value: any) {
    this.supportConfigs[propertyName] = value;
  }

  updateEditionLevelVisibility(editionLevelToEdit: string, visibility: boolean) {
    for (const edition of this.configs.mainData.edition_array) {
      if (edition.value === editionLevelToEdit) {
        edition.visible = visibility;
      }
    }
  }

  updateEditionLevelLabel(editionLevelToEdit: string, label: string) {
    for (const edition of this.configs.mainData.edition_array) {
      if (edition.value === editionLevelToEdit) {
        edition.label = label;
      }
    }
  }

  updateEditionLevelPrefix(editionLevelToEdit: string, prefix: string) {
    for (const edition of this.configs.mainData.edition_array) {
      if (edition.value === editionLevelToEdit) {
        edition.prefix = prefix;
      }
    }
  }

  findPropertySection(propertyName: string) {
    for (const key in this.defaultConfigs) {
      if (this.defaultConfigs.hasOwnProperty(key)) {
        if (this.defaultConfigs[key].hasOwnProperty(propertyName)) {
          return key;
        }
      }
    }
  }

  private setDefaults() {
    this.defaultConfigs = {
      mainData: {
        // GLOBAL
        index_title: 'CodexViewer',
        badge: true,
        badge_text: 'DIGITAL',
        webSite: '',
        welcomeMsg: '',
        // EDITION LEVELS
        edition_array: [{
          label: 'Diplomatic',
          value: 'Diplomatic',
          prefix: 'dipl',
          visible: true
        }, {
          label: 'Interpretative',
          value: 'Interpretative',
          prefix: 'interp',
          visible: true
        }],
        edition_level_selector: true,
        imageExt: 'jpg',
        fb_thumb: 'thumb_fb.jpg',
        translation: false,
      },
      tools: {
        // ADDITIONAL CONTENTS
        // TOOLS
        txtimg_link_button: true,
        hs_button: true,
        mag_button: true,
        thumbs_button: true,
        pp_selector_pos: 'right',
        pp_selector_doc_grouping: true,
        pp_selector_doc_tooltip: true,
        document_navigation: true,
        // TOOLS - SEARCH
        search: true,
        virtual_keyboard_search: false,
        // TOOLS - LISTS
        list_person: true,
        list_place: true,
        list_org: true,
        list_term: false,
        list_gloss: false,
        list_doc: false,
        lists: [{
          groupLabel: 'NAMED_ENTITIES',
          active: true,
          items: [
            { tag: 'persName', active: true, attributes: [] },
            { tag: 'placeName', active: true, attributes: [] },
            { tag: 'orgName', active: true, attributes: [] },
          ]
        }, {
          groupLabel: 'INTERESTING_ELEMENTS',
          active: true,
          items: [
            { tag: 'roleName', active: true, attributes: [] },
            { tag: 'measure', active: true, attributes: [] },
            { tag: 'date', active: true, attributes: [] },
            { tag: 'foreign', active: true, attributes: [] },
          ]
        }, {
          groupLabel: 'STAGES',
          active: false,
          items: [
            { tag: 'setting', active: true, attributes: [] },
            { tag: 'entrance', active: true, attributes: [] },
            { tag: 'exit', active: true, attributes: [] },
            { tag: 'business', active: true, attributes: [] },
            { tag: 'delivery', active: true, attributes: [] },
            { tag: 'modifier', active: true, attributes: [] },
            { tag: 'novelistic', active: true, attributes: [] },
            { tag: 'mixed', active: true, attributes: [] },
          ]
        }, {
          groupLabel: 'OTHER',
          active: false,
          items: [
            { tag: 'seg', label: 'METAPHOR', active: true, attributes: [{ key: 'type', value: 'metaphor' }] }
          ]
        }],
        // TOOLS - VIEWS
        image_frame: true,
        double_view: true,
        // DEFAULT CONTENT SEEN
        left_frame_default_content: 'image',
        right_frame_default_content: 'info',
        // PREFATORY MATTER
        regesto: false,
        frontInfo: true,
        msDesc: true,
        headerInfo: true,
        bibliography: true,
        // VISCOLL
        viscoll_button: false,
        viscoll_scheme_path: '',
        viscoll_image_list_path: '',
        // BOTTOM BAR
        bottom_navbar: false,
        bottom_navbar_initial_status: 'closed',
        // POETRY
        prose_verses_toggler: false,
        lang_tooltip: false,
      },
      advanced: {
        // ADVANCED
        defaulTextLabel: true,
        mainPrefix: '.',
        filePrefix: '../../..',
        dataPrefix: '../..',
        ed_content: 'if(//tei:text/tei:group) then(//tei:text/tei:group/name()) else ( //tei:text/name() )',
        // tslint:disable-next-line: max-line-length
        start_split: `if(//tei:text/tei:group) then(//tei:text/tei:group/name()) else(if(count(//tei:body/tei:div[@subtype='edition_text'])>1) then(//tei:body/tei:div[@subtype='edition_text']/name()) else(//tei:text/tei:body/name() ))`,
        start_split_depth: '//node()[name()=$start_split]/count(ancestor-or-self::node())',
        max_depth: `max(((max(//tei:pb/count(ancestor-or-self::node())) - //node()[name()=$start_split]/count(ancestor-or-self::node())),
                      (max(//tei:lb/count(ancestor-or-self::node())) - //node()[name()=$start_split]/count(ancestor-or-self::node())),
                      (max(//tei:cb/count(ancestor-or-self::node())) - //node()[name()=$start_split]/count(ancestor-or-self::node()))))`,
        evtTxt: ''
      }
    };

    this.defaultConfigs.mainData.welcomeMsg = `<div>
      <p class="title main">Welcome to an edition created with EVT!</p>
    </div>
    <div>This archive includes a few examples of editions created using EVT,
      by default you are showed a small excerpt of the
      <a href="http://pelavicino.labcd.unipi.it/" target="blank">
        Codice Pelavicino Digitale edition</a>.
    </div>
    <div>It is recommended to go to full screen mode so that all available screen space
    is used to show the manuscript images and the transcription text.</div>
    <div>For more information refer to the EVT Manual in the "doc" folder.
      If you have any suggestions or spot an error/bug please contact us at
    <a href="mailto:evt.developers@gmail.com">evt.developers@gmail.com</a></div>`;

    this.defaultConfigs.advanced.evtTxt = `<p>EVT (Edition Visualization Technology) is a software for creating and browsing
      digital editions of manuscripts based on text encoded according to the TEI XML schemas and Guidelines.
      This tool was born as part of the DVB (Digital Vercelli Book) project in order to allow the creation of
      a digital edition of the Vercelli Book, a parchment codex of the late tenth century,
      now preserved in the Archivio e Biblioteca Capitolare of Vercelli and regarded as one of the four most
      important manuscripts of the Anglo-Saxon period as regards the transmission of poetic texts in the Old English language.
    </p>
    <p>To ensure that it will be working on all the most recent web browsers, and for as long as possible on the World
      Wide Web itself, EVT is built on open and standard web technologies such as HTML, CSS and JavaScript. Specific
      features, such as the magnifying lens, are entrusted to jQuery plugins, again chosen among the open source and
      best supported ones to reduce the risk of future incompatibilities. The general architecture of the software,
      in any case, is modular, so that any component which may cause trouble or turn out to be not completely up to
      the task can be replaced easily.</p>
    <p>For more information about how to use and/or customize EVT please refer to the EVT Manual included in the
      archive you downloaded, in the "doc" folder.</p>
    <p>EVT is used in the following projects:</p>
    <ul>
      <li><a href="http://pelavicino.labcd.unipi.it/" target="blank">Codice Pelavicino Digitale</a></li>
      <li><a href="http://vbd.humnet.unipi.it/" target="blank">Vercelli Book Digitale</a></li>
    </ul>
    <p>EVT has a home page in the <a href="https://sourceforge.net/p/evt-project/" target="blank">SourceForge</a> repository,
      but development is done on Gitlab and Github: if you are interested in learning more about EVT and/or
      in adapting it to your specific needs please contact the project Director, Roberto Rosselli Del Turco
      <a href="mailto:roberto.rossellidelturco@gmail.com" target="_top">roberto.rossellidelturco@gmail.com</a>.</p>
    <p>If you have any suggestions or spot an error/bug please contact us at
    <a href="mailto:evt.developers@gmail.com">evt.developers@gmail.com</a></p>`;
  }
}
