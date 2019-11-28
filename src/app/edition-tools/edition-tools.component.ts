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
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
