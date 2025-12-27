class DataStore {
    constructor() {
        this.listeners = new Set();
        this.data = null;
        this.timeRange = "30d";
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    setData(data) {
        this.data = data;
        this.notify();
    }

    getData() {
        return this.data;
    }

    getFilteredData() {
        if (!this.data) return null;

        const now = new Date("2025-10-04");
        let daysToFilter = 30;

        switch (this.timeRange) {
            case "24h":
                daysToFilter = 1;
                break;
            case "7d":
                daysToFilter = 7;
                break;
            case "30d":
                daysToFilter = 30;
                break;
            case "90d":
                daysToFilter = 90;
                break;
            default:
                daysToFilter = 30;
        }

        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - daysToFilter);

        const filteredCustomers = this.data.customers.filter(customer => {
            const transactionDate = new Date(customer.transaction_date);
            return transactionDate >= cutoffDate && transactionDate <= now;
        });

        if (filteredCustomers.length === 0) {
            return this.data;
        }

        return window.processCustomerData(filteredCustomers);
    }

    setTimeRange(range) {
        this.timeRange = range;
        this.notify();
    }

    getTimeRange() {
        return this.timeRange;
    }

    clearData() {
        this.data = null;
        this.notify();
    }

    hasData() {
        return this.data !== null;
    }
}

const dataStore = new DataStore();
window.dataStore = dataStore;
