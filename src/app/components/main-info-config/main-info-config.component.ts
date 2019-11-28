import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { EvtConfigService } from 'src/app/services/evt-config.service';

@Component({
  selector: 'app-main-info-config',
  templateUrl: './main-info-config.component.html',
  styleUrls: ['./main-info-config.component.scss']
})
export class MainInfoConfigComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.mainData)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
