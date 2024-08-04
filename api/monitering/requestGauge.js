import client from 'prom-client';

const activeUserGauge = new client.Gauge({
    name: 'active_users',
    help: 'Total number of users whose requests are active',
    labelNames: ['method', 'route']
});

const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Total number of active requests'
});

const activeRequests = new Set();

// Middleware function to track active users
function requestGauge(req, res, next) {
    const route = req.baseUrl + (req.route ? req.route.path : req.path);
    const requestId = `${req.method}:${route}:${req.ip}:${Date.now()}`;

    if (!activeRequests.has(requestId)) {
        activeRequests.add(requestId);
        activeUserGauge.inc({
            method: req.method,
            route: route,
        });
        activeRequestsGauge.inc();
        //console.log(`Incremented gauge for ${route} (requestId: ${requestId})`);
        
        // Get active request count safely
        const gaugeMetrics = activeRequestsGauge.get();
        const activeRequestsCount = gaugeMetrics && gaugeMetrics.values && gaugeMetrics.values.length > 0
            ? gaugeMetrics.values[0].value
            : 0;
       // console.log(`Total active requests: ${activeRequestsCount}`);
    }

    const decrementGauge = () => {
        if (activeRequests.has(requestId)) {
            activeRequests.delete(requestId);
            activeUserGauge.dec({
                method: req.method,
                route: route,
            });
            activeRequestsGauge.dec();
           // console.log(`Decremented gauge for ${route} (requestId: ${requestId})`);
            
            // Get active request count safely
            const gaugeMetrics = activeRequestsGauge.get();
            const activeRequestsCount = gaugeMetrics && gaugeMetrics.values && gaugeMetrics.values.length > 0
                ? gaugeMetrics.values[0].value
                : 0;
            //console.log(`Total active requests: ${activeRequestsCount}`);
        }
    };

    // Ensure the gauge is decremented after 10 seconds
    setTimeout(decrementGauge, 10000);

    res.on('finish', decrementGauge);
    res.on('close', decrementGauge);

    next();
}

export { requestGauge };