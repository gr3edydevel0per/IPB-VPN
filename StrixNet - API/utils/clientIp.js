/**
 * Naively extracts client IP address from HTTP request headers
 * This function checks multiple headers in order of preference to find the real client IP
 * 
 * Headers checked in order:
 * 1. X-Forwarded-For (most common proxy header)
 * 2. X-Real-IP (nginx proxy header)
 * 3. X-Client-IP (alternative proxy header)
 * 4. CF-Connecting-IP (Cloudflare)
 * 5. req.ip (Express.js built-in, uses connection.remoteAddress)
 * 
 * @param {Object} req - Express.js request object
 * @returns {string} - Client IP address or 'unknown' if not found
 */
function naive_client_ip(req) {
    // Check X-Forwarded-For header (most common for proxies/load balancers)
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // X-Forwarded-For can contain multiple IPs, get the first one (original client)
        const firstIp = xForwardedFor.split(',')[0].trim();
        if (firstIp && firstIp !== 'unknown') {
            return firstIp;
        }
    }
    
    // Check X-Real-IP header (nginx reverse proxy)
    const xRealIp = req.headers['x-real-ip'];
    if (xRealIp && xRealIp !== 'unknown') {
        return xRealIp;
    }
    
    // Check X-Client-IP header (alternative proxy header)
    const xClientIp = req.headers['x-client-ip'];
    if (xClientIp && xClientIp !== 'unknown') {
        return xClientIp;
    }
    
    // Check Cloudflare connecting IP
    const cfConnectingIp = req.headers['cf-connecting-ip'];
    if (cfConnectingIp && cfConnectingIp !== 'unknown') {
        return cfConnectingIp;
    }
    
    // Fallback to Express.js built-in req.ip (uses connection.remoteAddress)
    if (req.ip && req.ip !== '::1') {  // Exclude localhost IPv6
        return req.ip;
    }
    
    // Final fallback to connection remote address
    const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
    if (remoteAddress && remoteAddress !== '::1') {
        return remoteAddress;
    }
    
    // If all else fails, return unknown
    return 'unknown';
}

module.exports = {
    naive_client_ip
};