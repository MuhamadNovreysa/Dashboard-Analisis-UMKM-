document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    const processingSection = document.getElementById('processingSection');
    const progressBar = document.getElementById('progressBar');
    const resultsSection = document.getElementById('resultsSection');
    const previewBody = document.getElementById('previewBody');
    const downloadBtn = document.getElementById('downloadBtn');
    const proceedBtn = document.getElementById('proceedBtn');
    const reuploadBtn = document.getElementById('reuploadBtn');
    
    let cleanedData = [];
    
    // Drag and drop functionality
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = '#4f46e5';
        uploadBox.style.background = '#f8fafc';
    });
    
    uploadBox.addEventListener('dragleave', function() {
        uploadBox.style.borderColor = '#cbd5e1';
        uploadBox.style.background = 'white';
    });
    
    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = '#cbd5e1';
        uploadBox.style.background = 'white';
        
        if (e.dataTransfer.files.length) {
            processFile(e.dataTransfer.files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length) {
            processFile(e.target.files[0]);
        }
    });
    
    function processFile(file) {
        // Show processing section
        processingSection.style.display = 'block';
        
        // Simulate AI cleaning process
        simulateAIProcess(file);
    }
    
    function simulateAIProcess(file) {
        // Step 1: Reading
        updateProcessStep(0);
        progressBar.style.width = '25%';
        
        setTimeout(() => {
            // Step 2: Cleaning
            updateProcessStep(1);
            progressBar.style.width = '50%';
            
            // Parse CSV
            Papa.parse(file, {
                header: true,
                complete: function(results) {
                    setTimeout(() => {
                        // Step 3: Validating
                        updateProcessStep(2);
                        progressBar.style.width = '75%';
                        
                        // Clean the data
                        cleanedData = cleanData(results.data);
                        
                        setTimeout(() => {
                            progressBar.style.width = '100%';
                            showResults(cleanedData);
                        }, 1000);
                    }, 1000);
                },
                error: function(error) {
                    alert('Error membaca file: ' + error.message);
                    resetProcess();
                }
            });
        }, 1500);
    }
    
    function updateProcessStep(stepIndex) {
        const steps = document.querySelectorAll('.process-step');
        steps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    function cleanData(data) {
        return data.map((row, index) => {
            // Add cleaning logic here
            const cleanedRow = { ...row };
            
            // Clean date format
            if (cleanedRow.TanggalTransaksi) {
                cleanedRow.TanggalTransaksi = cleanedRow.TanggalTransaksi.split(' ')[0];
            }
            
            // Clean numeric values
            if (cleanedRow.NilaiTransaksi) {
                cleanedRow.NilaiTransaksi = parseFloat(cleanedRow.NilaiTransaksi) || 0;
            }
            
            if (cleanedRow.Usia) {
                cleanedRow.Usia = parseInt(cleanedRow.Usia) || 0;
            }
            
            // Add cleaned flag
            cleanedRow.Cleaned = true;
            cleanedRow.RowID = index + 1;
            
            return cleanedRow;
        });
    }
    
    function showResults(data) {
        resultsSection.style.display = 'block';
        
        // Show first 5 rows in preview
        previewBody.innerHTML = '';
        data.slice(0, 5).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.CustomerID || ''}</td>
                <td>${row.TanggalTransaksi || ''}</td>
                <td>Rp ${(row.NilaiTransaksi || 0).toLocaleString()}</td>
                <td>${row.KategoriProduk || ''}</td>
                <td>${row.MetodePembayaran || ''}</td>
                <td>${row.Usia || ''}</td>
                <td>${row.Lokasi || ''}</td>
            `;
            previewBody.appendChild(tr);
        });
        
        // Add summary row
        const summaryRow = document.createElement('tr');
        summaryRow.innerHTML = `
            <td colspan="7" style="text-align: center; font-weight: bold; background: #f1f5f9;">
                ${data.length} baris data telah dibersihkan. Menampilkan 5 baris pertama.
            </td>
        `;
        previewBody.appendChild(summaryRow);
    }
    
    // Download cleaned data
    downloadBtn.addEventListener('click', function() {
        const csv = Papa.unparse(cleanedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cleaned-transactions.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Proceed to analytics
    proceedBtn.addEventListener('click', function() {
        // Save cleaned data to localStorage for analytics page
        localStorage.setItem('cleanedData', JSON.stringify(cleanedData));
        window.location.href = 'analytics.html';
    });
    
    // Reupload data
    reuploadBtn.addEventListener('click', resetProcess);
    
    function resetProcess() {
        processingSection.style.display = 'none';
        resultsSection.style.display = 'none';
        progressBar.style.width = '0%';
        document.querySelectorAll('.process-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelectorAll('.process-step')[0].classList.add('active');
        fileInput.value = '';
    }
});
