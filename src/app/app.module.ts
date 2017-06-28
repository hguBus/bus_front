import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// page
import { HomePage } from '../pages/home/home';
import { BusRoutesPage } from '../pages/bus-routes/bus-routes';
import { SchedulePage } from '../pages/schedule/schedule';
// about map
import { TabPage } from '../pages/tab/tab';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BusRoutesPage,
    SchedulePage,
    TabPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BusRoutesPage,
    SchedulePage,
    TabPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
