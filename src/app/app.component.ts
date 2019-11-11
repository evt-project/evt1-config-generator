import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EvtConfigService } from './services/evt-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public availableLanguages = [{ code: 'en', label: 'english' }, { code: 'it', label: 'italian' }];
  public selectedLanguage;

  constructor(
    public evtConfigService: EvtConfigService,
    private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.selectedLanguage = 'en';
    this.changeLanguage();
  }

  public changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  upload() {
    const inputFile = document.getElementById('uploadXSL');
    inputFile.click();
  }

  uploadSelectedXSL() {
    const inputFile: any = document.getElementById('uploadXSL');
    const files = inputFile.files;
    if (files.length && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      const that = this;
      // If we use onloadend, we need to check the readyState.
      reader.onloadend = (evt) => {
        const target: any = evt.target;
        if (target.readyState === 2) { // DONE == 2
          that.evtConfigService.uploadConfig(target.result);
        }
        inputFile.value = '';
      };

      const blob = file.slice(0, file.size);
      reader.readAsBinaryString(blob);
    }
  }
}
