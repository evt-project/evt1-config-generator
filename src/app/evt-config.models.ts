export interface EVT1Config {
    mainData: EditionMainData;
    tools: EditionTools;
    advanced: AdvancedConfigs;
}

export interface EditionMainData {
    imageExt: string;
    webSite: string;
    index_title: string;
    welcomeMsg: string;
    badge: boolean;
    badge_text: string;
    fb_thumb: string;
    edition_array: Array<{
        label: string;
        value: string;
        prefix: string;
        visible: boolean;
    }>; // This info will be used to create xslt variable edition_array and ed_name1, ed_name2, etc.
    edition_level_selector: boolean;
    translation: boolean;
}

export interface EditionTools {
    image_frame: boolean;
    double_view: boolean;
    regesto: boolean;
    frontInfo: boolean;
    msDesc: boolean;
    headerInfo: boolean;
    bibliography: boolean;
    left_frame_default_content: string;
    right_frame_default_content: string;
    txtimg_link_button: boolean;
    hs_button: boolean;
    mag_button: boolean;
    thumbs_button: boolean;
    viscoll_button: boolean;
    viscoll_scheme_path: string;
    viscoll_image_list_path: string;
    pp_selector_pos: string;
    pp_selector_doc_grouping: boolean;
    pp_selector_doc_tooltip: boolean;
    search: boolean;
    virtual_keyboard_search: boolean;
    bottom_navbar: boolean;
    bottom_navbar_initial_status: string;
    document_navigation: boolean;
    prose_verses_toggler: boolean;
    lang_tooltip: boolean;

    list_person: boolean;
    list_place: boolean;
    list_org: boolean;
    list_term: boolean;
    list_gloss: boolean;
    list_doc: boolean;

    lists: ListConfig[];
}

export interface ListConfig {
    groupLabel: string;
    active: boolean;
    items: ListItemConfig[];
}

export interface ListItemConfig {
    tag: string;
    label?: string;
    attributes?: Array<{ key: string; value: any }>;
    active: boolean;
}

export interface AdvancedConfigs {
    mainPrefix: string;
    filePrefix: string;
    dataPrefix: string;
    ed_content: string;
    start_split: string;
    defaulTextLabel: boolean;
    evtTxt: string;
}
