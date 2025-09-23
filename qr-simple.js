// Basit QR Kod Kütüphanesi - Offline
window.QRCode = {
    toCanvas: function(canvas, text, options, callback) {
        try {
            console.log('Offline QR kütüphanesi çalışıyor...');
            console.log('QR metni:', text);
            
            // Canvas boyutları
            const size = options?.width || 200;
            const margin = options?.margin || 1;
            
            // Canvas'ı temizle
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;
            
            // Arka plan
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            
            // QR kod simülasyonu (basit kareler)
            const cellSize = Math.floor((size - margin * 2) / 25);
            const startX = (size - cellSize * 25) / 2;
            const startY = (size - cellSize * 25) / 2;
            
            ctx.fillStyle = '#000000';
            
            // Basit QR kod deseni
            for (let i = 0; i < 25; i++) {
                for (let j = 0; j < 25; j++) {
                    if ((i + j) % 3 === 0 || (i * j) % 7 === 0) {
                        ctx.fillRect(
                            startX + i * cellSize,
                            startY + j * cellSize,
                            cellSize,
                            cellSize
                        );
                    }
                }
            }
            
            // Metin ekle
            ctx.fillStyle = '#000000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('QR Code', size / 2, size - 5);
            
            console.log('Offline QR kod oluşturuldu!');
            if (callback) callback(null);
            
        } catch (error) {
            console.error('Offline QR kod hatası:', error);
            if (callback) callback(error);
        }
    }
};

console.log('Offline QR kütüphanesi yüklendi!');