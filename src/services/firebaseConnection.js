import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let firebaseConfig = {
  apiKey: "AIzaSyDZ26qrW7ePZQ4aSi3okR7VErz31G6D28c",
  authDomain: "chamados-e665c.firebaseapp.com",
  projectId: "chamados-e665c",
  storageBucket: "chamados-e665c.appspot.com",
  messagingSenderId: "469741550564",
  appId: "1:469741550564:web:6b9bdad85554e34b2865f1",
  measurementId: "G-NXCN3HP3S7"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

