import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map, tap, first } from 'rxjs/operators';
import { EditionMainData } from 'src/app/evt-config.models';

@Component({
  selector: 'app-edition-levels-config',
  templateUrl: './edition-levels-config.component.html',
  styleUrls: ['./edition-levels-config.component.scss']
})
export class EditionLevelsConfigComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.mainData),
    tap(c => this.setEditionSelected(c))
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }

  onAddEditionLevel() {
    this.configs$.pipe(first()).subscribe(
      configs => {
        configs.edition_array.push({
          label: 'Custom',
          value: 'Custom',
          prefix: 'custom',
          visible: true
        });
        this.setEditionSelected(configs);
      });
  }

  onRemoveEditionLevel(index) {
    this.configs$.pipe(first()).subscribe(
      configs => {
        configs.edition_array.splice(index, 1);
        this.setEditionSelected(configs);
      }
    );
  }

  setEditionSelected(configs: EditionMainData) {
    const activeLevels = configs.edition_array.filter(e => e.visible);
    configs.edition_level_selector = activeLevels && activeLevels.length > 1;
  }

}
