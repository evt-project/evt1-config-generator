import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditionMainDataComponent } from './edition-main-data/edition-main-data.component';
import { CardComponent } from './components/card/card.component';
import { FormGroupComponent } from './components/form-group/form-group.component';
import { EditionToolsComponent } from './edition-tools/edition-tools.component';
import { EntitiesListsConfigComponent } from './components/entities-lists-config/entities-lists-config.component';
import { ListsConfigComponent } from './components/lists-config/lists-config.component';
import { ViscollConfigComponent } from './components/viscoll-config/viscoll-config.component';
import { EditionLevelsConfigComponent } from './components/edition-levels-config/edition-levels-config.component';
import { MainInfoConfigComponent } from './components/main-info-config/main-info-config.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EditionMainDataComponent,
    CardComponent,
    FormGroupComponent,
    EditionToolsComponent,
    EntitiesListsConfigComponent,
    ListsConfigComponent,
    ViscollConfigComponent,
    EditionLevelsConfigComponent,
    MainInfoConfigComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    FontAwesomeModule,
    NgSelectModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);
  }
}
