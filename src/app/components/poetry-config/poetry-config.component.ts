import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-poetry-config',
  templateUrl: './poetry-config.component.html',
  styleUrls: ['./poetry-config.component.scss']
})
export class PoetryConfigComponent {
  public configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.tools)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
