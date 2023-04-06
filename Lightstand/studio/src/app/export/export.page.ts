import { Component, OnInit, ViewChild } from '@angular/core';

import { getEditorDefaults } from '@pqina/pintura';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('buttonLoadImage') buttonLoadImage?: any;

    @ViewChild('editor') editor?: any;

    editorDefaults: any = getEditorDefaults();

    handleButtonClick(): void {
        this.editor.loadImage('my-image.jpeg').then((imageReaderResult:any) => {
            // Logs loaded image data
            console.log(imageReaderResult);
        });
    }

}
