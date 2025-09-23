// Raporlama Sistemi
class ReportGenerator {
    constructor(database) {
        this.db = database;
    }

    // Excel raporu oluştur
    async generateExcelReport(startDate, endDate) {
        try {
            const sales = await this.db.getSalesReport(startDate, endDate);
            const vehicles = await this.db.getAllVehicles();
            
            // Excel verisi oluştur
            const excelData = this.formatExcelData(sales, vehicles);
            
            // Excel dosyası oluştur
            this.downloadExcel(excelData, `rapor_${startDate}_${endDate}.xlsx`);
            
            return true;
        } catch (error) {
            console.error('Excel rapor hatası:', error);
            return false;
        }
    }

    // PDF raporu oluştur
    async generatePDFReport(startDate, endDate) {
        try {
            const sales = await this.db.getSalesReport(startDate, endDate);
            const vehicles = await this.db.getAllVehicles();
            
            // PDF oluştur
            const pdf = new jsPDF();
            pdf.text('Araç Parça Satış Raporu', 20, 20);
            pdf.text(`Tarih: ${startDate} - ${endDate}`, 20, 30);
            
            // Tablo oluştur
            let y = 50;
            sales.forEach(sale => {
                pdf.text(`${sale.vehicleId} - ${sale.amount} TL`, 20, y);
                y += 10;
            });
            
            pdf.save(`rapor_${startDate}_${endDate}.pdf`);
            return true;
        } catch (error) {
            console.error('PDF rapor hatası:', error);
            return false;
        }
    }

    // Excel verisi formatla
    formatExcelData(sales, vehicles) {
        const data = [];
        
        // Başlık satırı
        data.push(['Araç ID', 'Marka', 'Model', 'Parça Adı', 'Miktar', 'Tarih']);
        
        // Veri satırları
        sales.forEach(sale => {
            const vehicle = vehicles.find(v => v.id === sale.vehicleId);
            data.push([
                sale.vehicleId,
                vehicle ? vehicle.brand : 'Bilinmiyor',
                vehicle ? vehicle.model : 'Bilinmiyor',
                sale.partName,
                sale.amount,
                sale.date
            ]);
        });
        
        return data;
    }

    // Excel indir
    downloadExcel(data, filename) {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
        XLSX.writeFile(wb, filename);
    }
}

// Global report instance
window.reportGenerator = new ReportGenerator(window.database);