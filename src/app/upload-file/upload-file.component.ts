import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { HashFileService } from '../services/hash-file.service';
// declare const handleFiles: any;
// import * as Sha256 from 'src/assets/sha256.js'
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: []
})
export class UploadFileComponent implements OnInit {
  public file: NgxFileDropEntry;
  progressValue: number = 0;
  count = 0;

  constructor(private hashfile: HashFileService, private cd: ChangeDetectorRef) { }

  ngOnInit() { }


  public dropped(files: NgxFileDropEntry[]) {
    this.file = files[0];
    let droppedFile = files[0];
    this.progressValue = 0;

    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {

        this.progressValue = 0;
        if (file === undefined) {
          return;
        }
        var SHA256 = CryptoJS.algo.SHA256.create();
        var counter = 0;


        this.hashfile.loading(file,
          (data) => {
            let wordBuffer = CryptoJS.lib.WordArray.create(data);
            let x = SHA256.toString();
            SHA256.update(wordBuffer);
            counter += data.byteLength;
            let percentage = +((counter / file.size) * 100).toFixed(0)
            console.log(percentage + "%")
            if (this.progressValue != 100) {
              this.progressValue = percentage;
              this.cd.detectChanges()
            }
          }, (data) => {
            console.log('100%');
            this.progressValue = 100;
            this.cd.detectChanges();
            var encrypted = SHA256.finalize().toString();
            console.log(encrypted)
          });
      })
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

}
