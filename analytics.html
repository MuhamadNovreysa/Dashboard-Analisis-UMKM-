document.addEventListener('DOMContentLoaded', function() {
    const cleanFileInput = document.getElementById('cleanFileInput');
    const analyticsDashboard = document.getElementById('analyticsDashboard');
    let transactionData = [];
    
    // Load cleaned data from localStorage or file
    const savedData = localStorage.getItem('cleanedData');
    if (savedData) {
        transactionData = JSON.parse(savedData);
        initializeDashboard(transactionData);
    }
    
    // File upload for clean data
    cleanFileInput.addEventListener('change', function(e) {
        if (e.target.files.length) {
            Papa.parse(e.target.files[0], {
                header: true,
                complete: function(results) {
                    transactionData = results.data;
                    localStorage.setItem('cleanedData', JSON.stringify(transactionData));
                    initializeDashboard(transactionData);
                }
            });
        }
    });
    
    function initializeDashboard(data) {
        analyticsDashboard.style.display = 'block';
        
        // Calculate metrics
        const metrics = calculateMetrics(data);
        const segments = performSegmentation(data);
        const rfmScores = calculateRFM(data);
        const clvValues = calculateCLV(data);
        
        // Update UI
        updateSummaryStats(metrics);
        renderSegmentationChart(segments);
        renderRFMChart(rfmScores);
        renderCLVChart(clvValues);
        renderCategoryChart(data);
        updateCustomerTable(data, segments);
    }
    
    function calculateMetrics(data) {
        const uniqueCustomers = [...new Set(data.map(d => d.CustomerID))];
        const totalTransactions = data.length;
        const totalRevenue = data.reduce((sum, d) => sum + (parseFloat(d.NilaiTransaksi) || 0), 0);
        const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
        
        return {
            totalCustomers: uniqueCustomers.length,
            totalTransactions,
            totalRevenue,
            avgTransaction
        };
    }
    
    function performSegmentation(data) {
        // Simplified K-Means segmentation based on transaction value and frequency
        const customerStats = {};
        
        // Calculate customer statistics
        data.forEach(transaction => {
            const custId = transaction.CustomerID;
            if (!customerStats[custId]) {
                customerStats[custId] = {
                    totalValue: 0,
                    transactionCount: 0,
                    lastTransaction: new Date(transaction.TanggalTransaksi)
                };
            }
            
            customerStats[custId].totalValue += parseFloat(transaction.NilaiTransaksi) || 0;
            customerStats[custId].transactionCount++;
            
            const transDate = new Date(transaction.TanggalTransaksi);
            if (transDate > customerStats[custId].lastTransaction) {
                customerStats[custId].lastTransaction = transDate;
            }
        });
        
        // Segment customers
        const segments = {
            'High Value': 0,
            'Medium Value': 0,
            'Low Value': 0,
            'Potential': 0
        };
        
        Object.values(customerStats).forEach(stats => {
            const avgValue = stats.totalValue / stats.transactionCount;
            const daysSinceLast = (new Date() - stats.lastTransaction) / (1000 * 60 * 60 * 24);
            
            if (avgValue > 300000 && stats.transactionCount >= 3) {
                segments['High Value']++;
            } else if (avgValue > 150000 && stats.transactionCount >= 2) {
                segments['Medium Value']++;
            } else if (avgValue < 100000 && daysSinceLast > 30) {
                segments['Low Value']++;
            } else {
                segments['Potential']++;
            }
        });
        
        // Update segment counts in UI
        document.getElementById('highValueCount').textContent = segments['High Value'];
        document.getElementById('mediumValueCount').textContent = segments['Medium Value'];
        document.getElementById('lowValueCount').textContent = segments['Low Value'];
        document.getElementById('potentialCount').textContent = segments['Potential'];
        
        return segments;
    }
    
    function calculateRFM(data) {
        // Calculate Recency, Frequency, Monetary for each customer
        const customerRFM = {};
        const now = new Date();
        
        data.forEach(transaction => {
            const custId = transaction.CustomerID;
            if (!customerRFM[custId]) {
                customerRFM[custId] = {
                    recency: Infinity,
                    frequency: 0,
                    monetary: 0
                };
            }
            
            const transDate = new Date(transaction.TanggalTransaksi);
            const daysDiff = Math.floor((now - transDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff < customerRFM[custId].recency) {
                customerRFM[custId].recency = daysDiff;
            }
            
            customerRFM[custId].frequency++;
            customerRFM[custId].monetary += parseFloat(transaction.NilaiTransaksi) || 0;
        });
        
        // Calculate average RFM scores
        const rfmValues = Object.values(customerRFM);
        const avgRecency = rfmValues.reduce((sum, rfm) => sum + rfm.recency, 0) / rfmValues.length;
        const avgFrequency = rfmValues.reduce((sum, rfm) => sum + rfm.frequency, 0) / rfmValues.length;
        const avgMonetary = rfmValues.reduce((sum, rfm) => sum + rfm.monetary, 0) / rfmValues.length;
        
        return {
            recency: Math.round(avgRecency),
            frequency: Math.round(avgFrequency * 10) / 10,
            monetary: Math.round(avgMonetary / 1000)
        };
    }
    
    function calculateCLV(data) {
        // Simplified CLV calculation
        const customerStats = {};
        
        data.forEach(transaction => {
            const custId = transaction.CustomerID;
            if (!customerStats[custId]) {
                customerStats[custId] = {
                    totalSpent: 0,
                    purchaseCount: 0,
                    firstPurchase: new Date(transaction.TanggalTransaksi),
                    lastPurchase: new Date(transaction.TanggalTransaksi)
                };
            }
            
            customerStats[custId].totalSpent += parseFloat(transaction.NilaiTransaksi) || 0;
            customerStats[custId].purchaseCount++;
            
            const transDate = new Date(transaction.TanggalTransaksi);
            if (transDate < customerStats[custId].firstPurchase) {
                customerStats[custId].firstPurchase = transDate;
            }
            if (transDate > customerStats[custId].lastPurchase) {
                customerStats[custId].lastPurchase = transDate;
            }
        });
        
        // Calculate CLV for each customer
        const clvValues = [];
        Object.values(customerStats).forEach(stats => {
            const customerLifespan = (stats.lastPurchase - stats.firstPurchase) / (1000 * 60 * 60 * 24 * 30); // in months
            const avgPurchaseValue = stats.totalSpent / stats.purchaseCount;
            const purchaseFrequency = stats.purchaseCount / Math.max(1, customerLifespan);
            const clv = avgPurchaseValue * purchaseFrequency * (customerLifespan || 1);
            
            clvValues.push(Math.round(clv / 1000)); // in thousands
        });
        
        return clvValues;
    }
    
    function updateSummaryStats(metrics) {
        document.getElementById('totalCustomers').textContent = metrics.totalCustomers;
        document.getElementById('totalTransactions').textContent = metrics.totalTransactions;
        document.getElementById('totalRevenue').textContent = 'Rp ' + metrics.totalRevenue.toLocaleString();
        document.getElementById('avgTransaction').textContent = 'Rp ' + Math.round(metrics.avgTransaction).toLocaleString();
    }
    
    function renderSegmentationChart(segments) {
        const ctx = document.getElementById('segmentationChart').getContext('2d');
        
        if (window.segmentationChart) {
            window.segmentationChart.destroy();
        }
        
        window.segmentationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(segments),
                datasets: [{
                    data: Object.values(segments),
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw} pelanggan`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function renderRFMChart(rfm) {
        const ctx = document.getElementById('rfmChart').getContext('2d');
        
        if (window.rfmChart) {
            window.rfmChart.destroy();
        }
        
        window.rfmChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Recency (hari)', 'Frequency', 'Monetary (ribu)'],
                datasets: [{
                    label: 'RFM Score',
                    data: [rfm.recency, rfm.frequency, rfm.monetary],
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: '#4f46e5',
                    borderWidth: 2,
                    pointBackgroundColor: '#4f46e5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: Math.max(10, Math.ceil(Math.max(rfm.recency, rfm.frequency, rfm.monetary) / 5))
                        }
                    }
                }
            }
        });
    }
    
    function renderCLVChart(clvValues) {
        const ctx = document.getElementById('clvChart').getContext('2d');
        
        // Group CLV values into ranges
        const ranges = {
            '0-500': 0,
            '501-1000': 0,
            '1001-5000': 0,
            '5001+': 0
        };
        
        clvValues.forEach(value => {
            if (value <= 500) ranges['0-500']++;
            else if (value <= 1000) ranges['501-1000']++;
            else if (value <= 5000) ranges['1001-5000']++;
            else ranges['5001+']++;
        });
        
        if (window.clvChart) {
            window.clvChart.destroy();
        }
        
        window.clvChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ranges).map(r => r + 'k'),
                datasets: [{
                    label: 'Jumlah Pelanggan',
                    data: Object.values(ranges),
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Pelanggan'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'CLV Range (dalam ribuan)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw} pelanggan`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function renderCategoryChart(data) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        // Count transactions by category
        const categoryCounts = {};
        const categoryRevenue = {};
        
        data.forEach(transaction => {
            const category = transaction.KategoriProduk || 'Unknown';
            const value = parseFloat(transaction.NilaiTransaksi) || 0;
            
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            categoryRevenue[category] = (categoryRevenue[category] || 0) + value;
        });
        
        if (window.categoryChart) {
            window.categoryChart.destroy();
        }
        
        window.categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(categoryCounts),
                datasets: [
                    {
                        label: 'Jumlah Transaksi',
                        data: Object.values(categoryCounts),
                        backgroundColor: '#3b82f6',
                        borderColor: '#1d4ed8',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Total Revenue (ribu)',
                        data: Object.values(categoryRevenue).map(v => Math.round(v / 1000)),
                        backgroundColor: '#f59e0b',
                        borderColor: '#d97706',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Jumlah Transaksi'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Revenue (ribu)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    function updateCustomerTable(data, segments) {
        const tableBody = document.getElementById('customerTableBody');
        tableBody.innerHTML = '';
        
        // Calculate customer summary
        const customerSummary = {};
        
        data.forEach(transaction => {
            const custId = transaction.CustomerID;
            if (!customerSummary[custId]) {
                customerSummary[custId] = {
                    totalValue: 0,
                    transactionCount: 0,
                    lastDate: transaction.TanggalTransaksi,
                    segment: assignSegment(transaction, segments)
                };
            }
            
            customerSummary[custId].totalValue += parseFloat(transaction.NilaiTransaksi) || 0;
            customerSummary[custId].transactionCount++;
            
            if (new Date(transaction.TanggalTransaksi) > new Date(customerSummary[custId].lastDate)) {
                customerSummary[custId].lastDate = transaction.TanggalTransaksi;
            }
        });
        
        // Add rows to table (first 10 customers)
        Object.entries(customerSummary).slice(0, 10).forEach(([custId, stats]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${custId}</td>
                <td><span class="segment-badge ${stats.segment.toLowerCase().replace(' ', '-')}">${stats.segment}</span></td>
                <td>${stats.transactionCount}</td>
                <td>Rp ${stats.totalValue.toLocaleString()}</td>
                <td>${stats.lastDate}</td>
                <td>${Math.round(stats.totalValue / Math.max(1, stats.transactionCount) / 1000)}</td>
                <td>Rp ${Math.round(stats.totalValue * 0.3).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add summary row
        const summaryRow = document.createElement('tr');
        summaryRow.innerHTML = `
            <td colspan="7" style="text-align: center; font-weight: bold; background: #f1f5f9;">
                Menampilkan 10 dari ${Object.keys(customerSummary).length} pelanggan
            </td>
        `;
        tableBody.appendChild(summaryRow);
    }
    
    function assignSegment(transaction, segments) {
        // Simple segment assignment logic
        const value = parseFloat(transaction.NilaiTransaksi) || 0;
        
        if (value > 300000) return 'High Value';
        if (value > 150000) return 'Medium Value';
        if (value < 100000) return 'Low Value';
        return 'Potential';
    }
    
    // Export buttons
    document.getElementById('exportPDF')?.addEventListener('click', function() {
        alert('Fitur export PDF akan tersedia di versi lengkap.');
    });
    
    document.getElementById('exportCSV')?.addEventListener('click', function() {
        const csv = Papa.unparse(transactionData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analytics-results.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
    
    document.getElementById('exportCharts')?.addEventListener('click', function() {
        alert('Fitur export charts akan tersedia di versi lengkap.');
    });
});
