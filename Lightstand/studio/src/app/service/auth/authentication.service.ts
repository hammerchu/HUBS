import { Injectable, NgZone } from '@angular/core';

// import { User } from "../shared/users";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { GoogleAuthProvider } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import { DatabaseService } from '../../service/database.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  auth_landing_url = '/tabs/Screens'; //jump to this page after auth
  userData: any;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    // private dataPassing: DataPassingService,
    public router: Router,
    public ngZone: NgZone,
    private databaseService: DatabaseService,
    // private screenPage: Tab2Page
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        // this.dataPassing.currentUser = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Login in with email/password
  SignIn(email:string, password:any) {
    // return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password)
    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }
  // Register user with email/password
  RegisterUser(email:string, password:any) {
    // return this.ngFireAuth.auth.createUserWithEmailAndPassword(email, password)
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

  // Returns true when user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }
  // Sign in with Gmail
  googleAuth() {
    return this.authLogin(new GoogleAuthProvider(), false);
  }
  // Sign in with Gmail
  facebookAuth() {
    return this.authLogin(new FacebookAuthProvider(), false);
  }

  // Auth providers
  authLogin(provider, isRedirect = false) {
    // return this.ngFireAuth.auth.signInWithPopup(provider)
    return this.ngFireAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([this.auth_landing_url]);
          if (isRedirect) { // used in main login, not used in login modal
            this.router.navigate([this.auth_landing_url]); //not used for now~
            console.log('Auth service: log in successfully');
          }
          this.databaseService.showLoginModal = false; //close the log in modal
          this.databaseService.subscribeUser(); // update user data variables
          });
        this.databaseService.getUserData(result.user.uid).then(resp => { // test if the user already exist in the DB
          // do nothing if th
          console.log('Unexpected situation:', result.user.uid);
          console.log('resp.isNewUser:', resp.isNewUser);

        }).catch((error) => {
          // If the user uid is not found from the firebase/users DB
          console.log('user record not found');
          console.log('Welcome new user!', result.user.uid);
          this.initalizeUserData(result.user); // initalize the record

        });
      }).catch((error) => {
        console.log('Create new account Error');
        window.alert(error);
      });
  }
  // intialize user in localStorage when the user create account
  initalizeUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lang: 'en',
      role: 'Reviewer',
      isNewUser: false,
    };
    console.log('Set user: ', userData);
    return userRef.set(userData, {
      merge: true
    });
  }
  // ↓↓↓↓↓ Sign-out
  SignOut() {
    // return this.ngFireAuth.auth.signOut().then(() => {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.router.navigate(['/product-info']);
      this.databaseService.currentUser = null; //reset the current User
    });
  }

}
