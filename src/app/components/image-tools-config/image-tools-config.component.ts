import { Component } from '@angular/core';
import { EvtConfigService } from 'src/app/services/evt-config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-image-tools-config',
  templateUrl: './image-tools-config.component.html',
  styleUrls: ['./image-tools-config.component.scss']
})
export class ImageToolsConfigComponent {
  public configs$ = this.evtConfigService.configs$.pipe(
    map(c => c.tools)
  );

  constructor(
    private evtConfigService: EvtConfigService,
  ) {
  }
}
