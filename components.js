class Components {
    static createDataUpload() {
        const container = document.getElementById('data-upload-container');
        if (!container) return;

        const card = document.createElement('div');
        card.className = 'card border-2 border-dashed';
        card.innerHTML = `
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="metric-icon">
                            <i class="fas fa-file-spreadsheet"></i>
                        </div>
                        <h3 class="font-semibold">Upload Data Customer</h3>
                    </div>
                    <p class="text-sm text-muted">
                        Upload file CSV atau Excel dengan data transaksi customer untuk analisis K-Means clustering
                    </p>

                    <div class="mt-3 space-y-2">
                        <p class="text-xs font-medium text-muted">Data yang diperlukan:</p>
                        <div class="flex flex-wrap gap-2">
                            ${['Customer ID', 'Tanggal Transaksi', 'Nilai Transaksi', 'Kategori Produk', 'Metode Pembayaran', 'Usia Customer', 'Lokasi']
                                .map(item => `<span class="badge badge-secondary">${item}</span>`).join('')}
                        </div>
                    </div>

                    <div id="upload-status" class="mt-4 hidden"></div>
                </div>

                <div class="flex flex-col gap-2 w-full md:w-auto">
                    <button id="download-template-btn" class="btn btn-outline">
                        <i class="fas fa-download mr-2"></i>
                        Download Template
                    </button>

                    <label for="file-upload">
                        <button id="upload-btn" class="btn btn-primary">
                            <i class="fas fa-upload mr-2"></i>
                            Upload Data
                        </button>
                    </label>
                    <input id="file-upload" type="file" accept=".csv,.xlsx,.xls" class="hidden" />

                    <button id="clear-data-btn" class="btn btn-destructive hidden">
                        <i class="fas fa-trash mr-2"></i>
                        Hapus Semua Data
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(card);

        // Add event listeners
        document.getElementById('download-template-btn').addEventListener('click', this.downloadTemplate);
        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('file-upload').click();
        });
        document.getElementById('file-upload').addEventListener('change', this.handleFileUpload);
        document.getElementById('clear-data-btn').addEventListener('click', this.handleClearData);
    }

    static createMetricsOverview() {
        const container = document.getElementById('metrics-overview-container');
        if (!container) return;

        const metrics = window.dataStore.getData() ? [
            { title: "Total Pelanggan", value: window.dataStore.getData().metrics.totalCustomers.toLocaleString(), change: "+12.5%", trend: "up", icon: "users" },
            { title: "Transaksi Bulan Ini", value: window.dataStore.getData().metrics.totalTransactions.toLocaleString(), change: "+8.2%", trend: "up", icon: "shopping-cart" },
            { title: "Revenue", value: `Rp ${(window.dataStore.getData().metrics.totalRevenue / 1000000).toFixed(1)}M`, change: "+15.3%", trend: "up", icon: "dollar-sign" },
            { title: "Conversion Rate", value: `${window.dataStore.getData().metrics.conversionRate.toFixed(2)}%`, change: "-2.1%", trend: "down", icon: "target" },
        ] : [
            { title: "Total Pelanggan", value: "-", change: "-", trend: "up", icon: "users" },
            { title: "Transaksi Bulan Ini", value: "-", change: "-", trend: "up", icon: "shopping-cart" },
            { title: "Revenue", value: "-", change: "-", trend: "up", icon: "dollar-sign" },
            { title: "Conversion Rate", value: "-", change: "-", trend: "down", icon: "target" },
        ];

        container.innerHTML = metrics.map(metric => `
            <div class="card metric-card">
                <div class="metric-header">
                    <div class="metric-icon">
                        <i class="fas fa-${metric.icon}"></i>
                    </div>
                    ${window.dataStore.getData() ? `
                        <div class="metric-trend ${metric.trend}">
                            <i class="fas fa-${metric.trend === 'up' ? 'trending-up' : 'trending-down'}"></i>
                            ${metric.change}
                        </div>
                    ` : ''}
                </div>
                <div>
                    <h3 class="metric-title">${metric.title}</h3>
                    <p class="metric-value">${metric.value}</p>
                </div>
            </div>
        `).join('');
    }

    static createPerformanceCharts() {
        const container = document.getElementById('performance-charts-container');
        if (!container) return;

        const data = window.dataStore.getData();
        
        if (!data) {
            container.innerHTML = `
                <div class="card">
                    <div class="mb-6">
                        <h2 class="font-semibold">Kinerja UMKM</h2>
                        <p class="text-sm text-muted">Tren revenue dan transaksi</p>
                    </div>
                    <div class="flex items-center justify-center h-[350px] text-muted">
                        <p>Upload data untuk melihat grafik kinerja</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="card">
                <div class="mb-6">
                    <h2 class="font-semibold">Kinerja UMKM</h2>
                    <p class="text-sm text-muted">Tren revenue dan transaksi</p>
                </div>
                <div class="space-y-6">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-medium">Revenue (Juta Rupiah)</span>
                            <span class="text-sm text-muted">
                                Rp ${(data.metrics.totalRevenue / 1000000).toFixed(1)}M
                            </span>
                        </div>
                        <div id="revenue-chart" style="height: 150px;"></div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-medium">Jumlah Transaksi</span>
                            <span class="text-sm text-muted">${data.metrics.totalTransactions}</span>
                        </div>
                        <div id="transactions-chart" style="height: 150px;"></div>
                    </div>
                </div>
            </div>
        `;

        if (window.Recharts) {
            setTimeout(() => {
                this.renderCharts(data);
            }, 100);
        }
    }

    static renderCharts(data) {
        const performanceData = data.timeSeriesData.map(d => ({
            date: new Date(d.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
            revenue: d.revenue / 1000000,
            transactions: d.transactions,
        }));

        // Revenue Chart
        const revenueChart = Recharts.AreaChart({
            data: performanceData,
            margin: { top: 10, right: 10, left: 0, bottom: 0 },
            children: [
                Recharts.Area({
                    type: 'monotone',
                    dataKey: 'revenue',
                    stroke: 'hsl(var(--chart-1))',
                    strokeWidth: 2,
                    fill: 'hsl(var(--chart-1) / 0.1)',
                }),
                Recharts.XAxis({
                    dataKey: 'date',
                    stroke: 'hsl(var(--muted-foreground))',
                    tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
                }),
                Recharts.YAxis({ hide: true }),
                Recharts.Tooltip({
                    contentStyle: {
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                    }
                }),
            ]
        });

        document.getElementById('revenue-chart').appendChild(revenueChart);

        // Transactions Chart
        const transactionsChart = Recharts.AreaChart({
            data: performanceData,
            margin: { top: 10, right: 10, left: 0, bottom: 0 },
            children: [
                Recharts.Area({
                    type: 'monotone',
                    dataKey: 'transactions',
                    stroke: 'hsl(var(--chart-2))',
                    strokeWidth: 2,
                    fill: 'hsl(var(--chart-2) / 0.1)',
                }),
                Recharts.XAxis({
                    dataKey: 'date',
                    stroke: 'hsl(var(--muted-foreground))',
                    tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
                }),
                Recharts.YAxis({ hide: true }),
                Recharts.Tooltip({
                    contentStyle: {
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                    }
                }),
            ]
        });

        document.getElementById('transactions-chart').appendChild(transactionsChart);
    }

    static async handleFileUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const statusDiv = document.getElementById('upload-status');
        const clearBtn = document.getElementById('clear-data-btn');

        try {
            const text = await file.text();
            const customers = window.parseCSV(text);

            if (customers.length === 0) {
                throw new Error('File kosong atau format tidak sesuai');
            }

            const processedData = window.processCustomerData(customers);
            window.dataStore.setData(processedData);

            statusDiv.innerHTML = `
                <div class="flex items-center gap-2 text-sm text-green-600">
                    <i class="fas fa-check-circle"></i>
                    <span><strong>${file.name}</strong> berhasil diupload (${customers.length.toLocaleString()} records)</span>
                </div>
            `;
            statusDiv.classList.remove('hidden');

            clearBtn.classList.remove('hidden');
        } catch (error) {
            console.error('Error processing file:', error);
            statusDiv.innerHTML = `
                <div class="flex items-center gap-2 text-sm text-red-600">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Gagal mengupload file. Pastikan format sesuai template.</span>
                </div>
            `;
            statusDiv.classList.remove('hidden');
        }
    }

    static downloadTemplate() {
        const template = `customer_id,customer_name,email,phone,transaction_date,transaction_amount,product_category,payment_method,customer_age,customer_location
CUST001,Budi Santoso,budi@email.com,081234567890,2024-01-15,450000,Electronics,Credit Card,28,Jakarta
CUST002,Siti Nurhaliza,siti@email.com,081234567891,2024-01-16,125000,Fashion,E-Wallet,35,Bandung
CUST003,Ahmad Wijaya,ahmad@email.com,081234567892,2024-01-17,890000,Electronics,Bank Transfer,42,Surabaya
CUST001,Budi Santoso,budi@email.com,081234567890,2024-02-10,320000,Fashion,Credit Card,28,Jakarta
CUST004,Dewi Lestari,dewi@email.com,081234567893,2024-02-12,560000,Home & Living,E-Wallet,31,Jakarta
CUST002,Siti Nurhaliza,siti@email.com,081234567891,2024-02-15,280000,Beauty,E-Wallet,35,Bandung`;

        const blob = new Blob([template], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template_data_customer.csv";
        a.click();
    }

    static handleClearData() {
        window.dataStore.clearData();
        document.getElementById('upload-status').classList.add('hidden');
        document.getElementById('clear-data-btn').classList.add('hidden');
    }
}

window.Components = Components;
