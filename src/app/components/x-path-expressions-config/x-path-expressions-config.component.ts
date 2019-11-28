import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-x-path-expressions-config',
  templateUrl: './x-path-expressions-config.component.html',
  styleUrls: ['./x-path-expressions-config.component.scss']
})
export class XPathExpressionsConfigComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.advanced)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
