let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("BudgetList", { autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;
};

request.onerror = function (event) {
  console.log(`Woops! ${event.target.errorCode}`);
};

function checkDatabase() {
  let transaction = db.transaction(["BudgetStore"], "readwrite");

  const store = transaction.objectStore("BudgeStore");

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
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(["BudgetStore"], "readwrite");

            const currentStore = transaction.objectStore("BudgetStore");
            currentStore.clear();
          }
        });
    }
  };
}

request.onsuccess = function (event) {
  console.log("success");
  db.event.target.result;

  if (navigator.onLine) {
    console.log("Backed online!");
    checkDatabase();
  }
};

const saveRecord = (record) => {
  const transaction = db.transaction(["BudgetStore"], "readwrite");

  const store = transaction.objectStore("BudgetStore");

  store.add(record);
};

window.addEventListener("online", checkDatabase);
