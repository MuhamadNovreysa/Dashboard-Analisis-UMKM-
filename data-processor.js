function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());

    const customers = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim());
        if (values.length < headers.length) continue;

        const customer = {};
        headers.forEach((header, index) => {
            customer[header] = values[index];
        });

        customers.push({
            customer_id: customer.customer_id || `CUST${i}`,
            transaction_date: customer.transaction_date || new Date().toISOString().split("T")[0],
            transaction_amount: parseFloat(customer.transaction_amount) || 0,
            product_category: customer.product_category || "Unknown",
            payment_method: customer.payment_method || "Unknown",
            customer_age: parseInt(customer.customer_age) || 0,
            customer_location: customer.customer_location || "Unknown",
            customer_name: customer.customer_name,
            email: customer.email,
            phone: customer.phone,
        });
    }

    return customers;
}

function processCustomerData(customers) {
    const customerMetrics = new Map();
    const today = new Date();

    customers.forEach(customer => {
        const existing = customerMetrics.get(customer.customer_id);
        const transactionDate = new Date(customer.transaction_date);
        const daysSinceTransaction = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (existing) {
            existing.frequency += 1;
            existing.monetary += customer.transaction_amount;
            existing.recency = Math.min(existing.recency, daysSinceTransaction);
            existing.transactions.push(customer);
        } else {
            customerMetrics.set(customer.customer_id, {
                recency: daysSinceTransaction,
                frequency: 1,
                monetary: customer.transaction_amount,
                transactions: [customer],
            });
        }
    });

    const customerArray = Array.from(customerMetrics.entries()).map(([id, metrics]) => ({
        id,
        ...metrics,
    }));

    const maxFrequency = Math.max(...customerArray.map(c => c.frequency));
    const maxMonetary = Math.max(...customerArray.map(c => c.monetary));

    const normalizedCustomers = customerArray.map(c => ({
        ...c,
        normalizedFrequency: c.frequency / maxFrequency,
        normalizedMonetary: c.monetary / maxMonetary,
    }));

    const segments = performKMeans(normalizedCustomers, 4);

    const totalRevenue = customers.reduce((sum, c) => sum + c.transaction_amount, 0);
    const uniqueCustomers = new Set(customers.map(c => c.customer_id)).size;

    const timeSeriesMap = new Map();
    customers.forEach(c => {
        const date = c.transaction_date;
        const existing = timeSeriesMap.get(date) || { revenue: 0, transactions: 0 };
        existing.revenue += c.transaction_amount;
        existing.transactions += 1;
        timeSeriesMap.set(date, existing);
    });

    const timeSeriesData = Array.from(timeSeriesMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

    return {
        customers,
        metrics: {
            totalCustomers: uniqueCustomers,
            totalTransactions: customers.length,
            totalRevenue,
            conversionRate: (uniqueCustomers / customers.length) * 100,
            avgTransactionValue: totalRevenue / customers.length,
        },
        segments,
        clusterData: normalizedCustomers.map(c => ({
            x: c.normalizedFrequency * 100,
            y: c.normalizedMonetary / 1000,
            segment: getSegmentName(c, segments),
            customer_id: c.id,
        })),
        timeSeriesData,
        categoryData: calculateCategoryData(customers),
        cohortData: calculateCohortData(customers),
        clvData: calculateCLVData(customerArray),
        rfmData: calculateRFMData(segments),
    };
}

function performKMeans(customers, k) {
    const sorted = [...customers].sort((a, b) => b.monetary - a.monetary);
    const segmentSize = Math.ceil(sorted.length / k);
    
    const segments = [
        { name: "High Value", customers: sorted.slice(0, segmentSize) },
        { name: "Medium Value", customers: sorted.slice(segmentSize, segmentSize * 2) },
        { name: "Low Value", customers: sorted.slice(segmentSize * 2, segmentSize * 3) },
        { name: "Potential", customers: sorted.slice(segmentSize * 3) },
    ];

    return segments.map(seg => ({
        name: seg.name,
        count: seg.customers.length,
        percentage: (seg.customers.length / customers.length) * 100,
        avgValue: seg.customers.reduce((sum, c) => sum + c.monetary, 0) / seg.customers.length,
        customers: seg.customers.flatMap(c => c.transactions),
    }));
}

function getSegmentName(customer, segments) {
    for (const segment of segments) {
        if (segment.customers.some(c => c.id === customer.id)) {
            return segment.name;
        }
    }
    return "Unknown";
}

function calculateCategoryData(customers) {
    const categoryMap = new Map();

    customers.forEach(c => {
        const existing = categoryMap.get(c.product_category) || 0;
        categoryMap.set(c.product_category, existing + c.transaction_amount);
    });

    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryMap.entries())
        .map(([name, revenue]) => ({
            name,
            value: Math.round((revenue / total) * 100),
            revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
}

function calculateCohortData(customers) {
    const monthlyData = new Map();

    customers.forEach(c => {
        const month = new Date(c.transaction_date).toLocaleDateString("id-ID", { month: "short" });
        const existing = monthlyData.get(month) || { customers: new Set(), revenue: 0 };
        existing.customers.add(c.customer_id);
        existing.revenue += c.transaction_amount;
        monthlyData.set(month, existing);
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const sortedMonths = Array.from(monthlyData.entries()).sort((a, b) => 
        months.indexOf(a[0]) - months.indexOf(b[0])
    );

    const firstMonthCustomers = sortedMonths[0]?.[1].customers.size || 1;

    return sortedMonths.slice(-6).map(([month, data]) => ({
        month,
        retention: Math.round((data.customers.size / firstMonthCustomers) * 100),
        revenue: Math.round(data.revenue / 1000000),
    }));
}

function calculateCLVData(customerArray) {
    const ranges = [
        { range: "< 1M", min: 0, max: 1000000 },
        { range: "1-3M", min: 1000000, max: 3000000 },
        { range: "3-5M", min: 3000000, max: 5000000 },
        { range: "5-10M", min: 5000000, max: 10000000 },
        { range: "> 10M", min: 10000000, max: Number.POSITIVE_INFINITY },
    ];

    const distribution = ranges.map(r => ({
        range: r.range,
        count: customerArray.filter(c => c.monetary >= r.min && c.monetary < r.max).length,
        percentage: 0,
    }));

    const total = customerArray.length;
    distribution.forEach(d => {
        d.percentage = Math.round((d.count / total) * 100);
    });

    return distribution;
}

function calculateRFMData(segments) {
    const allCustomers = segments.flatMap(seg => seg.customers);

    const maxRecency = Math.max(...allCustomers.map(c => c.recency || 0));
    const maxFrequency = Math.max(...allCustomers.map(c => c.frequency || 1));
    const maxMonetary = Math.max(...allCustomers.map(c => c.monetary || 0));

    return segments.map(seg => {
        const customers = seg.customers;
        const avgRecency = customers.reduce((sum, c) => sum + (c.recency || 0), 0) / customers.length;
        const avgFrequency = customers.reduce((sum, c) => sum + (c.frequency || 1), 0) / customers.length;
        const avgMonetary = customers.reduce((sum, c) => sum + (c.monetary || 0), 0) / customers.length;

        return {
            segment: seg.name,
            recency: Math.round(Math.max(0, 100 - (avgRecency / maxRecency) * 100)),
            frequency: Math.round((avgFrequency / maxFrequency) * 100),
            monetary: Math.round((avgMonetary / maxMonetary) * 100),
            count: seg.count,
        };
    });
}

window.parseCSV = parseCSV;
window.processCustomerData = processCustomerData;
