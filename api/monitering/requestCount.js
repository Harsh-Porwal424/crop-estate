import client from 'prom-client';

// Create a Counter metric to track HTTP requests
const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

// Middleware function to count HTTP requests
const requestCount = (req, res, next) => {
    const startTime = Date.now();  // Record the start time of the request

    res.on('finish', () => {  // When the response is finished
        const endTime = Date.now();  // Record the end time of the request
        //console.log(`Request took ${endTime - startTime}ms`);  // Log the request duration

        const route = req.baseUrl + (req.route ? req.route.path : req.path);  // Combine base URL with route path

        // Increment the request counter metric
        requestCounter.inc({
            method: req.method,  // HTTP method (GET, POST, etc.)
            route: route,  // Full route path
            status_code: res.statusCode  // HTTP status code
        });
    });

    next();  // Call the next middleware
};

export { requestCount };  // Export the middleware function