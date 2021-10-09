const DB_NAME = 'Budget Tracker';

let db;
let transactionRequestObjectStore;

const request = window.indexedDB.open(DB_NAME, 1);

request.onerror = err => console.log("Something went wrong with IndexedDB:", err);

request.onupgradeneeded = event => {
    db = event.target.result;

    const objectStore = db.createObjectStore('transactionRequests', { keyPath: "id", autoIncrement: true });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });

    objectStore.transaction.oncomplete = event => {
        transactionRequestObjectStore = db.transaction(
            "transactionRequests",
            "readwrite"
        ).objectStore("transactionRequests");
    }
}
