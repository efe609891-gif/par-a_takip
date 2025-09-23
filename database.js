// Veritabanı Yönetim Sistemi
class Database {
    constructor() {
        this.dbName = 'AracParcaDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('Veritabanı başarıyla açıldı');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Araçlar tablosu
                if (!db.objectStoreNames.contains('vehicles')) {
                    const vehicleStore = db.createObjectStore('vehicles', { keyPath: 'id' });
                    vehicleStore.createIndex('brand', 'brand', { unique: false });
                    vehicleStore.createIndex('vin', 'vin', { unique: true });
                    vehicleStore.createIndex('status', 'status', { unique: false });
                }
                
                // Parçalar tablosu
                if (!db.objectStoreNames.contains('parts')) {
                    const partStore = db.createObjectStore('parts', { keyPath: 'id' });
                    partStore.createIndex('vehicleId', 'vehicleId', { unique: false });
                    partStore.createIndex('name', 'name', { unique: false });
                }
                
                // Satışlar tablosu
                if (!db.objectStoreNames.contains('sales')) {
                    const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
                    salesStore.createIndex('vehicleId', 'vehicleId', { unique: false });
                    salesStore.createIndex('date', 'date', { unique: false });
                }
                
                // Kullanıcılar tablosu
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id' });
                    userStore.createIndex('username', 'username', { unique: true });
                    userStore.createIndex('role', 'role', { unique: false });
                }
            };
        });
    }

    // Araç ekleme
    async addVehicle(vehicle) {
        const transaction = this.db.transaction(['vehicles'], 'readwrite');
        const store = transaction.objectStore('vehicles');
        return new Promise((resolve, reject) => {
            const request = store.add(vehicle);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Araç güncelleme
    async updateVehicle(vehicle) {
        const transaction = this.db.transaction(['vehicles'], 'readwrite');
        const store = transaction.objectStore('vehicles');
        return new Promise((resolve, reject) => {
            const request = store.put(vehicle);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Tüm araçları getir
    async getAllVehicles() {
        const transaction = this.db.transaction(['vehicles'], 'readonly');
        const store = transaction.objectStore('vehicles');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Araç silme
    async deleteVehicle(id) {
        const transaction = this.db.transaction(['vehicles'], 'readwrite');
        const store = transaction.objectStore('vehicles');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Parça ekleme
    async addPart(part) {
        const transaction = this.db.transaction(['parts'], 'readwrite');
        const store = transaction.objectStore('parts');
        return new Promise((resolve, reject) => {
            const request = store.add(part);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Araç parçalarını getir
    async getVehicleParts(vehicleId) {
        const transaction = this.db.transaction(['parts'], 'readonly');
        const store = transaction.objectStore('parts');
        const index = store.index('vehicleId');
        return new Promise((resolve, reject) => {
            const request = index.getAll(vehicleId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Satış ekleme
    async addSale(sale) {
        const transaction = this.db.transaction(['sales'], 'readwrite');
        const store = transaction.objectStore('sales');
        return new Promise((resolve, reject) => {
            const request = store.add(sale);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Kullanıcı ekleme
    async addUser(user) {
        const transaction = this.db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        return new Promise((resolve, reject) => {
            const request = store.add(user);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Kullanıcı getir
    async getUser(username) {
        const transaction = this.db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('username');
        return new Promise((resolve, reject) => {
            const request = index.get(username);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Raporlar
    async getSalesReport(startDate, endDate) {
        const transaction = this.db.transaction(['sales'], 'readonly');
        const store = transaction.objectStore('sales');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const sales = request.result;
                const filtered = sales.filter(sale => {
                    const saleDate = new Date(sale.date);
                    return saleDate >= startDate && saleDate <= endDate;
                });
                resolve(filtered);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Yedekleme
    async exportData() {
        const vehicles = await this.getAllVehicles();
        const parts = await this.getAllParts();
        const sales = await this.getAllSales();
        
        return {
            vehicles,
            parts,
            sales,
            exportDate: new Date().toISOString()
        };
    }

    // Geri yükleme
    async importData(data) {
        try {
            // Araçları geri yükle
            for (const vehicle of data.vehicles) {
                await this.addVehicle(vehicle);
            }
            
            // Parçaları geri yükle
            for (const part of data.parts) {
                await this.addPart(part);
            }
            
            // Satışları geri yükle
            for (const sale of data.sales) {
                await this.addSale(sale);
            }
            
            console.log('Veri başarıyla geri yüklendi');
            return true;
        } catch (error) {
            console.error('Veri geri yükleme hatası:', error);
            return false;
        }
    }
}

// Global veritabanı instance
window.database = new Database();