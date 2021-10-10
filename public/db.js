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
    const transactionObjectStore = db.transaction(
        ["transactions"],
        "readwrite"
    ).objectStore("transactions");
    transactionObjectStore.add(transaction);
    console.log('Saved transaction');
}

const pushRecords = () => {
    let offlineTransactions = [];
    let transactionsObjectStore = db.transaction(
        ["transactions"],
        "readwrite"
    ).objectStore("transactions");
    transactionsObjectStore.openCursor().onsuccess = evt => {
        const cursor = evt.target.result;
        if (cursor) {
            offlineTransactions.push(cursor.value);
            cursor.continue();
        } else {
            fetch(
                '/api/transaction/bulk',
                {
                    method: 'POST',
                    body: JSON.stringify(offlineTransactions),
                    headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                    }
                }
            ).then(() => {
                transactionsObjectStore = db.transaction(
                    ["transactions"],
                    "readwrite"
                ).objectStore("transactions");
                console.log(transactionsObjectStore);
                transactionsObjectStore.clear();
                console.log("Pushed offline transactions to server");
            }).catch(err => console.log("Could not push transactions", err));
        }
    }
}

window.addEventListener('online', () => {
    pushRecords();
});
