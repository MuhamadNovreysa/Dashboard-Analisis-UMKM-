<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analisis Dashboard - UMKM</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo">
                <i class="fas fa-chart-pie"></i>
                <h1>Dashboard Analisis</h1>
            </div>
            <nav class="nav">
                <a href="index.html"><i class="fas fa-home"></i> Beranda</a>
                <a href="ai-cleaner.html"><i class="fas fa-robot"></i> AI Data Cleaner</a>
                <a href="analytics.html" class="active"><i class="fas fa-chart-pie"></i> Analisis</a>
            </nav>
        </header>

        <!-- Upload Clean Data -->
        <section class="upload-clean">
            <h2><i class="fas fa-upload"></i> Upload Dataset Bersih</h2>
            <p>Upload file CSV yang telah dibersihkan dari AI Data Cleaner.</p>
            <div class="upload-area">
                <input type="file" id="cleanFileInput" accept=".csv">
                <label for="cleanFileInput" class="btn btn-primary">
                    <i class="fas fa-file-csv"></i> Upload CSV Bersih
                </label>
            </div>
        </section>

        <!-- Analytics Dashboard -->
        <main class="analytics-dashboard" id="analyticsDashboard" style="display: none;">
            <!-- Summary Stats -->
            <div class="summary-stats">
                <div class="stat-card">
                    <h3>Total Pelanggan</h3>
                    <p id="totalCustomers">0</p>
                </div>
                <div class="stat-card">
                    <h3>Total Transaksi</h3>
                    <p id="totalTransactions">0</p>
                </div>
                <div class="stat-card">
                    <h3>Total Revenue</h3>
                    <p id="totalRevenue">Rp 0</p>
                </div>
                <div class="stat-card">
                    <h3>Avg. Transaction</h3>
                    <p id="avgTransaction">Rp 0</p>
                </div>
            </div>

            <!-- Segmentation Chart -->
            <div class="chart-container">
                <h2><i class="fas fa-users"></i> Segmentasi Pelanggan (K-Means)</h2>
                <div class="chart-wrapper">
                    <canvas id="segmentationChart"></canvas>
                </div>
                <div class="segment-info">
                    <div class="segment-box high-value">
                        <h4>High Value</h4>
                        <p>Pelanggan dengan nilai transaksi tinggi dan loyalitas kuat</p>
                        <p class="count" id="highValueCount">0</p>
                    </div>
                    <div class="segment-box medium-value">
                        <h4>Medium Value</h4>
                        <p>Pelanggan dengan nilai transaksi sedang dan potensi berkembang</p>
                        <p class="count" id="mediumValueCount">0</p>
                    </div>
                    <div class="segment-box low-value">
                        <h4>Low Value</h4>
                        <p>Pelanggan dengan nilai transaksi rendah atau jarang bertransaksi</p>
                        <p class="count" id="lowValueCount">0</p>
                    </div>
                    <div class="segment-box potential">
                        <h4>Potential</h4>
                        <p>Pelanggan baru dengan potensi tinggi untuk dikembangkan</p>
                        <p class="count" id="potentialCount">0</p>
                    </div>
                </div>
            </div>

            <!-- RFM & CLV Analysis -->
            <div class="analysis-grid">
                <div class="chart-container">
                    <h2><i class="fas fa-star"></i> Analisis RFM</h2>
                    <div class="chart-wrapper">
                        <canvas id="rfmChart"></canvas>
                    </div>
                </div>
                <div class="chart-container">
                    <h2><i class="fas fa-coins"></i> Customer Lifetime Value</h2>
                    <div class="chart-wrapper">
                        <canvas id="clvChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Product Category Performance -->
            <div class="chart-container">
                <h2><i class="fas fa-boxes"></i> Performa Kategori Produk</h2>
                <div class="chart-wrapper">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>

            <!-- Customer Details Table -->
            <div class="table-container">
                <h2><i class="fas fa-table"></i> Detail Pelanggan per Segment</h2>
                <div class="table-wrapper">
                    <table id="customerTable">
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Segment</th>
                                <th>Total Transaksi</th>
                                <th>Total Nilai</th>
                                <th>Transaksi Terakhir</th>
                                <th>RFM Score</th>
                                <th>CLV</th>
                            </tr>
                        </thead>
                        <tbody id="customerTableBody">
                            <!-- Data akan diisi -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- AI Recommendations -->
            <div class="recommendations">
                <h2><i class="fas fa-lightbulb"></i> Rekomendasi Strategi Pemasaran (AI)</h2>
                <div class="recommendation-grid">
                    <div class="recommendation-card">
                        <h4>High Value Customers</h4>
                        <p><strong>Strategi:</strong> Loyalty program, personalized offers</p>
                        <p><strong>Aksi:</strong> Kirim diskon eksklusif, survey kepuasan</p>
                    </div>
                    <div class="recommendation-card">
                        <h4>Medium Value Customers</h4>
                        <p><strong>Strategi:</strong> Upselling & cross-selling</p>
                        <p><strong>Aksi:</strong> Tawarkan produk premium, bundle packages</p>
                    </div>
                    <div class="recommendation-card">
                        <h4>Low Value Customers</h4>
                        <p><strong>Strategi:</strong> Re-engagement campaigns</p>
                        <p><strong>Aksi:</strong> Email reminder, special discounts</p>
                    </div>
                    <div class="recommendation-card">
                        <h4>Potential Customers</h4>
                        <p><strong>Strategi:</strong> Onboarding & education</p>
                        <p><strong>Aksi:</strong> Welcome offers, product tutorials</p>
                    </div>
                </div>
            </div>

            <!-- Export Options -->
            <div class="export-section">
                <h2><i class="fas fa-file-export"></i> Ekspor Hasil Analisis</h2>
                <div class="export-buttons">
                    <button id="exportPDF" class="btn btn-primary">
                        <i class="fas fa-file-pdf"></i> Export PDF Report
                    </button>
                    <button id="exportCSV" class="btn btn-secondary">
                        <i class="fas fa-file-csv"></i> Export Data CSV
                    </button>
                    <button id="exportCharts" class="btn btn-success">
                        <i class="fas fa-chart-bar"></i> Export Charts as PNG
                    </button>
                </div>
            </div>
        </main>

        <footer class="footer">
            <p>© 2025 Dashboard Analisis | Segmentasi Pelanggan UMKM</p>
        </footer>
    </div>

    <script src="analytics.js"></script>
</body>
</html>
