export default class ItemsStorage{
    getTenantId(): string {
        return LocalStorage.get(LocalStorageItems.TenantId)
    }

    setTenantId(tenantId: string): void {
        return LocalStorage.set(LocalStorageItems.TenantId, tenantId)
    }

    getClientId(): string {
        return LocalStorage.get(LocalStorageItems.ClientId)
    }

    setClientId(clientId: string): void {
        return LocalStorage.set(LocalStorageItems.ClientId, clientId)
    }
}

class LocalStorage{
    static get(item: LocalStorageItems): string{
        return localStorage.getItem(LocalStorageItems[item]);
    }

    static set(item: LocalStorageItems, value: string): void{
        localStorage.setItem(LocalStorageItems[item], value);
    }

    static remove(item: LocalStorageItems): void{
        localStorage.removeItem(LocalStorageItems[item]);
    }
}

enum LocalStorageItems {
    TenantId,
    ClientId
}