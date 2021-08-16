let db;

const request = indexedDB.open('budget' , 1);

request.onupgradeneeded = function (event) {

    const db = event.target.result;
    db.createObjectStore('BudgetList', { autoIncrement: true });
    };

    
    request.onsuccess = event => {
        db = event.request.result;

    }



    request.onerror = function (event) {
      console.log(`Woops! ${event.target.errorCode}`);
    };

