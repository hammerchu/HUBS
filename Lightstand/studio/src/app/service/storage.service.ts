import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { updateMetadata, getMetadata, getStorage, ref, deleteObject, listAll, getDownloadURL } from 'firebase/storage';
import { Observable, Subscriber } from 'rxjs';
import { map, finalize, tap } from 'rxjs/operators';
// import { VideoService } from '../service/video.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // debug = false;

  // /* for listing folder and files on storage */
  public storageFileList: any[] = []
  // public storageFolderList: any[] = []

  /* for fileupload */
  ngFireUploadTask: AngularFireUploadTask;
  progressNum: Observable<number|any>[] = []; // array of progress percentage
  progressSnapshot: Observable<any>;
  fileUploadedPath: Observable<string>[] = []; // aray of file path(e.g. /pc_foldername/filesname)
  fileName: string = '';
  fileSize: number = 0;
  // public fileDuration: number;

  isFileUploading: boolean = false;
  isFileUploaded: boolean = false;

  constructor(private angularFireStorage: AngularFireStorage,
    // public videoService: VideoService,
    ) {
  }


  /**Upload file to a specific location at the storage */
  fileUpload(files: FileSystemFileEntry[], filePath: string[], folder: string) {

    return new Promise(resolve => {
    this.progressNum = [];
    // for (const file of files) {
    for (let i = 0; i < files.length; i++) {
      files[i].file((file: File) => {

        this.isFileUploading = true;
        this.isFileUploaded = false;

        // const fileStoragePath = `${folder}/${file.name}`;
        const fileStoragePath = `${folder}/${filePath[i]}`;

        // create referrence for the file
        const fileRef = this.angularFireStorage.ref(fileStoragePath);

        // create firestorage task
        this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

        this.progressNum.push(this.ngFireUploadTask.percentageChanges());

        this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
          finalize(() => {
            const filepath = fileRef.getDownloadURL();
            this.fileUploadedPath.push(filepath);
            this.isFileUploading = false;
            this.isFileUploaded = true;

            //update the folder and file list and thus preview
            // this.getStorageListAll(folder)

            filepath.subscribe(path => {
              console.log('filepath : ', path);
              resolve(path);
            }, error => {
              console.log('ERROR', error);
            });

            // //Add custom metaData for duration
            // this.videoService.getVideoMeta(file).then((duration: string) => {
            //   const newMetadata = {
            //     customMetadata: {
            //       'duration': duration
            //     }
            //   }
            //   const storage = getStorage();
            //   const forestRef = ref(storage, fileStoragePath);
            //   updateMetadata(forestRef, newMetadata)
            //     .then((metadata) => {
            //       console.log('Updated file metaData');
            //       resolve(true);
            //     }).catch((error) => {
            //       console.log('Error updating storage metdata');
            //     });
            // }
            // )

          }),
          tap(snap => {
            console.log('snap', snap);
          })
        );
        this.progressSnapshot.subscribe((resp) => {
          console.log('done', i, resp);
        })
      })
    }
    })
  }


  // /** Get a complete list of content from firebase storage
  //  *
  //  * @param folder the path of the folder to explore (e.g. ads/client_folder/campaign_folder)
  //  * @param recursive WIP - If true, then it will return all the folder and files in the tree
  //  * @param onlyFile WIP - only when recursive is true, it selectivly only return files butnot folders
  //  */
  // getStorageListAll(folder: string, recursive: boolean = false, onlyFile: boolean = true) {
  //   // return new Promise(resolve => {
  //   this.storageFolderList = []
  //   this.storageFileList = []

  //   const storage = getStorage();
  //   const listRef = ref(storage, folder);

  //   // Find all the prefixes and items.
  //   listAll(listRef)
  //     .then((res) => {

  //       // loop all the folders
  //       res.prefixes.forEach((folderRef) => {
  //         this.storageFolderList.push(folderRef)
  //       });

  //       // loop all the files
  //       res.items.forEach((itemRef) => {
  //         var index = 0;
  //         if (this.debug) {
  //           console.log(' itemRef : ', itemRef);
  //         }
  //         const downloadUrl = getDownloadURL(ref(storage, itemRef.fullPath));
  //         downloadUrl.then((url) => {
  //           if (this.debug) {
  //             console.log('Download url : ', url);
  //           }
  //           // get meta data from storage ref
  //           getMetadata(itemRef)
  //             .then((metadata) => {

  //               // calculate and store duration min and sec

  //               var durationMin = Number(metadata.customMetadata.duration) / 60;

  //               const itemObject = {
  //                 'downloadUrl': url, // for the html video tag
  //                 'ref': itemRef, // for removing file from storage
  //                 'name': itemRef.name,
  //                 'min': durationMin,
  //                 // 'sec': durationSec,
  //                 'size': metadata.size/100000
  //               }
  //               this.storageFileList.push(itemObject)
  //               console.log(' this.storageFileList : ', this.storageFileList );
  //             })
  //             // If the clip has no metaData
  //             .catch((error) => {
  //               console.log('unable to get meta data from clips');
  //               const itemObject = {
  //                 'downloadUrl': url, // for the html video tag
  //                 'ref': itemRef, // for removing file from storage
  //                 'name': itemRef.name
  //               }
  //               this.storageFileList.push(itemObject)

  //             });


  //         });
  //         index++;
  //       });
  //       // resolve(true);
  //     }).catch((error) => {
  //       console.log(' error : ', error);
  //       // Uh-oh, an error occurred!
  //     });
  //   // });
  // }

  // // Temp vatiation function for Drag and Drop UX - should be refined soon
  // // ONLY handle files but NOT folders
  // // result array is returned after getting all the url from all the files
  // getStorageListAll2(folder: string, recursive: boolean = false, onlyFile: boolean = true) {
  //   return new Promise(resolve => {

  //     const storage = getStorage();
  //     const listRef = ref(storage, folder);

  //     var returnList: any[] = []

  //     // Find all the (not prefixes) and items.
  //     listAll(listRef)
  //       .then((res) => {

  //         // loop all the files
  //         var index = 0
  //         res.items.forEach((itemRef) => {

  //           console.log(' itemRef : ', itemRef );

  //           // If the item is our tmp folder placeholder,
  //           // only increase index so that we can return fulfill the resolve
  //           if (itemRef.name === 'tmp'){
  //             index++
  //           }
  //           // For video items, calculate metadata and add them to a itemObject array
  //           else{
  //             const downloadUrl = getDownloadURL(ref(storage, itemRef.fullPath));
  //             downloadUrl.then((url) => {

  //               getMetadata(itemRef)
  //                 .then((metadata) => {

  //                   // if duration is not found in metadata, set duration param zero
  //                   if (!metadata.customMetadata){
  //                     var durationMin = 0;
  //                     var durationSec = 0;
  //                   }
  //                   else{
  //                     // Otherwise, calculate duration Min and Sec
  //                     if (Number(metadata.customMetadata.duration) / 60 < 1) {
  //                       var durationMin = 0;
  //                       var durationSec = Math.floor(Number(metadata.customMetadata.duration) % 60);
  //                     }
  //                     else {
  //                       var durationMin = Number(metadata.customMetadata.duration) / 60;
  //                       var durationSec = Math.floor(Number(metadata.customMetadata.duration) % 60);
  //                     }
  //                   }

  //                   // construct a item object
  //                   const itemObject = {
  //                     'url': url, // for the html video tag
  //                     'ref': itemRef, // for removing file from storage
  //                     'name': itemRef.name,
  //                     'min': durationMin,
  //                     'sec': durationSec,
  //                     'size': metadata.size/100000
  //                   }
  //                   // console.log('collecting results');
  //                   returnList.push(itemObject)
  //                   index++;

  //                 }).catch((error)=>{
  //                   console.log(' Error collecting result : ', error);
  //                   index++;
  //                 }).finally(()=>{
  //                   // wait until we finish looping all the items
  //                   // console.log('collecting index : ', index );

  //                   if (index === res.items.length) {
  //                     console.log('Resolve: ', returnList);
  //                     resolve(returnList); // return all the items
  //                   }
  //                 })
  //             })
  //           }
  //         });
  //       }).catch((error) => {
  //         console.log(' error : ', error);
  //       })
  //   });
  // }

  // /** return a simple list of item - for library file and folder removal */
  // itemList;
  // async getFolderContent(folder: string) {
  //   return new Promise(resolve => {
  //     this.itemList = [];
  //     this.listLoop(folder).then(()=>{
  //       // console.log('loop this.itemList : ', this.itemList.map(v=>v.fullPath), this.itemList.length );
  //       return resolve(this.itemList)
  //     });
  //   })
  // }
  // // recursive loop
  // listLoop(folder){
  //   return new Promise(resolve => {

  //   // preparation for listAll()
  //   const storage = getStorage();
  //   const listRef = ref(storage, folder);

  //   // Find all the prefixes and items recursivly
  //   listAll(listRef)
  //     .then((res) => {

  //       // FILEs
  //       res.items.forEach((itemRef) => {
  //         this.itemList.push(itemRef)
  //       })

  //       // FOLDERs
  //       res.prefixes.forEach((prefixRef) => {
  //         // recursive call with promise
  //         return resolve(this.listLoop(prefixRef.fullPath))
  //       })

  //       // important: when the loop exhausted, return
  //       return resolve(1);

  //     })

  //   })
  // }



  // /** Delete files from storage - folders will be deleted automatically when its empty */
  // deleteStorageItem(item) {

  //   return new Promise(resolve => {

  //     console.log(' deleteStorageItem : ', item.fullPath);

  //     const storage = getStorage();

  //     // Create a reference to the file to delete
  //     const desertRef = ref(storage, item.fullPath);

  //     // Delete the file
  //     deleteObject(desertRef).then(() => {
  //       // File deleted successfully
  //       resolve(true)
  //     }).catch((error) => {
  //       console.log('ERROR', error);
  //     });
  //   })
  // }


  // /** Add an empty folder at a specific location of storage */
  // addNewFolder(folderName, path){

  //   var hiddenFile = new File([""], "filename");
  //   var hiddenFileName = 'tmp'

  //   // const fileStoragePath = `${folder}/${file.name}`;
  //   const fileStoragePath = `${path}/${folderName}/${hiddenFileName}`;

  //   // create referrence for the file
  //   const fileRef = this.angularFireStorage.ref(fileStoragePath);

  //   // create firestorage task
  //   this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, hiddenFile);

  //   this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
  //     finalize(() => {
  //       const filepath = fileRef.getDownloadURL();
  //       this.fileUploadedPath.push(filepath);
  //       this.isVideoUploading = false;
  //       this.isVideoUploaded = true;

  //       //update the folder and file list and thus preview
  //       this.getStorageListAll(path)

  //       filepath.subscribe(path => {
  //         console.log('filepath : ', path);

  //       }, error => {
  //         console.log('ERROR', error);
  //       });

  //     }),
  //     tap(snap => {
  //       console.log('snap', snap);
  //     })
  //   );
  //   this.progressSnapshot.subscribe((resp) => {
  //     // console.log('done', i, resp);
  //   })


  // }






}

