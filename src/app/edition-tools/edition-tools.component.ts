import { Component } from '@angular/core';
import { EvtConfigService } from '../services/evt-config.service';
import { map, tap, first } from 'rxjs/operators';

@Component({
  selector: 'app-edition-tools',
  templateUrl: './edition-tools.component.html',
  styleUrls: ['./edition-tools.component.scss']
})
export class EditionToolsComponent {

  configs$ = this.evtConfigService.configs$.pipe(
    map(configs => configs ? configs.tools : undefined),
    tap(configs => this.setSupportConfigs(configs)));
  public supportConfig: {
    textPrefatoryMatter?: boolean,
    textPrefatoryMatterType: 'regesto' | 'front'
  } = {
      textPrefatoryMatter: true,
      textPrefatoryMatterType: 'front'
    };

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }

  setSupportConfigs(configs) {
    this.supportConfig.textPrefatoryMatter = configs.frontInfo || configs.regesto;
    if (configs.frontInfo) {
      this.supportConfig.textPrefatoryMatterType = 'front';
    } else if (configs.regesto) {
      this.supportConfig.textPrefatoryMatterType = 'regesto';
    }
  }

  updatePrefatoryMatterConfigs() {
    this.configs$.pipe(first(), tap(configs => {
      configs.frontInfo = this.supportConfig.textPrefatoryMatter && this.supportConfig.textPrefatoryMatterType === 'front';
      configs.regesto = this.supportConfig.textPrefatoryMatter && this.supportConfig.textPrefatoryMatterType === 'regesto';
    }));
  }
}
