import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { StoredFont } from "../types/fonts";

interface UrduTextPngMakerDBSchema extends DBSchema {
  fonts: {
    key: string;
    value: StoredFont;
    indexes: {
      "by-family": string;
      "by-addedAt": number;
    };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: any;
    };
  };
}

const DB_NAME = "UrduTextPngMakerDB";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<UrduTextPngMakerDBSchema>> | null = null;

function getDB(): Promise<IDBPDatabase<UrduTextPngMakerDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<UrduTextPngMakerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("fonts")) {
          const fontStore = db.createObjectStore("fonts", { keyPath: "id" });
          fontStore.createIndex("by-family", "family");
          fontStore.createIndex("by-addedAt", "addedAt");
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      }
    });
  }
  return dbPromise;
}

export async function saveFont(font: StoredFont): Promise<void> {
  const db = await getDB();
  await db.put("fonts", font);
}

export async function getFont(id: string): Promise<StoredFont | undefined> {
  const db = await getDB();
  return db.get("fonts", id);
}

export async function getAllFonts(): Promise<StoredFont[]> {
  const db = await getDB();
  return db.getAll("fonts");
}

export async function deleteFont(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("fonts", id);
}

export async function hasFont(id: string): Promise<boolean> {
  const db = await getDB();
  const font = await db.get("fonts", id);
  return font !== undefined;
}

export async function clearFonts(): Promise<void> {
  const db = await getDB();
  await db.clear("fonts");
}

export async function getStorageStats(): Promise<{ count: number; totalBytes: number }> {
  const fonts = await getAllFonts();
  const totalBytes = fonts.reduce((acc, f) => acc + (f.fileSize || f.data.byteLength || 0), 0);
  return {
    count: fonts.length,
    totalBytes
  };
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const db = await getDB();
  await db.put("settings", { key, value });
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDB();
  const record = await db.get("settings", key);
  return record ? (record.value as T) : defaultValue;
}
