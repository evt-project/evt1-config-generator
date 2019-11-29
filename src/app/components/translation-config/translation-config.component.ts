import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { EvtConfigService } from 'src/app/services/evt-config.service';

@Component({
  selector: 'app-translation-config',
  templateUrl: './translation-config.component.html',
  styleUrls: ['./translation-config.component.scss']
})
export class TranslationConfigComponent {
  configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.mainData)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
