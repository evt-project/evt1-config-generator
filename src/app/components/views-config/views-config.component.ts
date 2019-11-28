import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { EvtConfigService } from 'src/app/services/evt-config.service';

@Component({
  selector: 'app-views-config',
  templateUrl: './views-config.component.html',
  styleUrls: ['./views-config.component.scss']
})
export class ViewsConfigComponent {
  public configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.tools)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }

}
