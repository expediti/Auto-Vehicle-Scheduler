interface CustomerRecord {
  id?: string;
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  vehicleNumber: string;
  purchaseDate: string;
  createdAt: string;
}

const DB_NAME = 'VehicleServiceDB';
const STORE_NAME = 'customers';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: false,
        });
        objectStore.createIndex('registrationNumber', 'registrationNumber', { unique: true });
        objectStore.createIndex('customerName', 'customerName', { unique: false });
      }
    };
  });
}

export async function saveCustomer(customer: CustomerRecord): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const customerData = {
      ...customer,
      id: customer.id || crypto.randomUUID(),
      createdAt: customer.createdAt || new Date().toISOString(),
    };

    const request = store.put(customerData);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCustomers(): Promise<CustomerRecord[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const records = request.result;
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(records);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
