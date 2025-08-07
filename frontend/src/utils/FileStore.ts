import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('mediaDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', {
          autoIncrement: true
        });
      }
    }
  });
};

export const saveFile = async (file: File): Promise<string> => {
  try {
    const db = await initDB();
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    const key = await store.add(file);
    await tx.done;
    console.log(`✅ File saved with key: ${key}`);
    return key as string;
  } catch (err) {
    console.error(`💥 Failed to save file`, err);
    throw err;
  }
};

export const getFile = async (id: number): Promise<File | null> => {
  try {
    const db = await initDB();
    const tx = db.transaction('files', 'readonly');
    const store = tx.objectStore('files');
    const file = await store.get(id);
    return file ?? null;
  } catch (err) {
    console.error(`💥 Failed to get file: ${id}`, err);
    return null;
  }
};

