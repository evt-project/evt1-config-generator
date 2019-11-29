import { Component } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { EvtConfigService } from 'src/app/services/evt-config.service';

@Component({
  selector: 'app-navigation-config',
  templateUrl: './navigation-config.component.html',
  styleUrls: ['./navigation-config.component.scss']
})
export class NavigationConfigComponent {
  public configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.tools),
    tap(c => {
      if (c.bottom_navbar && !c.bottom_navbar_initial_status) {
        c.bottom_navbar_initial_status = this.evtConfigService.defaultConfigs.tools.bottom_navbar_initial_status;
      }
    })
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
