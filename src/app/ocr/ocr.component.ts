import { Component, OnInit, Input } from '@angular/core';
import { createWorker, createScheduler, OEM } from 'tesseract.js';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.scss']
})
export class OcrComponent implements OnInit {

  @Input() imgUrl: string;

  worker = createWorker({
    langPath: "http://tessdata.projectnaptha.com/4.0.0_best"
  });

  workerIsStarting: boolean = true;
  ocrIsRunning: boolean = false;

  ocrText: string;
  hocr: string;

  constructor() {
    (async () => {
      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      await this.worker.setParameters({
        tessedit_ocr_engine_mode: OEM.LSTM_ONLY
      });

      this.workerIsStarting = false;
      console.log("OCR init done!");
    })();
  }

  ngOnInit() {
  }

  onRunOcr_Click() {
    this.ocrIsRunning = true;

    console.log("Will run OCR");

    (async () => {
      const result = await this.worker.recognize(this.imgUrl);

      this.ocrText = result.data.text;
      this.hocr = result.data.hocr;

      this.ocrIsRunning = false;
      console.log(result.data.confidence);
    })();
  }

}
