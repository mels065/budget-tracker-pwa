const DB_NAME = 'Budget Tracker';
const DB_VERSION = 1;

let db;
let objectStore;

const request = window.indexedDB.open(DB_NAME, DB_VERSION);

request.onerror = err => console.log("Something went wrong with IndexedDB:", err);

request.onupgradeneeded = event => {
    db = event.target.result;

    objectStore = db.createObjectStore('transactions', { keyPath: "id", autoIncrement: true });
}

request.onsuccess = event => {
    console.log("Database sucessfully connected");
    db = event.target.result;
}

const saveRecord = transaction => {
    console.log('Saved transaction');
    const transactionObjectStore = db.transaction(
        ["transactions"],
        "readwrite"
    ).objectStore("transactions");
    transactionObjectStore.add(transaction);
}
