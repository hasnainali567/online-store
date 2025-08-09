import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, arrayRemove, Timestamp, collection, updateDoc, arrayUnion, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";



const firebaseConfig = {
  apiKey: "AIzaSyBtewJrnAZ1ZBqA0dTxWhuOOqx3gXp3M9g",
  authDomain: "online-store-a895a.firebaseapp.com",
  projectId: "online-store-a895a",
  storageBucket: "online-store-a895a.firebasestorage.app",
  messagingSenderId: "1088111085428",
  appId: "1:1088111085428:web:9592aa4ec9ef1305814e21",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  getDoc,
  getDocs,
  addDoc,
  signOut,
  sendEmailVerification,
  collection,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  arrayRemove,
  Timestamp
}

let products = [{
  title: "Mechanical Gaming Keyboard",
  brand: "HyperTech",
  rating: 4.7,
  description: "RGB backlit mechanical keyboard with blue switches for ultimate gaming performance.",
  availability: "In Stock",
  stock: 50,
  warrantyInformation: "2 years warranty",
  price: 89.99,
  images: ["https://cdn.thewirecutter.com/wp-content/media/2025/03/BEST-MECHANICAL-KEYBOARDS-2048px-0673.jpg"],
  category: "computers"
},
{
  title: "27-inch 4K UHD Monitor",
  brand: "ViewMax",
  rating: 4.5,
  description: "Crystal clear 4K UHD resolution with 144Hz refresh rate for gamers and professionals.",
  availability: "In Stock",
  stock: 25,
  warrantyInformation: "3 years warranty",
  price: 299.99,
  images: ["https://static.webx.pk/files/19643/Images/asus-tuf-vg289q1a-monitor-price-in-pakistan-4-19643-742638-040423031114201.jpg"],
  category: "computers"
},
{
  title: "Wireless Noise Cancelling Headphones",
  brand: "SoundSphere",
  rating: 4.6,
  description: "Over-ear Bluetooth headphones with active noise cancellation and 40-hour battery life.",
  availability: "In Stock",
  stock: 40,
  warrantyInformation: "1 year warranty",
  price: 159.99,
  images: ["https://appleman.pk/cdn/shop/products/Model-P9-Headphone-5.jpg?v=1667811930"],
  category: "electronics"
},
{
  title: "Gaming Mouse with RGB Lighting",
  brand: "ClickPro",
  rating: 4.4,
  description: "Ergonomic gaming mouse with customizable DPI and RGB effects.",
  availability: "In Stock",
  stock: 80,
  warrantyInformation: "1 year warranty",
  price: 49.99,
  images: ["https://static-01.daraz.pk/p/8743024fa6c2a7a62f8a2d85ca0d4b46.jpg"],
  category: "computers"
},
{
  title: "1TB Portable SSD",
  brand: "DataVault",
  rating: 4.8,
  description: "High-speed portable SSD with USB-C connectivity for fast file transfers.",
  availability: "In Stock",
  stock: 35,
  warrantyInformation: "3 years warranty",
  price: 129.99,
  images: ["https://static-01.daraz.pk/p/90b645e35d59803b1ae3975cdcfdfc31.jpg"],
  category: "storage"
},
{
  title: "Smartwatch with AMOLED Display",
  brand: "TimeTech",
  rating: 4.3,
  description: "Fitness tracking smartwatch with heart rate monitor and GPS.",
  availability: "In Stock",
  stock: 60,
  warrantyInformation: "1 year warranty",
  price: 199.99,
  images: ["https://leyjao.pk/images/thumbnails/270/270/detailed/657/Black___White_Gradient_2_Day_Sale_Instagram_Post__10_.png"],
  category: "wearables"
},
{
  title: "4TB External Hard Drive",
  brand: "MegaStore",
  rating: 4.5,
  description: "Reliable 4TB external hard drive for backups and data storage.",
  availability: "In Stock",
  stock: 45,
  warrantyInformation: "2 years warranty",
  price: 99.99,
  images: ["https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/t/r/transcend_external_hdd_storejet_25m3_4tb_myshop_pk_3.jpg"],
  category: "storage"
},
{
  title: "USB-C Hub with 7 Ports",
  brand: "PortMaster",
  rating: 4.2,
  description: "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.",
  availability: "In Stock",
  stock: 70,
  warrantyInformation: "1 year warranty",
  price: 39.99,
  images: ["https://img.drz.lazcdn.com/static/pk/p/8051593fd48edeb5f5439f1a3e49c0cd.jpg_720x720q80.jpg"],
  category: "accessories"
},
{
  title: "Full HD Webcam with Microphone",
  brand: "ClearView",
  rating: 4.4,
  description: "1080p webcam with built-in stereo microphone for streaming and video calls.",
  availability: "In Stock",
  stock: 55,
  warrantyInformation: "1 year warranty",
  price: 59.99,
  images: ["https://logitech.onlinesalestore.pk/cdn/shop/products/logitech-c920-hd-pro-webcam-01-logitech-pakistan.jpg?v=1639383757"],
  category: "accessories"
},
{
  title: "Gaming Laptop 15.6-inch",
  brand: "PowerX",
  rating: 4.8,
  description: "High-performance gaming laptop with Intel i7, RTX 3060, and 16GB RAM.",
  availability: "In Stock",
  stock: 20,
  warrantyInformation: "2 years warranty",
  price: 1299.99,
  images: ["https://static.webx.pk/files/83855/Images/Thumbnails-Large/hp-victus-15-fa2701wm-gaming-laptop-15.6-inch,-intel-core-i5-83855-2383426-120625071341205.jpg"],
  category: "computers"
},]


// async function uploadProducts(params) {
//   for (let product of products) {
//     try {
//       await addDoc(collection(db, "products"), product);
//       console.log(`✅ Added: ${product.title}`);
//     } catch (error) {
//       console.error("❌ Error adding document: ", error);
//     }
//   }
// }

// uploadProducts()