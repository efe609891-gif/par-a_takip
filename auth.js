// Kullanıcı Yönetim Sistemi
class AuthManager {
    constructor(database) {
        this.db = database;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Varsayılan admin kullanıcısı oluştur
        await this.createDefaultAdmin();
        
        // Kayıtlı kullanıcıyı yükle
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // Varsayılan admin oluştur
    async createDefaultAdmin() {
        const admin = {
            id: 'admin',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'Sistem Yöneticisi',
            email: 'admin@parcatakip.com',
            createdAt: new Date().toISOString()
        };
        
        try {
            await this.db.addUser(admin);
            console.log('Varsayılan admin kullanıcısı oluşturuldu');
        } catch (error) {
            console.log('Admin kullanıcısı zaten mevcut');
        }
    }

    // Giriş yap
    async login(username, password) {
        try {
            const user = await this.db.getUser(username);
            if (user && user.password === password) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Giriş hatası:', error);
            return false;
        }
    }

    // Çıkış yap
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Kullanıcı yetkisi kontrol et
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const permissions = {
            'admin': ['read', 'write', 'delete', 'export', 'import'],
            'user': ['read', 'write'],
            'viewer': ['read']
        };
        
        return permissions[this.currentUser.role]?.includes(permission) || false;
    }

    // Kullanıcı bilgilerini getir
    getCurrentUser() {
        return this.currentUser;
    }
}

// Global auth instance
window.auth = new AuthManager(window.database);