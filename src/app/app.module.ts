import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { HashFileService } from './services/hash-file.service';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [
    AppComponent, UploadFileComponent,
  ],
  imports: [
    BrowserModule,
    NgxFileDropModule
  ],
  providers: [HashFileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
