import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-config',
  templateUrl: './search-config.component.html',
  styleUrls: ['./search-config.component.scss']
})
export class SearchConfigComponent {
  public configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.tools)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
