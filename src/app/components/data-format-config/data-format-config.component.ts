import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-format-config',
  templateUrl: './data-format-config.component.html',
  styleUrls: ['./data-format-config.component.scss']
})
export class DataFormatConfigComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.mainData)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }

}
