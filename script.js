// Araç Parça Yönetim Sistemi JavaScript Kodu

// Global değişkenler
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let currentVehicleId = null;
let qrScanner = null;

// Örnek araçlar ekle
function addSampleVehicles() {
    const sampleVehicles = [
        {
            id: generateId(),
            brand: 'toyota',
            model: 'corolla',
            year: 2020,
            fuel: 'benzin',
            km: 45000,
            price: 250000,
            color: 'Beyaz',
            vin: 'JT2BF28K123456789',
            condition: 'iyi',
            description: 'Temiz kullanılmış, servis bakımları yapılmış',
            photo: null,
            parts: [
                { id: generateId(), name: 'Motor Yağı', price: 150, description: '5W-30', dateAdded: new Date().toISOString() },
                { id: generateId(), name: 'Fren Balata', price: 300, description: 'Ön fren balata seti', dateAdded: new Date().toISOString() }
            ],
            totalSales: 450,
            status: 'active',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            brand: 'volkswagen',
            model: 'golf',
            year: 2019,
            fuel: 'dizel',
            km: 62000,
            price: 180000,
            color: 'Gri',
            vin: 'WVWZZZ1KZ123456789',
            condition: 'hasarli',
            description: 'Sol ön kapıda küçük çizik var',
            photo: null,
            parts: [
                { id: generateId(), name: 'Egzoz Sistemi', price: 800, description: 'Arka egzoz borusu', dateAdded: new Date().toISOString() }
            ],
            totalSales: 800,
            status: 'active',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            brand: 'ford',
            model: 'focus',
            year: 2018,
            fuel: 'benzin',
            km: 78000,
            price: 120000,
            color: 'Mavi',
            vin: 'WF0AXXGBG123456789',
            condition: 'kazali',
            description: 'Arka tampon değişmiş',
            photo: null,
            parts: [],
            totalSales: 0,
            status: 'scrap',
            dateAdded: new Date().toISOString()
        }
    ];
    
    vehicles = [...vehicles, ...sampleVehicles];
    saveVehicles();
    loadVehicles();
    updateDashboard();
    showMessage('Örnek araçlar eklendi!', 'success');
}

// Marka-Model veritabanı
const vehicleModels = {
    toyota: ['Corolla', 'Camry', 'Yaris', 'Auris', 'Avensis', 'Prius', 'RAV4', 'Highlander', 'Hilux', 'Land Cruiser'],
    volkswagen: ['Golf', 'Polo', 'Passat', 'Jetta', 'Tiguan', 'Touareg', 'Caddy', 'Transporter', 'Beetle', 'Arteon'],
    ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Explorer', 'Mustang', 'Ranger', 'Transit', 'EcoSport', 'Edge'],
    renault: ['Clio', 'Megane', 'Fluence', 'Kadjar', 'Koleos', 'Talisman', 'Captur', 'Twingo', 'Kangoo', 'Master'],
    opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Movano', 'Zafira'],
    fiat: ['Punto', 'Tipo', '500', 'Panda', 'Doblo', 'Ducato', '500X', '500L', 'Toro', 'Cronos'],
    hyundai: ['i10', 'i20', 'i30', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq', 'Genesis'],
    nissan: ['Micra', 'Sentra', 'Altima', 'Maxima', 'Juke', 'Qashqai', 'X-Trail', 'Pathfinder', 'Navara', 'GT-R'],
    honda: ['Civic', 'Accord', 'Fit', 'CR-V', 'Pilot', 'HR-V', 'Ridgeline', 'Insight', 'Passport', 'Odyssey'],
    bmw: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i8'],
    mercedes: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'AMG GT'],
    audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron']
};

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadVehicles();
    updateDashboard();
    setupEventListeners();
    
    // QR kütüphanesini biraz bekleyip kontrol et
    setTimeout(() => {
        checkQRLibrary();
    }, 1000);
    
    // Eğer hiç araç yoksa örnek araçlar ekle
    if (vehicles.length === 0) {
        addSampleVehicles();
    }
});

// QR kütüphanesi kontrolü
function checkQRLibrary() {
    console.log('QR kütüphanesi kontrol ediliyor...');
    console.log('QRCode tipi:', typeof QRCode);
    
    if (typeof QRCode === 'undefined') {
        console.warn('QR kod kütüphanesi yüklenemedi!');
        // Hemen alternatif kütüphane yükle
        loadQRLibrary();
    } else {
        console.log('QR kod kütüphanesi başarıyla yüklendi');
        console.log('QRCode fonksiyonları:', Object.keys(QRCode));
    }
}

// QR kütüphanesini yükle
function loadQRLibrary() {
    console.log('QR kütüphanesi yükleniyor...');
    
    // Önce mevcut script'i kontrol et
    const existingScript = document.querySelector('script[src*="qrcode"]');
    if (existingScript) {
        console.log('QR kütüphanesi zaten yüklenmiş');
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js';
    script.onload = function() {
        console.log('QR kod kütüphanesi başarıyla yüklendi');
        showMessage('QR kod kütüphanesi yüklendi!', 'success');
    };
    script.onerror = function() {
        console.error('QR kod kütüphanesi yüklenemedi, alternatif deneniyor...');
        // Alternatif CDN dene
        loadAlternativeQRLibrary();
    };
    document.head.appendChild(script);
}

// Alternatif QR kütüphanesi yükle
function loadAlternativeQRLibrary() {
    console.log('Alternatif QR kütüphanesi yükleniyor...');
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js';
    script.onload = function() {
        console.log('Alternatif QR kod kütüphanesi başarıyla yüklendi');
        showMessage('QR kod kütüphanesi yüklendi!', 'success');
    };
    script.onerror = function() {
        console.error('Tüm QR kod kütüphaneleri yüklenemedi');
        showMessage('QR kod kütüphanesi yüklenemedi! Alternatif format kullanılacak.', 'error');
    };
    document.head.appendChild(script);
}

// Uygulamayı başlat
function initializeApp() {
    // Tab değiştirme olayları
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Form olayları
    document.getElementById('addVehicleForm').addEventListener('submit', handleAddVehicle);
    document.getElementById('partForm').addEventListener('submit', handleAddPart);
    
    // Arama ve filtreleme
    document.getElementById('searchInput').addEventListener('input', filterVehicles);
    document.getElementById('brandFilter').addEventListener('change', filterVehicles);
    document.getElementById('statusFilter').addEventListener('change', filterVehicles);
    document.getElementById('scrapSearchInput').addEventListener('input', filterScrapVehicles);
}

// Tab göster
function showTab(tabId) {
    // Tüm tab'ları gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Tüm nav-tab'ları pasif yap
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Seçilen tab'ı göster
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Tab'a özel işlemler
    if (tabId === 'vehicles') {
        loadVehicles();
    } else if (tabId === 'scrap-vehicles') {
        loadScrapVehicles();
    } else if (tabId === 'reports') {
        generateReports();
    } else if (tabId === 'qr-scanner') {
        initializeQRScanner();
    }
}

// Marka seçildiğinde modelleri yükle
function loadModels() {
    const brand = document.getElementById('vehicleBrand').value;
    const modelSelect = document.getElementById('vehicleModel');
    
    modelSelect.innerHTML = '<option value="">Model Seçin</option>';
    
    if (brand && vehicleModels[brand]) {
        vehicleModels[brand].forEach(model => {
            const option = document.createElement('option');
            option.value = model.toLowerCase();
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

// Fotoğraf önizleme
function previewPhoto(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Araç Fotoğrafı">`;
        };
        reader.readAsDataURL(file);
    }
}

// Araç ekleme formu
function handleAddVehicle(e) {
    e.preventDefault();
    
    const vehicleData = {
        id: generateId(),
        brand: document.getElementById('vehicleBrand').value,
        model: document.getElementById('vehicleModel').value,
        year: parseInt(document.getElementById('vehicleYear').value),
        fuel: document.getElementById('vehicleFuel').value,
        km: parseInt(document.getElementById('vehicleKm').value),
        price: parseFloat(document.getElementById('vehiclePrice').value),
        color: document.getElementById('vehicleColor').value.trim(),
        vin: document.getElementById('vehicleVin').value.trim(),
        condition: document.getElementById('vehicleCondition').value,
        description: document.getElementById('vehicleDescription').value.trim(),
        photo: null,
        parts: [],
        totalSales: 0,
        status: 'active',
        dateAdded: new Date().toISOString()
    };
    
    // Validasyon
    if (!vehicleData.brand || !vehicleData.model || !vehicleData.year || 
        !vehicleData.fuel || vehicleData.km < 0 || vehicleData.price < 0 || 
        !vehicleData.color || !vehicleData.vin || !vehicleData.condition) {
        showMessage('Lütfen tüm gerekli alanları doğru şekilde doldurun.', 'error');
        return;
    }
    
    // VIN kontrolü
    if (vehicles.some(v => v.vin === vehicleData.vin)) {
        showMessage('Bu VIN numarası zaten kayıtlı!', 'error');
        return;
    }
    
    // Fotoğraf işleme
    const photoFile = document.getElementById('vehiclePhoto').files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            vehicleData.photo = e.target.result;
            saveVehicle(vehicleData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveVehicle(vehicleData);
    }
}

// Araç kaydet
function saveVehicle(vehicleData) {
    vehicles.push(vehicleData);
    saveVehicles();
    resetVehicleForm();
    showMessage('Araç başarıyla eklendi!', 'success');
    updateDashboard();
    showTab('vehicles');
}

// Araçları yükle ve grid'e ekle
function loadVehicles() {
    const grid = document.getElementById('vehiclesGrid');
    grid.innerHTML = '';
    
    const activeVehicles = vehicles.filter(v => v.status === 'active');
    
    if (activeVehicles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-car" style="font-size: 4rem; margin-bottom: 20px; display: block; color: #ddd;"></i>
                <h3 style="margin-bottom: 10px; color: #666;">Henüz araç eklenmemiş</h3>
                <p style="font-size: 1.1rem;">Yeni araç eklemek için "Araç Ekle" tab'ına gidin.</p>
            </div>
        `;
        return;
    }
    
    activeVehicles.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        grid.appendChild(card);
    });
}

// Hurda araçları yükle
function loadScrapVehicles() {
    const grid = document.getElementById('scrapVehiclesGrid');
    grid.innerHTML = '';
    
    const scrapVehicles = vehicles.filter(v => v.status === 'scrap');
    
    if (scrapVehicles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-recycle" style="font-size: 4rem; margin-bottom: 20px; display: block; color: #ddd;"></i>
                <h3 style="margin-bottom: 10px; color: #666;">Hurda araç bulunmuyor</h3>
                <p style="font-size: 1.1rem;">Tüm araçlar aktif durumda.</p>
            </div>
        `;
        return;
    }
    
    scrapVehicles.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        grid.appendChild(card);
    });
}

// Araç kartı oluştur
function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = `vehicle-card ${vehicle.status === 'scrap' ? 'scrap' : ''}`;
    
    const statusText = vehicle.status === 'scrap' ? 'Hurda' : 'Aktif';
    const statusClass = vehicle.status === 'scrap' ? 'scrap' : 'active';
    
    card.innerHTML = `
        <div class="vehicle-photo">
            ${vehicle.photo ? 
                `<img src="${vehicle.photo}" alt="${vehicle.brand} ${vehicle.model}">` : 
                `<div class="photo-placeholder">
                    <i class="fas fa-car"></i>
                    <p>Fotoğraf yok</p>
                </div>`
            }
        </div>
        <div class="vehicle-content">
            <div class="vehicle-title">
                <span>${vehicle.brand} ${vehicle.model}</span>
                <span class="vehicle-status ${statusClass}">${statusText}</span>
            </div>
            <div class="vehicle-details">
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">Yıl:</span>
                    <span class="vehicle-detail-value">${vehicle.year}</span>
                </div>
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">KM:</span>
                    <span class="vehicle-detail-value">${vehicle.km.toLocaleString()}</span>
                </div>
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">Yakıt:</span>
                    <span class="vehicle-detail-value">${getFuelName(vehicle.fuel)}</span>
                </div>
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">Renk:</span>
                    <span class="vehicle-detail-value">${vehicle.color}</span>
                </div>
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">Durum:</span>
                    <span class="vehicle-detail-value">${getConditionName(vehicle.condition)}</span>
                </div>
            </div>
            <div class="vehicle-sales">
                <div class="vehicle-sales-amount">₺${vehicle.totalSales.toFixed(2)}</div>
                <div class="vehicle-sales-label">Toplam Satış</div>
            </div>
            <div class="vehicle-actions">
                <button class="vehicle-btn vehicle-btn-primary" onclick="viewVehicleDetails('${vehicle.id}')">
                    <i class="fas fa-eye"></i> Detay
                </button>
                <button class="vehicle-btn vehicle-btn-secondary" onclick="manageParts('${vehicle.id}')">
                    <i class="fas fa-cogs"></i> Parçalar
                </button>
                <button class="vehicle-btn vehicle-btn-success" onclick="showQRCode('${vehicle.id}')">
                    <i class="fas fa-qrcode"></i> QR
                </button>
                ${vehicle.status === 'active' ? 
                    `<button class="vehicle-btn vehicle-btn-danger" onclick="markAsScrap('${vehicle.id}')">
                        <i class="fas fa-recycle"></i> Hurda
                    </button>` : 
                    `<button class="vehicle-btn vehicle-btn-success" onclick="markAsActive('${vehicle.id}')">
                        <i class="fas fa-undo"></i> Aktif
                    </button>`
                }
            </div>
        </div>
    `;
    
    return card;
}

// Araç detaylarını görüntüle
function viewVehicleDetails(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    
    const modal = document.getElementById('vehicleDetailModal');
    const content = document.getElementById('vehicleDetailContent');
    
    content.innerHTML = `
        <div class="vehicle-detail-container">
            <div class="vehicle-detail-photo">
                ${vehicle.photo ? 
                    `<img src="${vehicle.photo}" alt="${vehicle.brand} ${vehicle.model}">` : 
                    `<div class="photo-placeholder">
                        <i class="fas fa-car"></i>
                        <p>Fotoğraf yok</p>
                    </div>`
                }
            </div>
            <div class="vehicle-detail-info">
                <h2>${vehicle.brand} ${vehicle.model}</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Yıl:</label>
                        <span>${vehicle.year}</span>
                    </div>
                    <div class="detail-item">
                        <label>Kilometre:</label>
                        <span>${vehicle.km.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <label>Yakıt Tipi:</label>
                        <span>${getFuelName(vehicle.fuel)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Renk:</label>
                        <span>${vehicle.color}</span>
                    </div>
                    <div class="detail-item">
                        <label>VIN No:</label>
                        <span>${vehicle.vin}</span>
                    </div>
                    <div class="detail-item">
                        <label>Durum:</label>
                        <span>${getConditionName(vehicle.condition)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Alış Fiyatı:</label>
                        <span>₺${vehicle.price.toFixed(2)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Toplam Satış:</label>
                        <span style="color: #27ae60; font-weight: bold;">₺${vehicle.totalSales.toFixed(2)}</span>
                    </div>
                </div>
                ${vehicle.description ? `
                    <div class="detail-description">
                        <label>Açıklama:</label>
                        <p>${vehicle.description}</p>
                    </div>
                ` : ''}
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="manageParts('${vehicle.id}')">
                        <i class="fas fa-cogs"></i> Parça Yönetimi
                    </button>
                    <button class="btn btn-secondary" onclick="showQRCode('${vehicle.id}')">
                        <i class="fas fa-qrcode"></i> QR Kod
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Parça yönetimi
function manageParts(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    
    currentVehicleId = vehicleId;
    const modal = document.getElementById('partsModal');
    const vehicleInfo = document.getElementById('partsVehicleInfo');
    
    vehicleInfo.textContent = `${vehicle.brand} ${vehicle.model} - Parça Yönetimi`;
    
    loadParts();
    modal.style.display = 'block';
}

// Parçaları yükle
function loadParts() {
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    if (!vehicle) return;
    
    const partsList = document.getElementById('partsList');
    const totalParts = document.getElementById('totalParts');
    const totalPartsSales = document.getElementById('totalPartsSales');
    
    if (vehicle.parts.length === 0) {
        partsList.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px; color: #999;">
                <i class="fas fa-cogs" style="font-size: 3rem; margin-bottom: 15px; display: block;"></i>
                <p>Henüz parça eklenmemiş</p>
            </div>
        `;
    } else {
        partsList.innerHTML = vehicle.parts.map(part => `
            <div class="part-item">
                <div class="part-info">
                    <div class="part-name">${part.name}</div>
                    ${part.description ? `<div class="part-description">${part.description}</div>` : ''}
                </div>
                <div class="part-price">₺${part.price.toFixed(2)}</div>
                <div class="part-actions">
                    <button class="btn-small btn-delete" onclick="deletePart('${part.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    totalParts.textContent = vehicle.parts.length;
    totalPartsSales.textContent = `₺${vehicle.totalSales.toFixed(2)}`;
}

// Parça ekleme formu göster/gizle
function showAddPartForm() {
    document.getElementById('addPartForm').style.display = 'block';
}

function hideAddPartForm() {
    document.getElementById('addPartForm').style.display = 'none';
    document.getElementById('partForm').reset();
}

// Parça ekleme
function handleAddPart(e) {
    e.preventDefault();
    
    const partData = {
        id: generateId(),
        name: document.getElementById('partName').value.trim(),
        price: parseFloat(document.getElementById('partPrice').value),
        description: document.getElementById('partDescription').value.trim(),
        dateAdded: new Date().toISOString()
    };
    
    if (!partData.name || partData.price < 0) {
        showMessage('Lütfen parça adı ve fiyatını doğru girin.', 'error');
        return;
    }
    
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    if (vehicle) {
        vehicle.parts.push(partData);
        vehicle.totalSales += partData.price;
        saveVehicles();
        loadParts();
        updateDashboard();
        hideAddPartForm();
        showMessage('Parça başarıyla eklendi!', 'success');
    }
}

// Parça sil
function deletePart(partId) {
    if (confirm('Bu parçayı silmek istediğinizden emin misiniz?')) {
        const vehicle = vehicles.find(v => v.id === currentVehicleId);
        if (vehicle) {
            const part = vehicle.parts.find(p => p.id === partId);
            if (part) {
                vehicle.totalSales -= part.price;
                vehicle.parts = vehicle.parts.filter(p => p.id !== partId);
                saveVehicles();
                loadParts();
                updateDashboard();
                showMessage('Parça silindi!', 'success');
            }
        }
    }
}

// QR kod göster
function showQRCode(vehicleId) {
    console.log('QR kod gösteriliyor, vehicleId:', vehicleId);
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        showMessage('Araç bulunamadı!', 'error');
        return;
    }
    
    // currentVehicleId'yi güncelle
    currentVehicleId = vehicleId;
    console.log('currentVehicleId güncellendi:', currentVehicleId);
    
    const modal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrCode');
    
    // Modal'ı göster
    modal.style.display = 'block';
    
    // QR kod içeriği
    const qrData = `${vehicle.brand} ${vehicle.model} - VIN: ${vehicle.vin}`;
    console.log('QR data:', qrData);
    
    // Hemen alternatif formatı göster
    showAlternativeQR(vehicle, qrContainer);
    
    // QR kütüphanesi varsa gerçek QR oluştur
    if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
        console.log('QR kütüphanesi mevcut, gerçek QR oluşturuluyor...');
        setTimeout(() => {
            try {
                // Canvas oluştur
                const canvas = document.createElement('canvas');
                qrContainer.innerHTML = '';
                qrContainer.appendChild(canvas);
                
                // QR kod oluştur
                QRCode.toCanvas(canvas, qrData, function(error) {
                    if (error) {
                        console.error('QR kod oluşturma hatası:', error);
                        showAlternativeQR(vehicle, qrContainer);
                    } else {
                        console.log('QR kod başarıyla oluşturuldu');
                        // Canvas'a stil ekle
                        canvas.style.border = '2px solid #eee';
                        canvas.style.borderRadius = '10px';
                        canvas.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    }
                });
            } catch (error) {
                console.error('QR kod oluşturma hatası:', error);
                showAlternativeQR(vehicle, qrContainer);
            }
        }, 1000);
    } else {
        console.log('QR kütüphanesi bulunamadı, alternatif format kullanılıyor');
    }
}

// Alternatif QR kod göster
function showAlternativeQR(vehicle, container) {
    const vehicleId = currentVehicleId || vehicle.id;
    console.log('Alternatif QR gösteriliyor, vehicleId:', vehicleId);
    
    container.innerHTML = `
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 15px; border: 2px solid #ddd; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
            <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 1.4rem; font-weight: bold; color: #2c3e50; margin-bottom: 15px;">
                    <i class="fas fa-car" style="color: #3498db; margin-right: 10px;"></i>
                    ${vehicle.brand} ${vehicle.model}
                </div>
                <div style="font-size: 1rem; color: #666; margin-bottom: 20px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <strong>VIN:</strong> ${vehicle.vin}
                </div>
                <div style="font-size: 0.9rem; color: #2c3e50; background: #e3f2fd; padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; border-left: 4px solid #2196f3;">
                    <strong>QR Kod Metni:</strong><br>
                    ${vehicle.brand} ${vehicle.model} - VIN: ${vehicle.vin}
                </div>
            </div>
            <div style="color: #f39c12; font-size: 0.9rem; margin-bottom: 20px; padding: 10px; background: #fff3cd; border-radius: 5px; border: 1px solid #ffeaa7;">
                <i class="fas fa-info-circle"></i> QR kütüphanesi yüklenemedi, metin formatında gösteriliyor
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-success" onclick="tryCreateRealQR('${vehicleId}')" style="flex: 1; min-width: 140px;">
                    <i class="fas fa-qrcode"></i> Gerçek QR Oluştur
                </button>
                <button class="btn btn-primary" onclick="copyQRText('${vehicle.brand} ${vehicle.model} - VIN: ${vehicle.vin}')" style="flex: 1; min-width: 120px;">
                    <i class="fas fa-copy"></i> Kopyala
                </button>
                <button class="btn btn-secondary" onclick="printQRText('${vehicle.brand} ${vehicle.model}', '${vehicle.vin}')" style="flex: 1; min-width: 120px;">
                    <i class="fas fa-print"></i> Yazdır
                </button>
            </div>
        </div>
    `;
}

// Gerçek QR kod oluşturmayı dene
function tryCreateRealQR(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        showMessage('Araç bulunamadı!', 'error');
        return;
    }
    
    const qrContainer = document.getElementById('qrCode');
    const qrData = `${vehicle.brand} ${vehicle.model} - VIN: ${vehicle.vin}`;
    
    console.log('QR kod oluşturuluyor:', qrData);
    console.log('QRCode mevcut mu:', typeof QRCode);
    
    // Loading göster
    qrContainer.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #3498db;"></i><p>QR kod oluşturuluyor...</p></div>';
    
    // QR kütüphanesi kontrolü
    if (typeof QRCode === 'undefined') {
        console.log('QR kütüphanesi yok, yükleniyor...');
        loadQRLibrary();
        setTimeout(() => {
            if (typeof QRCode !== 'undefined') {
                createQRCode(vehicle, qrContainer, qrData);
            } else {
                showAlternativeQR(vehicle, qrContainer);
                showMessage('QR kütüphanesi yüklenemedi!', 'error');
            }
        }, 3000);
        return;
    }
    
    createQRCode(vehicle, qrContainer, qrData);
}

// QR kod oluştur
function createQRCode(vehicle, container, qrData) {
    try {
        console.log('QR kod oluşturuluyor...');
        console.log('QRCode mevcut mu:', typeof QRCode);
        console.log('QRCode.toCanvas mevcut mu:', typeof QRCode.toCanvas);
        
        // QR kütüphanesi kontrolü
        if (typeof QRCode === 'undefined' || typeof QRCode.toCanvas !== 'function') {
            console.error('QR kütüphanesi yüklenmemiş!');
            showAlternativeQR(vehicle, container);
            showMessage('QR kütüphanesi yüklenmemiş! Alternatif format gösteriliyor.', 'error');
            return;
        }
        
        // Canvas oluştur
        const canvas = document.createElement('canvas');
        container.innerHTML = '';
        container.appendChild(canvas);
        
        console.log('Canvas oluşturuldu, QR kod oluşturuluyor...');
        
        // QR kod oluştur - en basit şekilde
        QRCode.toCanvas(canvas, qrData, {
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(error) {
            if (error) {
                console.error('QR kod oluşturma hatası:', error);
                showAlternativeQR(vehicle, container);
                showMessage('QR kod oluşturulamadı! Alternatif format gösteriliyor.', 'error');
            } else {
                console.log('QR kod başarıyla oluşturuldu!');
                // Canvas'a stil ekle
                canvas.style.border = '2px solid #eee';
                canvas.style.borderRadius = '10px';
                canvas.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                showMessage('QR kod başarıyla oluşturuldu!', 'success');
            }
        });
    } catch (error) {
        console.error('QR kod oluşturma hatası:', error);
        showAlternativeQR(vehicle, container);
        showMessage('QR kod oluşturulamadı!', 'error');
    }
}

// QR metnini kopyala
function copyQRText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('QR metni panoya kopyalandı!', 'success');
    }).catch(() => {
        showMessage('Kopyalama başarısız!', 'error');
    });
}

// QR metnini yazdır
function printQRText(brandModel, vin) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>QR Kod Yazdır</title>
                <style>
                    body { 
                        text-align: center; 
                        padding: 50px; 
                        font-family: Arial, sans-serif;
                    }
                    h2 { color: #2c3e50; margin-bottom: 20px; }
                    .qr-info { 
                        background: #f8f9fa; 
                        padding: 30px; 
                        border-radius: 10px; 
                        margin: 20px 0;
                        display: inline-block;
                        border: 2px solid #ddd;
                    }
                    .qr-text {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        font-family: monospace;
                        font-size: 1.1rem;
                        color: #2c3e50;
                        border: 1px solid #ccc;
                    }
                </style>
            </head>
            <body>
                <h2>${brandModel} - QR Kodu</h2>
                <div class="qr-info">
                    <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 15px;">${brandModel}</div>
                    <div style="margin-bottom: 20px; color: #666;">VIN: ${vin}</div>
                    <div class="qr-text">${brandModel} - VIN: ${vin}</div>
                    <p style="margin-top: 20px; color: #999; font-size: 0.9rem;">
                        Bu metni QR kod okuyucu ile tarayabilirsiniz
                    </p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// QR kod indir
function downloadQR() {
    const canvas = document.querySelector('#qrCode canvas');
    if (canvas) {
        const vehicle = vehicles.find(v => v.id === currentVehicleId);
        const fileName = vehicle ? `${vehicle.brand}-${vehicle.model}-qr.png` : 'vehicle-qr-code.png';
        
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showMessage('QR kod indirildi!', 'success');
    } else {
        showMessage('QR kod bulunamadı!', 'error');
    }
}

// QR kod yazdır
function printQR() {
    const canvas = document.querySelector('#qrCode canvas');
    if (canvas) {
        const vehicle = vehicles.find(v => v.id === currentVehicleId);
        const vehicleInfo = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Araç';
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>QR Kod Yazdır</title>
                    <style>
                        body { 
                            text-align: center; 
                            padding: 50px; 
                            font-family: Arial, sans-serif;
                        }
                        h2 { color: #2c3e50; margin-bottom: 20px; }
                        .qr-info { 
                            background: #f8f9fa; 
                            padding: 20px; 
                            border-radius: 10px; 
                            margin: 20px 0;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <h2>${vehicleInfo} - QR Kodu</h2>
                    <div class="qr-info">
                        <img src="${canvas.toDataURL('image/png')}" style="max-width: 300px; height: auto;">
                        <p><strong>VIN:</strong> ${vehicle ? vehicle.vin : 'N/A'}</p>
                        <p><strong>Oluşturulma Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else {
        showMessage('QR kod bulunamadı!', 'error');
    }
}

// QR tarayıcı başlat
function initializeQRScanner() {
    if (qrScanner) {
        qrScanner.clear();
    }
    
    const scannerElement = document.getElementById('qr-reader');
    scannerElement.innerHTML = '';
    
    qrScanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: { width: 250, height: 250 },
        fps: 20
    });
    
    qrScanner.render(onScanSuccess, onScanFailure);
}

// QR tarama başarılı
function onScanSuccess(decodedText, decodedResult) {
    try {
        const qrData = JSON.parse(decodedText);
        if (qrData.type === 'vehicle' && qrData.id) {
            const vehicle = vehicles.find(v => v.id === qrData.id);
            if (vehicle) {
                qrScanner.clear();
                showMessage(`QR kod okundu: ${vehicle.brand} ${vehicle.model}`, 'success');
                showTab('vehicles');
                setTimeout(() => viewVehicleDetails(vehicle.id), 1000);
            } else {
                showMessage('Araç bulunamadı!', 'error');
            }
        }
    } catch (error) {
        showMessage('Geçersiz QR kod!', 'error');
    }
}

// QR tarama hatası
function onScanFailure(error) {
    // Hata mesajı gösterme, sadece konsola yaz
    console.log('QR tarama hatası:', error);
}

// Araçları filtrele
function filterVehicles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const brandFilter = document.getElementById('brandFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm) ||
                            vehicle.model.toLowerCase().includes(searchTerm) ||
                            vehicle.vin.toLowerCase().includes(searchTerm) ||
                            vehicle.color.toLowerCase().includes(searchTerm);
        const matchesBrand = !brandFilter || vehicle.brand === brandFilter;
        const matchesStatus = !statusFilter || vehicle.status === statusFilter;
        
        return matchesSearch && matchesBrand && matchesStatus;
    });
    
    displayFilteredVehicles(filteredVehicles);
}

// Hurda araçları filtrele
function filterScrapVehicles() {
    const searchTerm = document.getElementById('scrapSearchInput').value.toLowerCase();
    const scrapVehicles = vehicles.filter(v => v.status === 'scrap');
    
    const filteredVehicles = scrapVehicles.filter(vehicle => {
        return vehicle.brand.toLowerCase().includes(searchTerm) ||
               vehicle.model.toLowerCase().includes(searchTerm) ||
               vehicle.vin.toLowerCase().includes(searchTerm) ||
               vehicle.color.toLowerCase().includes(searchTerm);
    });
    
    displayFilteredVehicles(filteredVehicles, 'scrapVehiclesGrid');
}

// Filtrelenmiş araçları göster
function displayFilteredVehicles(filteredVehicles, gridId = 'vehiclesGrid') {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    
    if (filteredVehicles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 20px; display: block; color: #ddd;"></i>
                <h3 style="margin-bottom: 10px; color: #666;">Arama sonucu bulunamadı</h3>
                <p style="font-size: 1.1rem;">Farklı arama terimleri deneyin.</p>
            </div>
        `;
        return;
    }
    
    filteredVehicles.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        grid.appendChild(card);
    });
}

// Dashboard'u güncelle
function updateDashboard() {
    const totalVehicles = vehicles.length;
    const totalSales = vehicles.reduce((sum, v) => sum + v.totalSales, 0);
    const scrapVehicles = vehicles.filter(v => v.status === 'scrap').length;
    
    // İstatistikleri güncelle (elementler varsa)
    const totalVehiclesEl = document.getElementById('totalVehicles');
    const totalSalesEl = document.getElementById('totalSales');
    const scrapVehiclesEl = document.getElementById('scrapVehicles');
    
    if (totalVehiclesEl) totalVehiclesEl.textContent = totalVehicles;
    if (totalSalesEl) totalSalesEl.textContent = `₺${totalSales.toFixed(2)}`;
    if (scrapVehiclesEl) scrapVehiclesEl.textContent = scrapVehicles;
    
    // Dashboard araç listelerini güncelle
    updateDashboardVehicleLists();
}

// Dashboard araç listelerini güncelle
function updateDashboardVehicleLists() {
    const activeVehicles = vehicles.filter(v => v.status === 'active').slice(0, 5);
    const scrapVehicles = vehicles.filter(v => v.status === 'scrap').slice(0, 5);
    
    // Aktif araçlar
    const activeList = document.getElementById('activeVehiclesList');
    if (activeVehicles.length === 0) {
        activeList.innerHTML = '<p style="text-align: center; color: #999;">Aktif araç yok</p>';
    } else {
        activeList.innerHTML = activeVehicles.map(vehicle => `
            <div class="vehicle-item">
                <div class="vehicle-info">
                    <div class="vehicle-name">${vehicle.brand} ${vehicle.model}</div>
                    <div class="vehicle-details">${vehicle.year} • ${vehicle.km.toLocaleString()} km</div>
                </div>
                <div class="vehicle-actions">
                    <button class="btn-small btn-edit" onclick="viewVehicleDetails('${vehicle.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Hurda araçlar
    const scrapList = document.getElementById('scrapVehiclesList');
    if (scrapVehicles.length === 0) {
        scrapList.innerHTML = '<p style="text-align: center; color: #999;">Hurda araç yok</p>';
    } else {
        scrapList.innerHTML = scrapVehicles.map(vehicle => `
            <div class="vehicle-item scrap">
                <div class="vehicle-info">
                    <div class="vehicle-name">${vehicle.brand} ${vehicle.model}</div>
                    <div class="vehicle-details">${vehicle.year} • ${vehicle.km.toLocaleString()} km</div>
                </div>
                <div class="vehicle-actions">
                    <button class="btn-small btn-edit" onclick="viewVehicleDetails('${vehicle.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Raporları oluştur
function generateReports() {
    generateGeneralSummary();
    generateMonthlySales();
    generateBrandDistribution();
    generateTopParts();
}

// Genel özet raporu
function generateGeneralSummary() {
    const totalVehicles = vehicles.length;
    const totalSales = vehicles.reduce((sum, v) => sum + v.totalSales, 0);
    const totalParts = vehicles.reduce((sum, v) => sum + v.parts.length, 0);
    const averageSalesPerVehicle = totalVehicles > 0 ? totalSales / totalVehicles : 0;
    
    document.getElementById('generalSummary').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-size: 2rem; font-weight: bold; color: #3498db;">${totalVehicles}</div>
                <div style="color: #666;">Toplam Araç</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-size: 2rem; font-weight: bold; color: #27ae60;">₺${totalSales.toFixed(2)}</div>
                <div style="color: #666;">Toplam Satış</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-size: 2rem; font-weight: bold; color: #e74c3c;">${totalParts}</div>
                <div style="color: #666;">Toplam Parça</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-size: 2rem; font-weight: bold; color: #f39c12;">₺${averageSalesPerVehicle.toFixed(2)}</div>
                <div style="color: #666;">Ortalama Satış</div>
            </div>
        </div>
    `;
}

// Aylık satış raporu
function generateMonthlySales() {
    const monthlyData = {};
    
    vehicles.forEach(vehicle => {
        vehicle.parts.forEach(part => {
            const month = new Date(part.dateAdded).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
            if (!monthlyData[month]) {
                monthlyData[month] = 0;
            }
            monthlyData[month] += part.price;
        });
    });
    
    let html = '<div style="max-height: 200px; overflow-y: auto;">';
    Object.keys(monthlyData).forEach(month => {
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <span style="font-weight: 500;">${month}</span>
                <span style="color: #27ae60; font-weight: bold;">₺${monthlyData[month].toFixed(2)}</span>
            </div>
        `;
    });
    html += '</div>';
    
    document.getElementById('monthlySales').innerHTML = html;
}

// Marka dağılım raporu
function generateBrandDistribution() {
    const brandData = {};
    
    vehicles.forEach(vehicle => {
        if (!brandData[vehicle.brand]) {
            brandData[vehicle.brand] = { count: 0, sales: 0 };
        }
        brandData[vehicle.brand].count++;
        brandData[vehicle.brand].sales += vehicle.totalSales;
    });
    
    let html = '<div style="max-height: 200px; overflow-y: auto;">';
    Object.keys(brandData).forEach(brand => {
        const data = brandData[brand];
        html += `
            <div style="padding: 15px; background: #f8f9fa; margin-bottom: 10px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <strong>${brand}</strong>
                    <span style="color: #3498db; font-weight: bold;">${data.count} araç</span>
                </div>
                <div style="font-size: 0.9rem; color: #666;">
                    Satış: ₺${data.sales.toFixed(2)}
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    document.getElementById('brandDistribution').innerHTML = html;
}

// En çok satılan parçalar
function generateTopParts() {
    const allParts = [];
    
    vehicles.forEach(vehicle => {
        vehicle.parts.forEach(part => {
            allParts.push({
                name: part.name,
                price: part.price,
                vehicle: `${vehicle.brand} ${vehicle.model}`
            });
        });
    });
    
    // Fiyata göre sırala
    allParts.sort((a, b) => b.price - a.price);
    const topParts = allParts.slice(0, 10);
    
    let html = '<div style="max-height: 200px; overflow-y: auto;">';
    if (topParts.length === 0) {
        html += '<p style="text-align: center; color: #999;">Henüz parça satışı yok</p>';
    } else {
        topParts.forEach(part => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <div>
                        <div style="font-weight: 500;">${part.name}</div>
                        <div style="font-size: 0.8rem; color: #666;">${part.vehicle}</div>
                    </div>
                    <div style="color: #27ae60; font-weight: bold;">₺${part.price.toFixed(2)}</div>
                </div>
            `;
        });
    }
    html += '</div>';
    
    document.getElementById('topParts').innerHTML = html;
}

// Excel'e aktar
function exportToExcel() {
    const data = vehicles.map(vehicle => ({
        'Marka': vehicle.brand,
        'Model': vehicle.model,
        'Yıl': vehicle.year,
        'KM': vehicle.km,
        'Yakıt': getFuelName(vehicle.fuel),
        'Renk': vehicle.color,
        'VIN': vehicle.vin,
        'Durum': getConditionName(vehicle.condition),
        'Alış Fiyatı': vehicle.price,
        'Toplam Satış': vehicle.totalSales,
        'Parça Sayısı': vehicle.parts.length,
        'Durum': vehicle.status === 'active' ? 'Aktif' : 'Hurda'
    }));
    
    // Basit CSV export
    const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `arac-raporu-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showMessage('Rapor Excel formatında indirildi!', 'success');
}

// Rapor yazdır
function printReport() {
    window.print();
}

// Hurdaya çıkar
function markAsScrap(vehicleId) {
    if (confirm('Bu aracı hurdaya çıkarmak istediğinizden emin misiniz?')) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            vehicle.status = 'scrap';
            saveVehicles();
            loadVehicles();
            updateDashboard();
            showMessage('Araç hurdaya çıkarıldı!', 'success');
        }
    }
}

// Aktif yap
function markAsActive(vehicleId) {
    if (confirm('Bu aracı tekrar aktif yapmak istediğinizden emin misiniz?')) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            vehicle.status = 'active';
            saveVehicles();
            loadScrapVehicles();
            updateDashboard();
            showMessage('Araç tekrar aktif yapıldı!', 'success');
        }
    }
}

// Formu temizle
function resetVehicleForm() {
    document.getElementById('addVehicleForm').reset();
    document.getElementById('photoPreview').innerHTML = `
        <i class="fas fa-camera"></i>
        <p>Fotoğraf seçin veya sürükleyin</p>
    `;
}

// Modal'ları kapat
function closeVehicleModal() {
    document.getElementById('vehicleDetailModal').style.display = 'none';
}

function closePartsModal() {
    document.getElementById('partsModal').style.display = 'none';
    currentVehicleId = null;
}

function closeQRModal() {
    document.getElementById('qrModal').style.display = 'none';
}

// Yardımcı fonksiyonlar
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getFuelName(fuel) {
    const fuels = {
        'dizel': 'Dizel',
        'benzin': 'Benzin',
        'hibrit': 'Hibrit',
        'elektrik': 'Elektrik'
    };
    return fuels[fuel] || fuel;
}

function getConditionName(condition) {
    const conditions = {
        'pert': 'Pert',
        'kazali': 'Kazalı',
        'hasarli': 'Hasarlı',
        'iyi': 'İyi'
    };
    return conditions[condition] || condition;
}

function saveVehicles() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    // Otomatik yedekleme
    localStorage.setItem('backup_' + new Date().toISOString().split('T')[0], JSON.stringify(vehicles));
}

function showMessage(message, type = 'info') {
    // Önceki mesajları kaldır
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    messageDiv.innerHTML = `
        <i class="${icon}"></i>
        ${message}
    `;
    
    // Mesajı sayfanın üstüne ekle
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Event listeners
function setupEventListeners() {
    // Modal dışına tıklandığında kapat
    window.onclick = function(event) {
        const vehicleModal = document.getElementById('vehicleDetailModal');
        const partsModal = document.getElementById('partsModal');
        const qrModal = document.getElementById('qrModal');
        
        if (event.target === vehicleModal) {
            closeVehicleModal();
        } else if (event.target === partsModal) {
            closePartsModal();
        } else if (event.target === qrModal) {
            closeQRModal();
        }
    }
    
    // Klavye kısayolları
    document.addEventListener('keydown', function(e) {
        // ESC tuşu ile modal'ları kapat
        if (e.key === 'Escape') {
            closeVehicleModal();
            closePartsModal();
            closeQRModal();
        }
        
        // Ctrl+N ile yeni araç ekle
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            showTab('add-vehicle');
        }
        
        // Ctrl+F ile arama
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            showTab('vehicles');
            document.getElementById('searchInput').focus();
        }
    });
    
    // Sayfa kapatılırken verileri kaydet
    window.addEventListener('beforeunload', function() {
        saveVehicles();
    });
}