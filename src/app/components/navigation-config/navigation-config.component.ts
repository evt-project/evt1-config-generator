import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { EvtConfigService } from 'src/app/services/evt-config.service';

@Component({
  selector: 'app-navigation-config',
  templateUrl: './navigation-config.component.html',
  styleUrls: ['./navigation-config.component.scss']
})
export class NavigationConfigComponent {
  public configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.tools)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
