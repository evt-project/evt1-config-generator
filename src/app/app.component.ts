import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public availableLanguages = [{ code: 'en', label: 'english' }, { code: 'it', label: 'italian' }];
  public selectedLanguage;
  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.selectedLanguage = 'en';
    this.changeLanguage();
  }

  public changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }
}
