import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class HashFileService {
  chunkSize = 1024 * 1024; // bytes
  timeout = 10; // millisec


  constructor() { }

  clear() {
    this.lastOffset = 0;
    this.chunkReorder = 0;
    this.chunkTotal = 0;
  }


  loading(file, callbackProgress, callbackFinal) {
    //var chunkSize  = 1024*1024; // bytes
    let offset: number = 0;
    let size = this.chunkSize;
    let partial;
    let index = 0;
    let comp = this;

    if (file.size === 0) {
      callbackFinal();
    }
    while (offset < file.size) {
      partial = file.slice(offset, offset + size);
      var reader = new FileReader;
      let readerInfo = {
        globalSize: this.chunkSize,
        globalOffset: offset,
        globalIndex: index

      }
      reader.onload = function (evt) {
        comp.callbackRead_buffered(this, readerInfo, file, evt, callbackProgress, callbackFinal);
      };
      reader.readAsArrayBuffer(partial);
      offset += this.chunkSize;
      index += 1;
    }
  }

  lastOffset = 0;
  chunkReorder = 0;
  chunkTotal = 0;

  // memory reordering
  previous = [];
  callbackRead_buffered(reader, readerInfo, file, evt, callbackProgress, callbackFinal) {
    this.chunkTotal++;
    if (this.lastOffset !== readerInfo.globalOffset) {
      // out of order
      // console.log("[", readerInfo.globalSize, "]", readerInfo.globalOffset, '->', readerInfo.globalOffset + readerInfo.globalSize, ">>buffer");
      this.previous.push({ offset: readerInfo.globalOffset, size: readerInfo.globalSize, result: reader.result });
      this.chunkReorder++;
      return;
    }

    let parseResult = (offset, size, result) => {
      this.lastOffset = offset + size;
      // setTimeout(() => {
        callbackProgress(result);
      // }, 20);
      if (offset + size >= file.size) {
        this.lastOffset = 0;
        callbackFinal();
      }
    }

    // in order
    console.log("[", readerInfo.globalSize, "]", readerInfo.globalOffset, '->', readerInfo.globalOffset + readerInfo.globalSize, "");
    parseResult(readerInfo.globalOffset, readerInfo.globalSize, reader.result);

    // resolve previous buffered
    var buffered = [{}]
    while (buffered.length > 0) {
      buffered = this.previous.filter((item) => {
        return item.offset === this.lastOffset;
      });
      buffered.forEach((item: any) => {
        parseResult(item.offset, item.size, item.result);
        this.previous.splice(this.previous.findIndex(v => v.offset==item.offset && v.size == item.size));
      })
    }

  }


  // Human file size
  humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    var units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }



}
