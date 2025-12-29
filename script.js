// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sample data download link (for demo)
    const downloadSampleBtn = document.createElement('a');
    downloadSampleBtn.href = 'sample-data.csv';
    downloadSampleBtn.download = 'sample-transactions.csv';
    downloadSampleBtn.innerHTML = '<i class="fas fa-download"></i> Download Sample Data';
    downloadSampleBtn.className = 'btn btn-secondary';
    downloadSampleBtn.style.marginTop = '20px';
    
    const heroSection = document.querySelector('.hero-content');
    if (heroSection && !document.querySelector('.sample-download')) {
        downloadSampleBtn.classList.add('sample-download');
        heroSection.appendChild(downloadSampleBtn);
    }
    
    // Create sample data if needed
    createSampleData();
});

// Create sample CSV data
function createSampleData() {
    const sampleData = `CustomerID,TanggalTransaksi,NilaiTransaksi,KategoriProduk,MetodePembayaran,Usia,Lokasi
CUST001,2024-01-15,250000,Elektronik,Transfer,28,Jakarta
CUST002,2024-01-20,150000,Pakaian,Cash,35,Bandung
CUST003,2024-02-05,500000,Elektronik,Kartu Kredit,42,Surabaya
CUST004,2024-02-10,75000,Makanan,Transfer,22,Yogyakarta
CUST005,2024-02-15,300000,Pakaian,Kartu Debit,31,Jakarta
CUST001,2024-02-20,180000,Elektronik,Transfer,28,Jakarta
CUST006,2024-03-01,120000,Makanan,Cash,26,Bandung
CUST002,2024-03-05,95000,Pakaian,Transfer,35,Bandung
CUST007,2024-03-10,450000,Elektronik,Kartu Kredit,45,Surabaya
CUST003,2024-03-15,220000,Elektronik,Kartu Kredit,42,Surabaya
CUST008,2024-03-20,80000,Makanan,Cash,29,Jakarta
CUST004,2024-03-25,125000,Makanan,Transfer,22,Yogyakarta
CUST005,2024-04-01,275000,Pakaian,Kartu Debit,31,Jakarta
CUST009,2024-04-05,600000,Elektronik,Kartu Kredit,38,Bandung
CUST006,2024-04-10,140000,Makanan,Cash,26,Bandung
CUST010,2024-04-15,90000,Pakaian,Transfer,33,Surabaya
CUST007,2024-04-20,320000,Elektronik,Kartu Kredit,45,Surabaya
CUST001,2024-04-25,210000,Elektronik,Transfer,28,Jakarta
CUST002,2024-05-01,110000,Pakaian,Cash,35,Bandung
CUST008,2024-05-05,95000,Makanan,Cash,29,Jakarta`;
    
    // Create blob and URL for download
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Update sample download link
    const sampleLink = document.querySelector('.sample-download');
    if (sampleLink) {
        sampleLink.href = url;
    }
}
