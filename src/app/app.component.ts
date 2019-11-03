import { Component, ElementRef, HostListener } from '@angular/core';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdfswarm';
  pdfSrc: string = 'https://recordsmonster.blob.core.windows.net/doctype-training-data/N983TA%20SD-7.pdf?st=2019-10-15T21%3A22%3A32Z&se=2019-10-16T21%3A22%3A32Z&sp=rl&sv=2018-03-28&sr=b&sig=7NPYgYuFavNVzYp%2BfXbd4CWVzIdrtnywAl%2B4AneQVco%3D';
  numPages: number = 0;
  pagesRendered: number = 0;
  renderedPages: Set<number> = new Set<number>();
  currentPage: number = 1;
  imgUrl: string = "";

  constructor(private elementRef:ElementRef) { }

  onFileSelected() {
    let $img: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  loadCompleted(pdf: PDFDocumentProxy) {
    this.pagesRendered = 0;
    this.numPages = pdf.numPages;
  }

  pageRendered(e: any) {
    this.pagesRendered += 1;

    if (!this.renderedPages.has(e.pageNumber)) {
      this.renderedPages.add(e.pageNumber);

      if (e.pageNumber == this.currentPage) {
        this.renderPagePreview(this.currentPage);
      }
    }
  }

  onPreviewPage_Click(pageIndex) {
    this.currentPage = pageIndex + 1;

    if (this.renderedPages.has(this.currentPage)) {
      this.renderPagePreview(this.currentPage);
    }
  }

  renderPagePreview(pageNumber: number) {
    setTimeout(() => {
      let canvas = this.elementRef.nativeElement.querySelector('canvas#page' + pageNumber);

      if (canvas) {
        this.imgUrl = canvas.toDataURL("image/jpeg", 0.8);
      }
    }, 200);
  }

  /*@HostListener('click', ['$event.target'])
  onPageClick(el) {
    this.imgUrl = el.toDataURL("image/jpeg", 0.8);
  }*/
}
