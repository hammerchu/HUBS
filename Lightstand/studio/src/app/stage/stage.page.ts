import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ToastServiceService } from '../service/toast-service.service'
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../service/database.service'
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { StorageService } from '../service/storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

// Import the editor functionality
import {
  // Import the default image reader and writer
  createDefaultImageReader,
  createDefaultImageWriter,
  createMarkupEditorToolStyle,
  createMarkupEditorToolStyles,
  createDefaultColorOptions,
  createMarkupEditorToolbar,

  // The method used to register the plugins
  setPlugins,

  // The plugins we want to use
  plugin_crop,
  plugin_finetune,
  plugin_annotate,

  // The user interface and plugin locale objects
  locale_en_gb,
  plugin_crop_locale_en_gb,
  plugin_finetune_locale_en_gb,
  plugin_annotate_locale_en_gb,
  plugin_sticker_locale_en_gb,

  // Because we use the annotate plugin we also need
  // to import the markup editor locale and the shape preprocessor
  markup_editor_locale_en_gb,
  createDefaultShapePreprocessor,

  // Import the default configuration for the markup editor and finetune plugins
  markup_editor_defaults,
  plugin_finetune_defaults, } from '@pqina/pintura';

// This registers the plugins with Pintura Image Editor
setPlugins(plugin_crop, plugin_finetune, plugin_annotate);

import {appendNode, getEditorDefaults, createNode, updateNode, findNode, insertNodeBefore, processImage, PinturaNode } from '@pqina/pintura';
import { interval } from 'rxjs';




@Component({
  selector: 'app-stage',
  templateUrl: './stage.page.html',
  styleUrls: ['./stage.page.scss'],
})
export class StagePage implements OnInit {

  @ViewChild('imgEditor') imgEditor?: any;
  @ViewChild('guideEditor') guideEditor?: any;
  @ViewChild('maskEditor') maskEditor?: any;

  prompt = '';

  guideLayerLimit = 3

  /* Dropdown menu options and default value */
  projectDimension = 'square'
  projectStyle = 'photo'
  projectType = 'fashion'


  constructor(
    private datePipe: DatePipe,
    public modal: ModalController,
    public toast: ToastController,
    public toastService: ToastServiceService,
    public databaseService: DatabaseService,
    public storageService: StorageService,
    private sanitizer: DomSanitizer,
    private elementRef:ElementRef,
  ) { }

  ngOnInit() {
    // setInterval(this.test, 5000)
  }
  ngAfterViewInit() {
    // var buttonEditImage = this.elementRef.nativeElement.querySelector('#guideEditorImage').addEventListener('click', this.onClick.bind(this));;

  }

  test(){
    console.log('editor: ', this.guideEditor);

    this.guideEditor.loadImage('./assets/images/man_alpha.png').then((imageWriterResult:any) => {
      // Logs resulting image
      console.log(imageWriterResult);
    });
  }

  generate(){
    console.log('generating new images');
  }


  /**
   * PHOTO EDITOR
   */
  // src = 'https://firebasestorage.googleapis.com/v0/b/studio-c4f49.appspot.com/o/Assets%2F18777010_41094060_1000.jpg?alt=media&token=0b727bfb-1b9b-4cf7-ab90-74bc6998f84e';
  // src = 'https://pqina.nl/pintura/test/cors/test.jpeg';
  // src = ''
  // src = 'assets/images/1024_1024.png';
  whiteBkgd = 'assets/images/1024_1024.png';
  editorSrcImage = this.whiteBkgd;
  // editorSrcGuide = 'assets/images/1024_1024.png';
  editorSrcGuide = this.whiteBkgd;
  imageBackgroundImage = this.whiteBkgd;
  srcImage = this.editorSrcImage
  srcGuide = this.editorSrcGuide
  guideUtils = ['annotate']

  downloadFile(file:any){
    // Create a hidden link and set the URL using createObjectURL
    const link = document.createElement('a');
    link.style.display = 'none';
    let binaryData = [];
    binaryData.push(file);
    link.href = window.URL.createObjectURL(new Blob(binaryData));

    // link.href = URL.createObjectURL(file);
    link.download = file.name;

    // We need to add the link to the DOM for "click()" to work
    document.body.appendChild(link);
    link.click();

    // To make this work on Firefox we need to wait a short moment before clean up
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        document.removeChild(link);
    }, 0);
  };

  // Our editor configuration
  options: any = getEditorDefaults({
    // This will read the image data (required)
    imageReader: createDefaultImageReader(),
    // This will write the output image
    imageWriter: createDefaultImageWriter({ quality: 0.5 }),
    // The markup editor default options, tools, shape style controls
    ...markup_editor_defaults,
    // The finetune util controls
    ...plugin_finetune_defaults,
    // This handles complex shapes like arrows / frames
    shapePreprocessor: createDefaultShapePreprocessor(),
    // This will set a square crop aspect ratio
    imageCropAspectRatio: 1,
    imageCropMaxSize:{ width: 512, height: 512 },
    animations: false,

  })
  optionsGuide: any = getEditorDefaults({
    // This will read the image data (required)
    imageReader: createDefaultImageReader(),
    // This will write the output image
    imageWriter: createDefaultImageWriter({ quality: 0.5 }),
    // The markup editor default options, tools, shape style controls
    ...markup_editor_defaults,
    // This handles complex shapes like arrows / frames
    shapePreprocessor: createDefaultShapePreprocessor(),
    // This will set a square crop aspect ratio
    imageCropAspectRatio: 1,
    imageCropMaxSize:{ width: 512, height: 512 },
    animations: false,
  })

  locale =  {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
    ...plugin_finetune_locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
    ...plugin_sticker_locale_en_gb,
    labelButtonExport: 'Save',
    shapeLabelButtonSelectSticker: 'Import Image'
  }
  localeGuide =  {
    ...locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
    labelButtonExport: 'Save',
  }
  localeMask =  {
    ...locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
    labelButtonExport: 'Save',
  }
  // markupEditorToolStyles: any = createMarkupEditorToolStyles({
  //   // key, style
  //   sharpie: createMarkupEditorToolStyle('Pen', {
  //       strokeWidth: '2%',
  //       strokeColor: createDefaultColorOptions().olive,
  //       disableStyle: ['strokeWidth'],
  //   }),
  // });

  markupEditorToolbar: any = createMarkupEditorToolbar([
    'sharpie',
    'eraser',
    'rectangle',
    'ellipse',
    'arrow',
    'text',
  ]);



  // Callback function for done Processing image
  imageResult?: string = undefined;
  guideResult?: string = undefined;
  maskResult?: string = undefined;
  handleEditorProcess(imageState: any): void {
    var activePanel = this.allDisplayMode[this.currentDisplayModeIndex]
    console.log('handleEditorProcess', imageState, activePanel);
    // this.downloadFile(imageState.dest);

    let binaryData = [];
    binaryData.push(imageState.dest);
    // link.href = window.URL.createObjectURL(new Blob(binaryData));

    let editorResult = <string>(
      this.sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(new Blob(binaryData))
        )
    );
    console.log(' this.editorResult : ', editorResult );
    if (this.showPanel['image']){
      this.imageResult = editorResult;
    }
    else if (this.showPanel['guide']){
      for (let i = 0; i < this.guideLayerObject.length; i++) {
        if (this.guideLayerObject[i].visiable === true){
          this.guideLayerObject[i].preview = editorResult
        }
      }
      //update the stacked preview
      // this.guideResult = editorResult;
    }
    else if (this.showPanel['mask']){
      this.maskResult = editorResult;
    }
    else{
      console.log('Error, unknown panel export');
    }
  }

  // Callback unction for editor update
  lastUpdateTimerstamp:any = new Date();
  handleEditorUpdate($event:any) {
    var timestamp:any = new Date();
    var diffInSec = (timestamp.getTime() - this.lastUpdateTimerstamp.getTime()) / 1000;
    var shallUpdate = false;
    if (diffInSec > 3){
      shallUpdate = true; // if the timestamp has a 3sec gaop then we will export the current drawing
      this.willProcessImage(); // TODO - doesn't work yet, won't trigger image state dest
    }
    this.lastUpdateTimerstamp = timestamp;
    shallUpdate = false;
  }

  // Log all editor events to console
  handleEvent = (type: string, detail: any): void => {
    console.log(type, detail);
  };

  willProcessImage = async (): Promise<boolean> => {
    return true;
  };


  // willRenderToolbar = (
  //     toolbar: PinturaNode[],
  //     env: any,
  //     redraw: () => void
  // ): PinturaNode[] => {
  //     console.log('TOOLBAR', toolbar);
  //     // logs: [ Array(4), Array(4), Array(4) ]

  //     // console.log(env);
  //     // logs: { orientation: "landscape", verticalSpace: "short", … }

  //     // call redraw to trigger a redraw of the editor state

  //     // insert your item
  //     return [
  //         // this.displayModeButton,
  //         // createNode('div', 'my-div', { textContent: 'Hello world' }),
  //         ...toolbar,
  //     ];
  // };

  currentDisplayModeIndex:number = 0;
  allDisplayMode:string[] = ['plain', 'ghost', 'outline'];
  switchDisplayMode(){
    console.log('external function');
    this.currentDisplayModeIndex = (this.currentDisplayModeIndex + 1 )% this.allDisplayMode.length;
    if(this.allDisplayMode[this.currentDisplayModeIndex]==='plain'){
      this.updateGuideBkgdImg(false);
    }
    else if(this.allDisplayMode[this.currentDisplayModeIndex]==='ghost'){
      this.updateGuideBkgdImg(true);
    }
    else if(this.allDisplayMode[this.currentDisplayModeIndex]==='outline'){
      this.updateGuideBkgdImg(false);
    }
    else{
      console.log("Error - unknown display mode");

    }
  }

  // Guide layers
  // guideLayerObject = [{visiable:true, preview:''}, {visiable:false, preview:''}, {visiable:false, preview:''},  {visiable:false, preview:''}]
  guideLayerObject = [{visiable:true, preview:''}]
  selectGuideLayer(index:Number){
    console.log(`selectGuideLayer ${index}`);

    for (let i = 0; i < this.guideLayerObject.length; i++) {
      if (i === index){
       this.guideLayerObject[i].visiable = true;
      }
      else{
        this.guideLayerObject[i].visiable = false;
      }
    }
    // Make the selected layer active
  }
  addGuideLayer(){
    if (this.guideLayerObject.length < this.guideLayerLimit){
      this.guideLayerObject.push({visiable:true, preview:''})
    }
    else{
      alert("Guide layers reached limit")
    }

  }

  updateGuideBkgdImg(turnOn:any){
    if (turnOn===true){
      console.log('Add src guide');
      this.imageBackgroundImage ='assets/images/man_alpha.png'
      this.guideUtils = ['annotate']
    }
    else{
      console.log('Remove src guide');
      this.imageBackgroundImage = this.whiteBkgd;
      this.guideUtils = ['annotate']
    }
    // this.backgdImg = this.guideLayerObject[0].preview;
  }










  /**
   * DROP FILES
   */
  public tryFiles: NgxFileDropEntry[] = [];
  public acceptFiles: FileSystemFileEntry[] = [];
  // public acceptFileData: any[] = [];
  public acceptFilePath:any[] = [];
  public toastButtons = [
    {
      text: 'Action With Long Text',
    }
  ];
  async dropped(tryFiles: NgxFileDropEntry[]) {
    console.log('dropped', tryFiles);

    this.tryFiles = tryFiles;
    console.log(' tryFiles : ', tryFiles );

    var count = 0;
    for (const droppedFile of tryFiles) {

      // for this use case we only upload the first file
      if (count === 0){
      // Is it a file and is of the types that we accept?
        if (droppedFile.fileEntry.isFile) {
          // only include file types that we accept
          if (this.checkFileType(droppedFile.fileEntry.name)){

            // convert object type to FileSystemFileEntry for more parameters
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

            this.acceptFiles.push(fileEntry);
            this.acceptFilePath.push(droppedFile.relativePath);

            fileEntry.file((file: File) => {
              // work with the file

              // collect the relative path(e.g. folderName/fileName) data

              console.log('acceptFilePath', this.acceptFilePath);
              console.log('Per file', file, file.size, droppedFile.relativePath);

              this.confirmUpload(this.acceptFiles, this.acceptFilePath, '/Assets')

            })
          }
          else{
            alert("Invalid file type")
          }
        }
        else{
          alert("Please upload an image")
        }
        count++;
      }
    }


  }
  confirmUpload(acceptFiles:FileSystemFileEntry[], acceptFilePath:string[], currentPath:string){
    this.storageService.fileUpload(acceptFiles, acceptFilePath, currentPath).then((resp)=>{
      console.log('File uploaded');

      // Show toast
      this.toastService.simpleToast(`File ${acceptFiles[0].name} uploaded`, 3000).then(()=>{
      }).finally(()=>{
        this.storageService.progressNum = [];
      });
    })
  }
  // cancelUpload(){
  //   this.tryFiles = [];
  //   this.acceptFiles  = [];
  //   this.showDropzone = false;
  // }
  fileOver($event:any){
    console.log('file over', $event);

  }
  fileLeave($event:any){
    console.log('file leave', $event);
  }
  checkFileType(fileName: string){
    // check if file are in the allowed type
    // return boolean
    let isFileAllowed = false;
    const allowedFiles = ['.jpg', '.jpeg', '.png'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0]) {
          isFileAllowed = true;
        }
      }
    }
    // console.log(fileName, isFileAllowed );
    return isFileAllowed;
  }



  /**
   * LOGIN
   */
  showLoginModal(){
    this.databaseService.showLoginModal = true;
  }



  /**
   * IMAGE PREVIEWER MODAL
   */
  isShowPreviewerModal = false;
  showPreviewerModal(){
    this.isShowPreviewerModal = true;
  }
  dismissPreviewerModal(){
    console.log('close the modal');
    // this.modalController.dismiss();
    this.isShowPreviewerModal = false;
  }



  /**
   * PANELS
   */
  showPanel:any = {'image': true, 'guide': false, 'mask': false };
  switchPanel(panelName:string){
    for (const key of Object.keys(this.showPanel)) {
      // let value = this.hideDirs[key];
      console.log(key );
      if (key === panelName){
        this.showPanel[key] = true;
      }
      else{
        this.showPanel[key] = false;
      }
    }
    console.log(' this.showPanel : ', this.showPanel );
  }





}
