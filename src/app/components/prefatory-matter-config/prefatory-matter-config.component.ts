import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map, tap, first } from 'rxjs/operators';

@Component({
  selector: 'app-prefatory-matter-config',
  templateUrl: './prefatory-matter-config.component.html',
  styleUrls: ['./prefatory-matter-config.component.scss']
})
export class PrefatoryMatterConfigComponent {
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
