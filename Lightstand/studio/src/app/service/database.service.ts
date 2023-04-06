import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { type } from 'os';
// import { DatePipe } from '@angular/common';
import { Constraint } from '../service/interface.model'
import { ToastServiceService } from '../service/toast-service.service'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  showLoginModal = false;
  currentUser: any;
  userData: any;
  userId: any;

  constructor(public afStore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    // public datepipe: DatePipe,
    public toastService: ToastServiceService,) {
    // this.subscribeUser();
  }




  // /**
  //  * extract playback history
  //  */
  // getPlaybackHistoryBy(screenId, date, collectionName: string = 'history'){

  //     // var today = this.datepipe.transform((new Date), 'yyyy-MM-dd');

  //     return this.afStore.collection(
  //       `${collectionName}/${screenId}/${date}` ,
  //       ref => ref // get only the latest ONE record
  //     ).valueChanges();
  // }


  // /**
  // Video files inside channel
  // */
  // // return an array of video files associate with a channel
  // getAllVideoByChannelId(channelId, collectionName: string = 'channel'){
  //   return new Promise((resolve, reject) => {
  //     this.afStore.doc(`channels/${channelId}`).get().subscribe(ref => {
  //       if (!ref.exists) {
  //         console.log('getAllVideoByChannelId: id not found');// //DOC DOES NOT EXIST
  //         reject();
  //       }
  //       else {
  //         resolve(ref.data()['playlist']);
  //         // console.log("data: ", this.data) //LOG ENTIRE DOC
  //       }
  //     });
  //   })
  // }

  // /**
  // Schedule
  // */
  // //get a list of all schedule for a screen
  // getScheduleByScreenId(screenId, date, collectionName: string = 'schedule') {
  //   return this.afStore.collection(
  //     collectionName + "/" + screenId + "/" + date
  //   ).snapshotChanges();
  // }
  // //get a list of all schedule for all screen
  // collection
  // getScheduleForAllScreens( date, collectionName: string = 'schedule') {
  //   return new Promise((resolve, reject) => {
  //     var scheduleList = {};

  //     var today = this.datepipe.transform((new Date), 'yyyy-MM-dd');
  //     this.getScreenList().subscribe((data) => {
  //       console.log(' screen list : ', data );
  //       for (let hour = 0; hour < 24; hour++) {
  //         for (let index = 0; index < data[0]['screenData'].length; index++) {

  //           const screen = data[0]['screenData'][index];
  //           var screenSchedule = []
  //           this.afStore.doc(`schedule/${screen.id}/${today}/${hour}`).get().toPromise().then(res => {
  //             this.collection = res.data();
  //             if (this.collection !==undefined){
  //               var re ={
  //               screenId: this.collection.screenId,
  //               hour: this.collection.hour,
  //               channels: this.collection.channel.map(v => v.name)
  //               }

  //               screenSchedule.push(re)
  //             }
  //             if ((index === data[0]['screenData'].length -1 ) && (hour >= 23 )) {
  //               console.log('return schedulList');
  //               scheduleList[hour] = screenSchedule
  //               resolve(scheduleList)
  //             }
  //             else{
  //               scheduleList[hour] = screenSchedule
  //             }
  //           });
  //         }

  //       }
  //     })

  //   // var screenList = [];
  //   // var scheduleList = [];
  //   // var today = this.datepipe.transform((new Date), 'yyyy-MM-dd');
  //   // this.getScreenList().subscribe((data) => {
  //   //   console.log(' data : ', data[0]['screenData'] );
  //   //   for (let index = 0; index < data[0]['screenData'].length; index++) {
  //   //     const screen = data[0]['screenData'][index];
  //   //     console.log(index, ' screen.id : ', screen.id );

  //   //     screenList.push(screen.id)

  //   //     scheduleList.push(this.afStore.doc(
  //   //       // collectionName + "/" + screen.id + "/"
  //   //       collectionName + "/" + screen.id + "/" + today + "/" + "10"
  //   //     ).get())

  //   //     if (index + 1 === data[0]['screenData'].length){
  //   //       console.log('return schedulList');
  //   //       resolve(scheduleList)
  //   //     }

  //   //   }
  //   // })
  //   })


  // }



  // /*
  // Channel
  // */
  // //remove a channel
  // deleteChannel(id, collectionName: string = 'channels'){
  //   return new Promise((resolve, reject) => {
  //     this.afStore.doc(`${collectionName}/${id}/`).delete()
  //     .then(result => {
  //       resolve(result);
  //     }).catch(err => {
  //       reject(err);
  //     });
  //   });
  // }

  // // Update one set of data from DB base on id, field
  // updateChannelField(id, field, value, collectionName: string = 'channels'): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.afStore.doc(`${collectionName}/${id}/`).update({
  //       [field]: value,
  //     }).then(result => {
  //       resolve(result);
  //     }).catch(err => {
  //       reject(err);
  //     });
  //   });
  // }

  // // Update all the data from DB base on id
  // updateChannel(id:string, name: string, channelType: string, playlist: string[], metaData, collectionName: string = 'channels') {
  //   const channelRef: AngularFirestoreDocument<any> = this.afStore.doc(`${collectionName}/${id}`);
  //   const channelData = {
  //     name: name,
  //     // id: id,
  //     isArchive: false,
  //     // channelType: channelType,
  //     // constraint: [],
  //     playlist: playlist,
  //     totalDurationMin: metaData.min,
  //     totalDurationSec: metaData.sec,
  //     totalSize: metaData.size
  //   };
  //   console.log(`Update channel ${id} : ${channelData}`);
  //   console.log('ChannelData : ', channelData );
  //   return channelRef.update(channelData);
  // }

  // // Get channel data from DB by id
  // getChannelDataById(id): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.afStore.doc(`channels/${id}`).get().subscribe(ref => {
  //       if (!ref.exists) {
  //         console.log('getChannelDataById: id not found');// //DOC DOES NOT EXIST
  //         reject();
  //       }
  //       else {
  //         resolve(ref.data());
  //       }
  //     });
  //   });
  // }


  // //add a new channel
  // addNewChannel(id: string, name: string, channelType: string, playlist: string[], metaData, collectionName: string = 'channels') {
  //   // var id = this.generateRandomId();
  //   const channelRef: AngularFirestoreDocument<any> = this.afStore.doc(`${collectionName}/${id}`);
  //   const channelData = {
  //     name: name,
  //     id: id,
  //     isArchive: false,
  //     channelType: channelType,
  //     constraint: [],
  //     playlist: playlist,
  //     totalDurationMin: metaData.min,
  //     totalDurationSec: metaData.sec,
  //     totalSize: metaData.size
  //   };
  //   console.log('Add new channel: ', channelData);
  //   return channelRef.set(channelData, {
  //     merge: true
  //   });
  // }

  // //get a list of all channel
  // getChannelList(collectionName: string = 'channels') {
  //   return this.afStore.collection(
  //     collectionName
  //   // ).valueChanges(); // use subscribe to read
  //   ).snapshotChanges();
  // }

  // // update constraint data of channel record
  // updateChannelConstraint(id: string, data: Constraint, field = 'constraint', collectionName = 'channels'): Promise<any> {
  //   console.log(' id : ', id, 'data : ', data);
  //   return new Promise((resolve, reject) => {
  //     this.afStore.doc(`${collectionName}/${id}/`).update({
  //       [field]: data,
  //     }).then(result => {
  //       console.log(' result : ', result);
  //       resolve(result);
  //     }).catch(err => {
  //       console.log(' err : ', err);
  //       reject(err);
  //     });
  //   });
  // }
  // getChannelConstraint(id: string, field = 'constraint', collectionName = 'channels') {
  //   return this.afStore.collection(
  //     collectionName,
  //     ref => ref.where('id', '==', id)
  //   ).valueChanges();
  // }






  // /**
  //  * SCREENS
  //  */

  // /**
  //  *
  //  * UPLOAD gSHEET DATA TO DB
  //  *
  //  * timestamp needs to be y-m-d to avoid JAN23 being earlier than DEC22
  //  */
  // uploadScreenSheet(screenData, collectionName: string = 'screens') {
  //   var id = this.generateRandomId();
  //   const screenRef: AngularFirestoreDocument<any> = this.afStore.doc(`${collectionName}/${id}`);
  //   const screenSheet = {
  //     id: id,
  //     timestamp: this.datepipe.transform((new Date), 'yyyy-MM-dd HH:mm:ss'),
  //     screenData: screenData,
  //   }
  //   return screenRef.set(screenSheet, {
  //     merge: false
  //   });
  // }

  // // Download the most recent gSheet data from DB
  // getScreenList(collectionName: string = 'screens') {

  //   return this.afStore.collection(
  //     collectionName,
  //     ref => ref.orderBy('timestamp', 'desc').limit(1)
  //   ).valueChanges();
  // }

  // // search and turn one uuid device to approved=true
  // updateApproval(uuid, collectionName: string = 'device') : Promise<any> {
  //   return new Promise((resolve, reject) => {

  //     // obtaining snapshot of the device collection, should return just one match
  //     var deviceRef =  this.afStore.collection(
  //       collectionName,
  //       ref => ref.where('uuid', '>=', uuid).where('uuid', '<=', uuid+'z') // special way to test if uuid contains substring
  //       ).snapshotChanges()

  //     //
  //     deviceRef.subscribe((resp)=>{

  //       // if there is no found, shows an error
  //       if (!resp[0] ){
  //         this.toastService.customToast(`Screen id ${uuid} not found`, 'middle')
  //         reject();
  //       }

  //       // if found, update the value of 'approved' to true
  //       if (!resp[0].payload.doc.data()['approved']){
  //         var id = resp[0].payload.doc.data()['uuid']
  //         this.afStore.doc(`${collectionName}/${id}/`).update({
  //           approved: true,
  //         }).then(result => {
  //           console.log(' result : ', result);
  //           resolve(result);
  //         }).catch(err => {
  //           reject(err);
  //         });
  //       }
  //     })
  //   })
  // }

  // // determine if the uuid is current listed at the device DB
  // hasUuid(uuid, collectionName: string = 'device') : Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     // obtaining snapshot of the device collection, should return just one match
  //     var deviceRef =  this.afStore.collection(
  //       collectionName,
  //       ref => ref.where('uuid', '>=', uuid).where('uuid', '<=', uuid+'z') // special way to test if uuid contains substring
  //       ).snapshotChanges()

  //     deviceRef.subscribe((resp)=>{
  //       // if there is no found, shows an error
  //       if (!resp[0] ){
  //         resolve(true);
  //       }
  //       else{
  //         resolve(false);
  //       }
  //     })
  //   })
  // }


  // /*
  // User Auth
  // */
  // //get user data with uid
  // getUserData(uid): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.afStore.doc(`users/${uid}`).get().subscribe(ref => {
  //       if (!ref.exists) {
  //         console.log('getUserData: uid not found');// //DOC DOES NOT EXIST
  //         reject();
  //       }
  //       else {
  //         resolve(ref.data());
  //         // console.log("data: ", this.data) //LOG ENTIRE DOC
  //       }
  //     });
  //   });
  // }

  // // subscribe to the log in status
  // public subscribeUser() {
  //   console.log('Start subscribe user ');
  //   this.angularFireAuth.authState.subscribe((user) => {
  //     // console.log('DP: user : ', user );
  //     if (user === null) { // if there is no sign-ined user
  //       console.log('Please log in to continue writing');
  //       this.showLoginModal = true;
  //       // return;
  //     }
  //     //store current user
  //     console.log(' user : ', user);
  //     this.currentUser = user;
  //     // this.userId = user.uid; //same as currentUser but just the user id
  //     // console.log('USER ID : ', this.userId );

  //     // ↓↓↓↓↓ Getting user data
  //     this.getUserData(user.uid).then(
  //       (userData) => {
  //         console.log(' userData : ', userData)
  //         this.userData = userData;
  //       }
  //     );
  //   },
  //     err => console.log('ERROR', err));
  // }


  // /*
  // Utilities
  // */
  // generateRandomId() {
  //   return this.afStore.createId();
  // }

  // /*
  // Config
  // */
  //  getSchedulerConfig(collectionName:string = 'settings'): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //             this.afStore.doc(`settings/master`).get().subscribe(ref => {
  //               if (!ref.exists) {
  //                 console.log('getConfig: uid not found');// //DOC DOES NOT EXIST
  //                 reject();
  //               }
  //               else {
  //                 resolve(ref.data());
  //                 console.log("config: ", ref.data()) //LOG ENTIRE DOC
  //               }
  //             });
  //       });
  //  }


  //  updateSchedulerConfig(config, collectionName:string = 'settings'): Promise<any> {
  //    return new Promise((resolve, reject) => {
  //      this.afStore.doc(`${collectionName}/master/`).update({
  //        config
  //      }).then(result => {
  //        resolve(result);
  //      }).catch(err => {
  //        reject(err);
  //      });
  //    });

  //  }

  // /*
  // Connectivity
  // */
  // getScreenConnectivity(screenId, collectionName: string = 'history'){
  //   // var today = '12-24-2022'
  //   var today = this.datepipe.transform((new Date), 'yyyy-MM-dd');

  //   return this.afStore.collection(
  //     `${collectionName}/${screenId}/${today}` ,
  //     ref => ref.orderBy('timestamp', 'desc' ).limit(1) // get only the latest ONE record
  //   ).valueChanges();
  // }


  dismissModal(){
    console.log('close the modal');
    // this.modalController.dismiss();
    this.showLoginModal = false;
  }


}
