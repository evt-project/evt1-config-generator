import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-path-parameters-config',
  templateUrl: './path-parameters-config.component.html',
  styleUrls: ['./path-parameters-config.component.scss']
})
export class PathParametersConfigComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.advanced)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
