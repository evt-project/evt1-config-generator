import { Injectable, EventEmitter, Output } from '@angular/core';
import { EditionMainData, EditionTools, AdvancedConfigs, EVT1Config, ListConfig } from '../evt-config.models';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvtConfigService {
  @Output() uploadedConfig: EventEmitter<any> = new EventEmitter();

  defaultConfigs: EVT1Config;
  configs$ = new BehaviorSubject<EVT1Config>(undefined);
  defaultDataFolder = 'data';

  supportConfigs: any = {
    versionsAvailable: false,
    entitiesSelector: true
  };

  constructor() {
    this.setDefaults();
    this.configs$.next({ ...this.defaultConfigs });
  }

  uploadConfig(XSLstring) {
    try {
      const domParser = new DOMParser();
      const xsltProcessor = new XSLTProcessor();
      const xsltDoc = domParser.parseFromString(XSLstring, 'text/xml');
      const xsltStyles = xsltDoc.children[0];
      const newConfig = { ...this.defaultConfigs };
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
                        .filter(a => a.nodeName !== 'active' && a.nodeName !== 'label')
                        .map(a => ({ key: a.nodeName, value: a.nodeValue })),
                      active: i.getAttribute('active') || false,
                      label: i.getAttribute('label') || ''
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
              this.supportConfigs.entitiesSelector = (paramValue.length > 0);
            }
            const sectionName = this.findPropertySection(paramName);
            newConfig[sectionName] = {
              ...newConfig[sectionName] || {},
              [paramName]: typeof paramValue === 'string' ? decodeURIComponent(escape(paramValue)) : paramValue
            };
          }
        }
      }
      console.log({ ...newConfig });
      this.configs$.next({ ...newConfig });
    } catch (e) {
      console.log(e);
      // this.dialog.open(ErrorMessageDialogComponent, {
      //   data: 'There was an error in uploading your file. Please check your file and try again.'
      // });
    }
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

  generateXSL() {
    return this.configs$.pipe(
      first(),
      map((c) => {
        if (c !== undefined) {
          const configs = {
            ...c.mainData,
            ...c.tools,
            ...c.advanced
          };
          let xslt = `<?xml version="1.0" encoding="UTF-8"?>
                  <xsl:stylesheet xpath-default-namespace="http://www.tei-c.org/ns/1.0"
                    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
                    xmlns:xs="http://www.w3.org/2001/XMLSchema"
                    xmlns:eg="http://www.tei-c.org/ns/Examples"
                    xmlns:xd="http://www.pnp-software.com/XSLTdoc"
                    xmlns:fn = "http://www.w3.org/2005/xpath-functions"
                    xmlns:tei = "http://www.tei-c.org/ns/1.0"
                    xmlns = "http://www.w3.org/1999/xhtml"
                    exclude-result-prefixes="#all" >`;
          xslt += `<xd:doc type="stylesheet">
                    <xd:short>
                      EN: This file collects parameters and configurable variables used in the other modules.
                      IT: Questo file è una collezione di parametri e variabili configurabili, usati negli altri moduli.
                    </xd:short>
                  </xd:doc>`;
          xslt += `<!-- This file was auto generated using EVT 1 Config Generator Tool http://evt.labcd.unipi.it/evt1-config -->`;
          xslt += `<!-- GLOBAL -->
                  <!-- EN: The global variable $root is in the file evt_builder-main.xsl-->
                  <!-- IT: La variabile globale $root si trova nel file evt_builder-main.xsl-->`;
          const params = this.getOrderedParams();
          for (const paramName of params) {
            let paramValue = configs[paramName];
            xslt += this.getCommentBeforeParam(paramName);
            switch (paramName) {
              case `welcomeMsg`:
              case `evtTxt`:
                xslt += `<xsl:param name="${paramName}">${configs[paramName]}</xsl:param>`;
                break;
              case 'edition_array':
                let xsltEdition = `<xsl:param name="${paramName}" as="element()*">`;
                let xsltEditionPrefixs = '';
                for (let i = 0; i < paramValue.length; i++) {
                  const editionLevel = paramValue[i];
                  if (editionLevel.visible) {
                    xsltEdition += `<edition>${editionLevel.label}</edition>`;
                  } else {
                    xsltEdition += `<edition></edition>`;
                  }
                  if (editionLevel.id === 'diplomatic') {
                    xsltEdition += this.getCommentBeforeParam('editionDiplomatic');
                  } else if (editionLevel.id === 'interpretative') {
                    xsltEdition += this.getCommentBeforeParam('editionInterpretative');
                  }
                  xsltEditionPrefixs += `<xsl:variable name="ed_name${(i + 1)}">${editionLevel.prefix}</xsl:variable>`;
                }
                xsltEdition += this.getCommentBeforeParam('editionNew');
                xsltEdition += `</xsl:param>`;
                xslt += xsltEdition + this.getCommentBeforeParam('ed_name') + xsltEditionPrefixs;
                break;
              case 'lists':
                xslt += `<xsl:param name="${paramName}" as="element()*">`;
                (paramValue as ListConfig[]).forEach(list => {
                  xslt += `<group label="${list.groupLabel}" active="${list.active}">`;
                  list.items.forEach(item => {
                    xslt += `<${item.tag} active="${item.active}"`;
                    if (item.label) {
                      xslt += ` label="${item.label}"`;
                    }
                    (item.attributes || []).forEach(attr => {
                      xslt += ` ${attr.key}="${attr.value}"`;
                    });
                    xslt += `/>`;
                  });
                  xslt += `</group>`;
                });
                xslt += `</xsl:param>`;
                break;
              case 'start_split':
              case 'ed_content':
                xslt += `<xsl:param name="${paramName}" select="${paramValue}"/>`;
                break;
              default:
                if (typeof (paramValue) === 'boolean') {
                  paramValue = paramValue + '()';
                } else if (typeof (paramValue) === 'object') {
                  paramValue = '\'' + paramValue + '\'';
                } else {
                  paramValue = '\'' + paramValue + '\'';
                }
                xslt += `<xsl:param name="${paramName}" select="${paramValue}"/>`;
            }
          }

          xslt += `</xsl:stylesheet>`;
          return xslt;
        } else {
          return '';
        }
      }));
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

  private getOrderedParams() {
    return [
      'mainPrefix',
      'filePrefix',
      'dataPrefix',
      'imageExt',
      'webSite',
      'index_title',
      'welcomeMsg',
      'image_frame',
      'badge',
      'badge_text',
      'double_view',
      'regesto',
      'frontInfo',
      'msDesc',
      'headerInfo',
      'bibliography',
      'edition_array',
      'translation',
      'fb_thumb',
      'ed_content',
      'start_split',
      'defaulTextLabel',
      'left_frame_default_content',
      'right_frame_default_content',
      'txtimg_link_button',
      'hs_button',
      'mag_button',
      'thumbs_button',
      'viscoll_button',
      'viscoll_scheme_path',
      'viscoll_image_list_path',
      'edition_level_selector',
      'pp_selector_pos',
      'pp_selector_doc_grouping',
      'pp_selector_doc_tooltip',
      'search',
      'virtual_keyboard_search',
      'bottom_navbar',
      'bottom_navbar_initial_status',
      'document_navigation',
      'prose_verses_toggler',
      'lang_tooltip',
      'list_person',
      'list_place',
      'list_org',
      'list_term',
      'list_gloss',
      'list_doc',
      'lists',
      'evtTxt'
    ];
  }

  private getCommentBeforeParam(paramName) {
    switch (paramName) {
      case 'mainPrefix':
        return `<!-- Parameters -->
          <!-- EN: It is possible to modify these prefixes so that they point to a custom web site, for instance:
            <xsl:param name="filePrefix" select="'http://your.website.org/'"/>
          -->
          <!-- IT: E' possibile modificare i prefissi per puntare ad un server personalizzato, ad esempio:
            <xsl:param name="filePrefix" select="'http://tuosito.it/b'"/>
          -->`;
      case 'webSite':
        return `<!-- EN: Main web site for digital edition -->
        <!-- IT: Sito web principale dell'edizione digitale -->
        <!-- default: '' -->`;
      case 'index_title':
        return `<!-- EN: Edition title -->
        <!-- IT: Titolo edizione -->
        <!-- default: 'Codex Viewer' -->`;
      case 'welcomeMsg':
        return `<!-- EN: Welcome Message -->
          <!-- IT: Messaggio di benvenuto -->
          <!-- default: 'Welcome to an edition created with EVT' -->`;
      case 'image_frame':
        return `<!-- EN: Hide/Show scans -->
        <!-- IT: Nascondi/Mostra scansioni -->
        <!-- default: true() -->`;
      case 'badge':
        return `<!-- EN: Hide/Show badge -->
          <!-- IT: Nascondi/Mostra badge -->
          <!-- default: true() -->`;
      case 'badge_text':
        return `<!-- EN: Set text in badge -->
            <!-- IT: Imposta testo del badge -->
            <!-- ex: alpha, beta, stable etc -->`;
      case 'double_view':
        return `<!-- EN: On/Off double page view -->
              <!-- IT: Attiva/Disattiva vista doppia pagina -->
              <!-- default: true() -->`;
      case 'regesto':
        return `<!-- ################ -->
              <!-- PREFATORY MATTER -->
              <!-- ################ -->

              <!-- EN: On/Off regesto -->
              <!-- IT: Attiva/Disattiva regesto -->
              <!-- default: false() -->`;
      case 'frontInfo':
        return `<!-- EN: On/Off <front> Information -->
          <!-- IT: Attiva/Disattiva Informazioni del <front> -->
          <!-- default: true() -->`;
      case 'msDesc':
        return `<!-- EN: On/Off Manuscript Description -->
            <!-- IT: Attiva/Disattiva Descrizione del manoscritto-->
            <!-- default: true() -->`;
      case 'headerInfo':
        return `<!-- EN: On/Off Header general information -->
              <!-- IT: Attiva/Disattiva Informazioni generali -->
              <!-- default: true() -->`;
      case 'bibliography':
        return `<!-- EN: On/Off Bibliography -->
                <!-- IT: Attiva/Disattiva Bibliografia -->
                <!-- default: true() -->`;
      case 'edition_array':
        return `<!-- ############## -->
                  <!-- EDITION LEVELS -->
                  <!-- ############## -->

                  <!-- EN: To use it in your code:
                    <xsl:value-of select="$edition_array[n]" />	-->
                  <!-- IT: Per l'utilizzo nel codice:
                    <xsl:value-of select="$edition_array[n]" />	-->

                  <!-- EN: It is possible to skip production of pages for a specific edition simply
                    removing the textual part of the corresponding item. -->
                  <!-- IT: E' possibile rimuovere la produzione di pagine di una determinata edizione
                    semplicemente rimuovendo la parte testuale dell'item corrispondente. -->`;
      case 'ed_name':
        return `<!-- EN: It is possibile to customize the prefix used in the creation of the classes of the html elements of the edition -->
        <!-- IT: E' possibile personalizzare il prefisso usato nella creazione delle classi degli elementi html dell'edizione. -->`;
      case 'translation':
        return `<!-- EN: Enable/Disable translation -->
          <!-- IT: Attiva/Disattiva traduzione -->`;
      case 'fb_thumb':
        return `<!-- Thumbnail image -->`;
      case 'ed_content':
        return `<!-- EN: Indicate the xml node that contains all the text to be transformed for each edition level -->
          <!-- IT: Indicare il nodo xml che contiene il testo da trasformare per ogni livello di edizione -->
          <!--<xsl:variable name="ed_content" select="if(//tei:text/tei:group[@xml:id='group'])
           then(//tei:text/tei:group[@xml:id='group']/name()) else ( //tei:body/name() )"/>-->`;
      case 'start_split':
        return `<!-- EN: Starting point for the split of elements containing <pb/> and <lb/> elements -->
        <!-- IT: Punto di partenza per la divisione degli elementi contententi elementi <pb/> e <lb/> -->
        <!--<xsl:variable name="start_split" select="if(//tei:text/tei:group[@xml:id='group'])
          then(//tei:text/tei:group[@xml:id='group']/name()) else( if(//tei:body/tei:div[@subtype='edition_text'])
          then(//tei:body/tei:div[@subtype='edition_text']/name()) else(//tei:body/name()) )"/>-->
        <!-- Retrocompatiblità gestita solo per documenti unitari -->`;
      case 'defaultTextLabel':
        return `<!-- EN: On/Off default Text Label generation from id
          If false() you need to put your own xslt transformations in modules/elements/evt_builder-generate-text_label.xsl -->
        <!-- IT: Attiva/Disattiva generazione standard dell'etichetta del selettore testuale in base all'id.
          Se false() e' necessario aggiungere le proprie trasformazioni xslt
            nel file modules/elements/evt_builder-generate-text_label.xsl -->`;
      case 'left_frame_default_content':
        return `<!-- ################# -->
        <!-- INTERFACE CONTROL -->
        <!-- ################# -->

        <!-- DEFAULT CONTENT SEEN -->
        <!-- EN: Set default content on first load for left frame choosing between image or manuscript info
            Possible values are:
            - 'image' if you want to see the image on first load
            - 'info'  if you want to see the manuscript info on first load
            Any other value will work as 'image'.
        -->
        <!-- IT: Indicare cosa visualizzare di default al primo caricamento nel frame sinistro: immagine o informazioni sul manoscritto
            I valori possibili sono:
            - 'image' se si vuole visualizzare l'immagine al primo caricamento
            - 'info'  se si vogliono visualizzare le informazioni sul manoscritto al primo caricamento
            Qualsiasi altro valore varrà come 'image'
        -->`;
      case 'right_frame_default_content':
        return `<!-- EN: Set default content on first load for right frame choosing between text or text front info
        Possible values are:
        - 'text' if you want to see the text on first load
        - 'info'  if you want to see the text front info on first load
        Any other value will work as 'text'.
        -->
        <!-- IT: Indicare cosa visualizzare di default al primo caricamento nel frame destro: testo o informazioni sul testo
          I valori possibili sono:
          - 'text' se si vuole visualizzare il testo al primo caricamento
          - 'info'  se si vogliono visualizzare le informazioni sul testo al primo caricamento
          Qualsiasi altro valore varrà come 'text'
        -->`;
      case 'txtimg_link_button':
        return `<!-- BUTTONS PRESENCE AND POSITION -->

          <!-- EN: Show/Hide Txt/Img Link Button in interface -->
          <!-- IT: Mostra/Nascondi pulsante Txt/Img Link nell'interfaccia web -->
          <!-- default: true() -->`;
      case 'hs_button':
        return `<!-- EN: Show/Hide Hotspot Button in interface -->
            <!-- IT: Mostra/Nascondi pulsante Hotspot nell'interfaccia web -->
            <!-- default: true() -->`;
      case 'mag_button':
        return `<!-- EN: Show/Hide Magnifier Button in interface -->
        <!-- IT: Mostra/Nascondi pulsante Lente di ingrandimento nell'interfaccia web -->
        <!-- default: true() -->`;
      case 'thumbs_button':
        return `<!-- EN: Show/Hide Thumbnails Button in interface -->
        <!-- IT: Mostra/Nascondi pulsante Thumbnails nell'interfaccia web -->
        <!-- default: true() -->`;
      case 'viscoll_button':
        return `<!-- EN: Show/Hide Viscoll Button in interface -->
          <!-- IT: Mostra/Nascondi pulsante Viscoll nell'interfaccia web -->
          <!-- default: false() -->`;
      case 'viscoll_scheme_path':
        return `<!-- VISCOLL -->
            <!-- In order to let Viscoll work properly, you need to prepare
              the collation scheme and the image list, as it is explained in the points
              1 and 2 of Viscoll documentation (https://github.com/leoba/VisColl). First create your collation model,
              then prepare the image list as indicated (or just have an encoded xml TEI file containing a facsimile section)
              and process it at http://138.197.87.173:8080/xproc-z/visualize-collation/ -->

            <!-- EN: Path to xml file containing viscoll scheme.
              If you need to use an online resource, put the complete URL (e.g: http://www.mysite.com/viscollScheme.xml) here.
              Otherwise put the file in data/input_data/text folder and just put the relative path starting from that folder here. -->
            <!-- IT: Percorso al file xml contenente lo schema viscoll.
              Se si usa una risorsa online, inserire il percorso completo (ex. http://www.ilmiosito.it/schemaViscoll.xml).
              Altrimenti copiare il file nella cartella data/input_data/text e
              inserire qui solo percorso relativo a partire da quella cartella. -->`;
      case 'viscoll_image_list_path':
        return `<!-- EN: Path to xml file containing viscoll images list.
                If you need to use an online resource, put the entire path (e.g: http://www.mysite.com/viscollImagelist.xml) here.
                Otherwise put the file in data/input_data/text folder and just put the relative path starting from that folder here. -->
              <!-- IT: Percorso al file xml contenente la lista delle immagini necessaria al corretto funzionamento di viscoll.
                Se si usa una risorsa online, inserire il percorso completo (ex. http://www.ilmiosito.it/viscollImagelist.xml).
                Altrimenti copiare il file nella cartella data/input_data/text
                e inserire qui solo percorso relativo a partire da quella cartella. -->`;
      case 'edition_level_selector':
        return `<!-- EN: Show/Hide Edition level selector in interface -->
        <!-- IT: Mostra/Nascondi selettore Livello/i Edizione nell'interfaccia web -->
        <!-- default: true() -->`;
      case 'pp_selector_pos':
        return `<!-- IT: Choose page selector position -->
          <!-- IT: Scegli posizione Selettore pagina -->
          <!-- "left" or "right" | Default: "right" -->`;
      case 'pp_selector_doc_grouping':
        return `<!-- EN: Choose whether or not to group pages by document in the selector -->
            <!-- IT: Scegli se raggruppare o meno le pagine per documento nel selettore apposito -->
            <!-- default: true() -->`;
      case 'pp_selector_doc_tooltip':
        return `<!-- EN: Choose whether or not having a tooltip on pages option showing the belonging document  -->
              <!-- IT: Scegli se avere un tooltip sulle opzioni delle pagine che mostra il/i documento/i di appartenenza -->
              <!-- default: false() -->`;
      case 'search':
        return `<!-- EN: On/Off Search -->
                <!-- IT: Attiva/Disattiva Ricerca -->
                <!-- default: true() -->`;
      case 'virtual_keyboard_search':
        return `<!-- EN: On/Off Virtual Keyboard for search -->
                  <!-- IT: Attiva/Disattiva Tastiera virtuale per ricerca -->
                  <!-- default: true() -->`;
      case 'bottom_navbar':
        return `<!-- EN: On/Off Bottom Navbar -->
                    <!-- IT: Attiva/Disattiva Barra di navigazione in fondo alla pagina -->
                    <!-- default: true() -->`;
      case 'bottom_navbar_initial_status':
        return `<!-- EN: Initial status of Bottom Navbar (only works if $bottom_navbar=true()) -->
        <!-- IT: Stato iniziale della barra di navigazione (considerato solo se $bottom_navbar=true())-->
        <!-- possible values: 'collapsed' | 'expanded' -->
        <!-- default: 'collapsed' -->`;
      case 'document_navigation':
        return `<!-- EN: On/Off Document Navigation -->
          <!-- IT: Attiva/Disattiva navigazione per documento -->
          <!-- default: false() -->`;
      case 'prose_verses_toggler':
        return `<!-- EN: On/Off Lines/Prose visualization Button -->
            <!-- IT: Attiva/Disattiva Bottone di visualizzazione Versi/Prosa  -->
            <!-- default: true() -->`;
      case 'lang_tooltip':
        return `<!-- EN: On/Off Tooltip indicating language encoded with @xml:lang -->
              <!-- IT: Attiva/Disattiva Tooltip per la visualizzazione della lingua degli elementi che presentano @xml:lang  -->
              <!-- default: false() -->`;
      case 'list_person':
        return `
              <!-- LISTS -->

              <!-- EN: On/Off persons list -->
              <!-- IT: Attiva/disattiva lista persone -->
              <!-- default: true() -->`;
      case 'list_place':
        return `<!-- EN: On/Off places list -->
                <!-- IT: Attiva/disattiva lista luoghi -->
                <!-- default: true() -->`;
      case 'list_org':
        return `<!-- EN: On/Off orgName list -->
                  <!-- IT: Attiva/disattiva lista organizzazioni -->
                  <!-- default: true() -->`;
      case 'list_term':
        return `<!-- EN: On/Off term list -->
                    <!-- IT: Attiva/disattiva lista terms -->
                    <!-- default: true() -->`;
      case 'list_gloss':
        return `<!-- EN: On/Off gloss list -->
                      <!-- IT: Attiva/disattiva lista glosses -->
                      <!-- default: true() -->`;
      case 'list_doc':
        return `<!-- EN: On/Off chronological index for texts -->
                        <!-- IT: Attiva/disattiva indice cronologico -->
                        <!-- default: true() -->`;
      case 'lists':
        return `<!-- EN: It is possibile to personalize the elements in the filter
          select element that will select and highlight particular (groups of) words.
          In order to remove an element from the list in the application just remove the element itself.
          In order to add a new element to the list you simply need to know that the tag corresponds to
          the class name that has be given to the html element referring to the particular words to be selected. -->
          <!-- IT: E' possibile personalizzare gli elementi che compariranno nell'elenco dei filtri che
          selezionano particolari paroli o gruppi di parole. Per rimuovere un elemento basta eliminare tutto l'elemento di interesse.
          Per aggiungere un elemento alla lista basta sapere che il tag fa riferimento alla classe data all'elemento
          html con il quale sono state marcate le parole "particolari" da selezionare. -->`;
      case 'evtTxt':
        return `<!-- EN: Information about EVT -->
            <!-- IT: Informazioni su EVT  -->`;
      case 'editionDiplomatic':
        return `<!-- EN: If you have a diplomatic edition put <edition>Diplomatic</edition>.
              If you DON'T have a diplomatic edition put <edition></edition> -->
              <!-- IT: Se si ha l'edizione diplomatica scrivere <edition>Diplomatic</edition>.
              Se NON si ha l'edizione diplomatica mettere <edition></edition> -->
              <!-- EN: For processing in the modules: $edition_array[1] -->
              <!-- IT: Per l'elaborazione nei moduli: $edition_array[1] -->`;
      case 'editionInterpretative':
        return `<!-- EN: If you have an interpretative edition put <edition>Interpretative</edition>.
              If you DON'T have an interpretative edition put <edition></edition> -->
              <!-- IT: Se si ha l'edizione interpretativa scrivere <edition>Interpretative</edition>.
              Se NON si ha l'edizione interpretativa mettere <edition></edition> -->
              <!-- EN: For processing in the modules: $edition_array[2] -->
              <!-- IT: Per l'elaborazione nei moduli: $edition_array[2] -->`;
      case 'editionNew':
        return `<!-- EN: To add a new edition it is necessary to add a new line here and -forcedly- a
                declaration concerning output file in the modules/evt_builder-main.xsl file,
                under the <xsl:if test="$edition_array[2]!=''" condition> 
                For instance: <edition>New_edition</edition> -->
                <!-- IT: Per aggiungere una nuova edizione, bisognerà inserire una nuova riga qui e -necessariamente-
                la dichiarazione per i file di output nel file modules/evt_builder-main.xsl,
                sotto la condizione <xsl:if test="$edition_array[2]!=''"> 
                Esempio: <edition>Nuova_edizione</edition> Add by FS -->`;
      default:
        return '';
    }
  }
}
