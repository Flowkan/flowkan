type StorageKey = "auth" | "user";

type User = {
	id: number;
	name: string;
	email: string;
	photo?: string;
};

type StorageValue<K extends StorageKey> = K extends "user" ? User : string;

export default {
	get<K extends StorageKey>(key: K): StorageValue<K> | null {
		const value = localStorage.getItem(key);
		if (!value) return null;

		if (key === "user") {
			try {
				return JSON.parse(value) as StorageValue<K>;
			} catch {
				return null;
			}
		}

		return value as StorageValue<K>;
	},

	set<K extends StorageKey>(key: K, value: StorageValue<K>) {
		if (key === "user") {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.setItem(key, value as string);
		}
	},

	remove(key: StorageKey) {
		localStorage.removeItem(key);
	},

	clear() {
		localStorage.clear();
	},
};
