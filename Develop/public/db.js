const indexedDB =
  window.indexedDB ||
  window.mozIndexDB ||
  window.webkitIndexedDB ||
  msIndexedDB ||
  window.shimIndexedDB;

let db;
let budgetVersion;

const request = indexedDB.open("budgetDB", budgetVersion || 21);

request.onupgradeneeded = function (event) {
  let db = event.target.result;
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetStore", { autoIncrement: true });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;

  if(navigator.onLine){
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log(`Woops! ${event.target.errorCode}`);
};

function checkDatabase() {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          
            const transaction = db.transaction(["BudgetStore"], "readwrite");
            const currentStore = transaction.objectStore("BudgetStore");
            currentStore.clear();
          
        });
    }
  };
};

const saveRecord = (record) => {
  console.log("Save record invoked");
  const transaction = db.transaction(["BudgetStore"], "readwrite");

  const store = transaction.objectStore("BudgetStore");

  store.add(record);
};

window.addEventListener("online", checkDatabase);
