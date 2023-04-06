import { Component, OnInit, ViewChild } from '@angular/core';

import {
  appendDefaultEditor,
  createDefaultImageWriter,
  createNode,
  appendNode,
  findNode,
  getEditorDefaults,
  insertNodeBefore,
  PinturaNode,
} from '@pqina/pintura';


@Component({
  selector: 'app-refine',
  templateUrl: './refine.page.html',
  styleUrls: ['./refine.page.scss'],
})
export class RefinePage implements OnInit {

  @ViewChild('editor') myEditor?: any;

  editorDefaults:any = getEditorDefaults();
  src = 'https://pqina.nl/pintura/test/cors/test.jpeg';

  constructor() { }

  ngOnInit() {
    // this.attachExportMenu(this.editorDefaults);
  }

  //
  // helper functions
  //
  h = (name:any, attributes:any, children:any[] = []) => {
    const el = document.createElement(name);
    const descriptors = Object.getOwnPropertyDescriptors(el.__proto__);
    for (const key in attributes) {
        if (key === 'style') {
            el.style.cssText = attributes[key];
        } else if (
            (descriptors[key] && descriptors[key].set) ||
            /textContent|innerHTML/.test(key) ||
            typeof attributes[key] === 'function'
        ) {
            el[key] = attributes[key];
        } else {
            el.setAttribute(key, attributes[key]);
        }
    }
    children.forEach((child) => el.appendChild(child));
    return el;
  };

  downloadFile = (file:any) => {
    // Create a hidden link and set the URL using `createObjectURL`
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(file);
    link.download = file.name;

    // We need to add the link to the DOM for "click()" to work
    document.body.appendChild(link);
    link.click();

    // To make this work on Firefox we need to wait a short moment before clean up
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        // @ts-ignore: Object is possibly 'null'.
        link.parentNode.removeChild(link);
    }, 0);
  };

  browse = () =>
  new Promise((resolve) => {
      // create file input box
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.position = 'absolute';
      fileInput.style.visibility = 'hidden';
      fileInput.accept = 'image/*';
      fileInput.onchange = function () {
          const file = fileInput.files;

          // remove for safari
          fileInput.remove();

          if (!file) return resolve(undefined);
          resolve(file);
      };

      // add to doc for safari
      document.body.append(fileInput);

      // open browse window
      fileInput.click();
  });


  isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // safari claims to be able to copy but can't, firefox can't
  canCopyToClipboard = !this.isSafari() && 'ClipboardItem' in window;

  wrapIcon = (svg:any) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`;

  getCropSelectPresetOptions = (ratios:any) => [
  [undefined, 'Custom'],
  ...ratios.map((a:any, b:any) => [a / b, `${a}:${b}`]),
  ];

  //
  // custom menu
  //
  attachToggleFullscreen = (editor:any, toolbar:any, env:any, redraw:any) => {
    const isFullscreen =
        document.documentElement.hasAttribute('data-fullscreen');

    insertNodeBefore(
        createNode('Button', 'toggle-fullscreen', {
            label: 'Toggle fullscreen',
            hideLabel: true,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${
                isFullscreen
                    ? '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>'
                    : '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>'
            }</svg>`,
            onclick: () => {
                document.documentElement.toggleAttribute('data-fullscreen');
                redraw();
            },
        }),
        'select-photo',
        toolbar[0]
    );
  };
  attachSelectPhoto(editor:any, toolbar:any){
    insertNodeBefore(
        createNode('Button', 'select-photo', {
            label: 'Select Photo',
            onclick: () => {
                this.browse().then((file) => {
                    editor.src = file;
                });
            },
        }),
        'alpha-set',
        toolbar[0]
    );
  };
  attachExportMenu(editor:any, toolbar?:any){
    // skip not ready yet
    if (!editor.imageFile) return toolbar;

    // get file type
    const fileType = editor.imageFile.type || 'image/png';

    // create panel content
    const form = this.h(
      'form',
      {
          class: 'export-form',
          onchange: () => {
              let outputPNG:any, outputQualityRow  = window;

              // hide quality for png
              // outputQualityRow.
              outputQualityRow.disabled = outputPNG?.checked;

              // get values and update editor output settings
              editor.imageWriter = createDefaultImageWriter({
                  // quality: parseFloat(outputQualityRange.value),
                  quality: 80.0,
                  mimeType: form.elements['outputType'].value,
              });
          },
      },
      [
          // format row
          this.h(
              'fieldset',
              { class: 'outputTypes' },
              [
                  this.h('legend', { textContent: 'Image format' }),
                  // jpeg
                  this.h('input', {
                      id: 'outputJPEG',
                      type: 'radio',
                      name: 'outputType',
                      value: 'image/jpeg',
                      checked: fileType === 'image/jpeg',
                  }),
                  this.h('label', { for: 'outputJPEG', textContent: 'JPEG' }),
                  // webp

                  !this.isSafari() &&
                      this.h('input', {
                          id: 'outputWEBP',
                          type: 'radio',
                          name: 'outputType',
                          value: 'image/webp',
                          checked: fileType === 'image/webp',
                      }),

                  !this.isSafari() &&
                      this.h('label', {
                          for: 'outputWEBP',
                          textContent: 'WEBP',
                      }),

                  // png
                  this.h('input', {
                      id: 'outputPNG',
                      type: 'radio',
                      name: 'outputType',
                      value: 'image/png',
                      checked: fileType === 'image/png',
                  }),
                  this.h('label', { for: 'outputPNG', textContent: 'PNG' }),
              ].filter(Boolean)
          ),

          // compression row
          this.h(
              'fieldset',
              {
                  id: 'outputQualityRow',
                  disabled: fileType === 'image/png',
              },
              [
                  this.h('legend', { textContent: 'Image quality' }),
                  this.h('div', { class: 'number-slider' }, [
                      this.h('input', {
                          id: 'outputQualityRange',
                          type: 'range',
                          min: 0,
                          max: 1,
                          value: 1,
                          step: 0.01,
                          oninput: () => {
                              let {
                                  outputQualityRange,
                                  outputQualityNumber,
                              } = window;
                              outputQualityNumber = 80.0
                              // outputQualityNumber = Math.round(
                              //     outputQualityRange.value * 100
                              // );
                          },
                      }),
                      this.h('input', {
                          id: 'outputQualityNumber',
                          type: 'number',
                          min: 0,
                          value: 100,
                          max: 100,
                          step: 1,
                          oninput: () => {
                            let {
                              outputQualityRange,
                              outputQualityNumber,
                            } = window;
                            outputQualityNumber = 80.0
                          },
                      }),
                      this.h('span', {
                          textContent: '%',
                      }),
                  ]),
              ]
          ),

          // download button
          this.h('div', { class: 'outputActions' }, [
            this.h('button', {
                  type: 'button',
                  innerHTML: `<span>${this.wrapIcon(
                      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>'
                  )} <span>Download</span></span>`,
                  onclick: () => {
                      editor.processImage().then(( dest:any ) => {
                        this.downloadFile(dest);
                      });
                  },
              }),

              // copy button
              this.h('button', {
                  id: 'outputCopy',
                  type: 'button',
                  title: 'Can only copy PNG',
                  innerHTML: `<span>${this.wrapIcon(
                      '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>'
                  )}<span>Copy</span></span>`,
                  onclick: () => {
                      editor
                          .processImage({
                              imageWriter: createDefaultImageWriter({
                                  mimeType: 'image/png',
                              }),
                          })
                          .then((dest:any) => {
                              const item = new ClipboardItem({
                                  'image/png': dest,
                              });

                              navigator.clipboard
                                  .write([item])
                                  .then(() => {
                                      editor.status =
                                          'Copied to clipboard!';
                                  })
                                  .catch((error) => {
                                      editor.status =
                                          "Couldn't copy to clipboard";
                                      console.log(error);
                                  })
                                  .finally(() => {
                                      setTimeout(() => {
                                          editor.status = undefined;
                                      }, 750);
                                  });
                          });
                  },
                  ...(!this.canCopyToClipboard ? { hidden: true } : {}),
              }),

              // print
              this.h('button', {
                  type: 'button',
                  title: 'Print',
                  innerHTML: `<span>${this.wrapIcon(
                      '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>'
                  )}</svg></span>`,
                  onclick: () => {
                      editor
                          .processImage({
                              imageWriter: createDefaultImageWriter({
                                  mimeType: 'image/png',
                              }),
                          })
                          .then(( dest:any, imageState:any) => {
                              const { width, height } = imageState.crop;
                              const img = new Image();
                              img.src = URL.createObjectURL(dest);
                              img.className = 'for-printer';
                              img.dataset['orientation'] =
                                  width / height >= 1
                                      ? 'landscape'
                                      : 'portrait';
                              document.body.append(img);

                              // write print css
                              let pageStyle =
                                  document.getElementById('print-style')!;
                              if (!pageStyle) {
                                  pageStyle = this.h('style', {
                                      id: 'print-style',
                                  });
                                  document.head.append(pageStyle);
                              }

                              // update print page orientation
                              pageStyle.textContent = `@page {size:A4 ${img.dataset['orientation']};margin:0}`;

                              // wait for image to load just to be sure
                              img.onload = () => {
                                  window.print();
                              };
                          });
                  },
              }),
          ]),
      ]
  );

  // clean up for-print after print
  window.addEventListener('afterprint', () => {
    Array.from(document.querySelectorAll('.for-printer')).forEach(
        (element:any) => {
            const src = element.src;
            if (src) URL.revokeObjectURL(src);
            element.remove();
        }
    );
  });

  //
  // editor
  //
  // editor = appendDefaultEditor('.my-editor', {
  editor = appendDefaultEditor(this.myEditor, {
    enableDropImage: true,
    enablePasteImage: true,
    enableBrowseImage: true,
    enableButtonExport: false,
    imageWriter: {
        quality: 1,
    },
    utils: [
        'crop',
        'filter',
        'finetune',
        'annotate',
        'frame',
        'redact',
        'resize',
    ],
    cropSelectPresetFilter: 'landscape',
    cropSelectPresetOptions: this.getCropSelectPresetOptions([
        [1, 1],
        [2, 1],
        [3, 2],
        [7, 5],
        [4, 3],
        [5, 4],
        [16, 10],
        [16, 9],
        [21, 9],
        [1, 2],
        [2, 3],
        [5, 7],
        [3, 4],
        [4, 5],
        [10, 16],
        [9, 16],
        [9, 21],
    ]),
  });

  // editor.willRenderToolbar = (toolbar:any, env:any, redraw:any) => {
  //   this.attachSelectPhoto(editor, toolbar);
  //   this.attachToggleFullscreen(editor, toolbar, env, redraw);
  //   this.attachExportMenu(editor, toolbar);
  //   return [...toolbar];
  // };


}


willRenderToolbar = (
    toolbar: PinturaNode[],
    env: any,
    redraw: () => void
  ): PinturaNode[] => {
    console.log('TOOLBAR', toolbar);
    this.attachSelectPhoto(this.myEditor, toolbar);
    this.attachToggleFullscreen(this.myEditor, toolbar, env, redraw);
    this.attachExportMenu(this.myEditor, toolbar);

    // insert your item
    return [
        // createNode('div', 'my-div', { textContent: 'Hello world' }),
        ...toolbar,
    ]
  }

}
