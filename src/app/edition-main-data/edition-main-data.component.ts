import { Component } from '@angular/core';
import { EvtConfigService } from '../services/evt-config.service';
import { map, tap, first } from 'rxjs/operators';
import { EditionMainData } from '../evt-config.models';

@Component({
  selector: 'app-edition-main-data',
  templateUrl: './edition-main-data.component.html',
  styleUrls: ['./edition-main-data.component.scss']
})
export class EditionMainDataComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.mainData)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }

}
