document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    Components.createDataUpload();
    Components.createMetricsOverview();
    Components.createPerformanceCharts();
    
    // Subscribe to data store changes
    window.dataStore.subscribe(() => {
        Components.createMetricsOverview();
        Components.createPerformanceCharts();
        // Add other component updates here
    });

    // Header event listeners
    document.getElementById('time-range').addEventListener('change', function(e) {
        window.dataStore.setTimeRange(e.target.value);
    });

    document.getElementById('refresh-btn').addEventListener('click', function() {
        const icon = this.querySelector('i');
        icon.classList.add('animate-spin');
        setTimeout(() => {
            icon.classList.remove('animate-spin');
        }, 1000);
    });

    // Download button
    document.getElementById('download-btn').addEventListener('click', function() {
        alert('Fitur download akan segera hadir!');
    });

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', function() {
        alert('Fitur settings akan segera hadir!');
    });
});
