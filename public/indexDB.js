const database = `BudgetDB`;
const storeName = "transactionData";
const request = window.indexedDB.open(database, 1);

if (!window.indexedDB) {
  console.log("Your browser doesn't support IndexedDB.");
};

request.onerror = function (e) {
  console.log("Something Broke");
};

request.onupgradeneeded = function (e) {
  let db = e.target.result;
  const objectStore = db.createObjectStore(storeName, { autoIncrement: true });
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("value", "value", { unique: false });
};

request.onsuccess = function (e) {
  db = e.target.result;
  tx = db.transaction(storeName, "readwrite");
  store = tx.objectStore(storeName);

  const newTransaction = db.transaction([storeName], "readwrite");
  const objStore = newTransaction.objectStore(storeName);

  const all = objStore.getAll();
  all.onsuccess = function () {
    if (all.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(all.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const newTransaction = db.transaction([storeName], "readwrite");
          const objectStore = newTransaction.objectStore(storeName);
          objectStore.clear();
        });
    }
  };
};
