const firebaseConfig = {
  apiKey: "AIzaSyD11np2u3JzxgZWUTY6B5-lzHJCLVCvCcs",
  authDomain: "everything-c2500.firebaseapp.com",
  projectId: "everything-c2500",
  storageBucket: "everything-c2500.firebasestorage.app",
  messagingSenderId: "677277780983",
  appId: "1:677277780983:web:3528aad88e6838194cfcf2",
};

// Inisialisasi Firebase
// Gunakan 'firebase.initializeApp' karena kita menggunakan SDK versi compat
firebase.initializeApp(firebaseConfig);

// Buat shortcut untuk layanan yang akan sering kita gunakan
const auth = firebase.auth();

// Di masa depan, Anda akan menambahkan layanan lain di sini:
const db = firebase.firestore();
// const storage = firebase.storage();
