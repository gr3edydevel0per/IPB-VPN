# naive_client_ip() Function Documentation

## Overview
The `naive_client_ip()` function extracts the client's IP address from HTTP request headers in a VPN/proxy environment. This function is implemented in `/StrixNet - API/utils/clientIp.js`.

## Function Signature
```javascript
function naive_client_ip(req)
```

### Parameters
- `req` (Object): Express.js request object containing HTTP headers and connection information

### Returns
- `string`: Client IP address or 'unknown' if no valid IP is found

## Header Priority Order
The function checks headers in the following priority order to find the real client IP:

1. **X-Forwarded-For** - Most common proxy/load balancer header
   - Format: `client_ip, proxy1_ip, proxy2_ip`
   - Returns the first IP in the comma-separated list (original client)
   
2. **X-Real-IP** - Nginx reverse proxy header
   - Format: `client_ip`
   - Single IP address representing the real client
   
3. **X-Client-IP** - Alternative proxy header
   - Format: `client_ip`
   - Used by some proxy configurations
   
4. **CF-Connecting-IP** - Cloudflare proxy header
   - Format: `client_ip`
   - Specific to Cloudflare CDN/proxy setups
   
5. **req.ip** - Express.js built-in property
   - Uses `connection.remoteAddress` internally
   - Direct connection IP
   
6. **connection.remoteAddress** - Raw socket connection IP
   - Fallback to the actual socket connection
   - Most direct but may be proxy IP in proxy setups

## Usage Example

### Basic Usage
```javascript
const { naive_client_ip } = require('./utils/clientIp');

app.get('/some-endpoint', (req, res) => {
    const clientIp = naive_client_ip(req);
    console.log('Client IP:', clientIp);
    // Use the IP for logging, authentication, etc.
});
```

### Integration with Device Authorization
```javascript
// In device authorization endpoint
router.post('/device-auth-req', verifyToken, async (req, res) => {
    const deviceData = req.body;
    const uuid = deviceData.uuid;
    const device_name = deviceData.device_name;
    const device_id = deviceData.device_id;
    
    // Extract client IP automatically using naive_client_ip
    const ip_address = naive_client_ip(req);
    
    // Store the request with the extracted IP
    await executeQuery(`
        INSERT INTO device_auth_requests (uuid, device_name, device_id, ip_address, status)
        VALUES (?, ?, ?, ?, 'pending')
    `, [uuid, device_name, device_id, ip_address]);
});
```

## Testing the Function

### Test Endpoint
A test endpoint is available at `GET /api/devices/client-ip-test` that shows:
- The extracted IP address
- Which header was used as the source
- All available headers for debugging

### Example Tests

1. **Basic request (no proxy headers):**
```bash
curl http://localhost:5069/api/devices/client-ip-test
```
Expected: Uses `express-req-ip` or `connection-remote-address`

2. **Request with X-Forwarded-For:**
```bash
curl -H "X-Forwarded-For: 192.168.1.100, 10.0.0.1" http://localhost:5069/api/devices/client-ip-test
```
Expected: Extracts `192.168.1.100` from `x-forwarded-for`

3. **Request with X-Real-IP:**
```bash
curl -H "X-Real-IP: 203.0.113.45" http://localhost:5069/api/devices/client-ip-test
```
Expected: Extracts `203.0.113.45` from `x-real-ip`

4. **Priority test with multiple headers:**
```bash
curl -H "X-Forwarded-For: 192.168.1.200" -H "X-Real-IP: 203.0.113.46" http://localhost:5069/api/devices/client-ip-test
```
Expected: Prioritizes X-Forwarded-For and returns `192.168.1.200`

## Security Considerations

### Why "Naive"?
The function is called "naive" because it trusts the HTTP headers without validation:
- Headers can be spoofed by malicious clients
- Multiple proxies might modify headers incorrectly
- No IP address format validation is performed

### Recommendations for Production
1. **Validate IP formats** - Add IP address format validation
2. **Trusted proxy configuration** - Configure Express.js `trust proxy` setting
3. **Rate limiting** - Use the extracted IP for rate limiting
4. **Logging** - Log the source header used for audit trails
5. **Fallback handling** - Handle 'unknown' IP addresses appropriately

## File Locations
- **Implementation:** `/StrixNet - API/utils/clientIp.js`
- **Integration:** `/StrixNet - API/routes/deviceRoutes.js` (lines 5, 236)
- **Test endpoint:** `GET /api/devices/client-ip-test`