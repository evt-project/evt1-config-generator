import { Component } from '@angular/core';
import { EvtConfigService } from '../services/evt-config.service';
import { map, tap, first } from 'rxjs/operators';

@Component({
  selector: 'app-edition-main-data',
  templateUrl: './edition-main-data.component.html',
  styleUrls: ['./edition-main-data.component.scss']
})
export class EditionMainDataComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.mainData),
    tap(c => this.setEditionSelected(c))
  );

  availableEditionLevel = {
    Diplomatic: true,
    Interpretative: true
  };

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

  isEditionLevelAvailable(editionLevel) {
    return this.availableEditionLevel[editionLevel];
  }

  setEditionSelected(configs) {
    let count = 0;
    for (const key in this.availableEditionLevel) {
      if (this.availableEditionLevel[key]) {
        count++;
      }
    }
    configs.edition_level_selector = count > 1;
  }
}
