(function(global){
  "use strict";
  function createOfflineDatabase(options){
    const dbName=options.dbName,stateStore="state",outboxStore="outbox";
    let databasePromise=null;
    function open(){
      if(!global.indexedDB)return Promise.reject(new Error("IndexedDB indisponível"));
      if(databasePromise)return databasePromise;
      databasePromise=new Promise((resolve,reject)=>{
        const request=global.indexedDB.open(dbName,1);
        request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(stateStore))db.createObjectStore(stateStore,{keyPath:"key"});if(!db.objectStoreNames.contains(outboxStore))db.createObjectStore(outboxStore,{keyPath:"key"});};
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>reject(request.error);
      });
      return databasePromise;
    }
    async function transact(storeName,mode,operation){const db=await open();return new Promise((resolve,reject)=>{const transaction=db.transaction(storeName,mode),request=operation(transaction.objectStore(storeName));request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);transaction.onabort=()=>reject(transaction.error);});}
    const record=(key,value,metadata)=>({key,value:structuredClone(value),savedAt:new Date().toISOString(),metadata:metadata||{}});
    return {
      getState:key=>transact(stateStore,"readonly",s=>s.get(key)),
      putState:(key,value,metadata)=>transact(stateStore,"readwrite",s=>s.put(record(key,value,metadata))),
      getPending:key=>transact(outboxStore,"readonly",s=>s.get(key)),
      enqueue:(key,value,metadata)=>transact(outboxStore,"readwrite",s=>s.put(record(key,value,metadata))),
      removePending:key=>transact(outboxStore,"readwrite",s=>s.delete(key))
    };
  }
  global.createOfflineDatabase=createOfflineDatabase;
})(window);
