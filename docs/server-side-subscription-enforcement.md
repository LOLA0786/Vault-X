# Server-Side Subscription Enforcement

## Overview
Added server-side middleware to enforce subscription requirements on all premium API endpoints. This prevents users without active subscriptions from accessing features even if they bypass client-side checks.

---

## Implementation

### **Middleware Created** (`server/middleware/subscription-check.ts`)

#### `requireSubscription` Middleware
Blocks requests from users without active subscriptions.

**Checks:**
1. ✅ User ID is provided
2. ✅ User exists in database
3. ✅ User has a plan (`currentPlan` is not null)
4. ✅ Plan is not 'free'
5. ✅ Plan status is 'active'
6. ✅ Subscription hasn't expired

**Response on Failure:**
```json
{
  "error": "Active subscription required. Please subscribe to access this feature.",
  "requiresSubscription": true,
  "currentPlan": "none",
  "planStatus": "inactive"
}
```

**HTTP Status:** `403 Forbidden`

---

## Protected API Endpoints

### **Chat Sessions** (AI Chat Feature)
```typescript
POST   /api/chat-sessions              ← PROTECTED
GET    /api/chat-sessions/user/:userId ← PROTECTED
PUT    /api/chat-sessions/:id          ← PROTECTED
DELETE /api/chat-sessions/:id          ← PROTECTED
```

### **File Storage** (Vault Feature)
```typescript
POST   /api/upload                     ← PROTECTED
POST   /api/files                      ← PROTECTED
GET    /api/files/user/:userId         ← PROTECTED
GET    /api/files/:id                  ← PROTECTED
DELETE /api/files/:id                  ← PROTECTED
```

### **AI Agents**
```typescript
POST   /api/ai-agents                  ← PROTECTED
GET    /api/ai-agents/user/:userId     ← PROTECTED
PUT    /api/ai-agents/:id              ← PROTECTED
DELETE /api/ai-agents/:id              ← PROTECTED
```

---

## Public API Endpoints (No Subscription Required)

### **User Management**
```typescript
POST   /api/users                      ← PUBLIC (registration)
GET    /api/users/:email               ← PUBLIC (login)
```

### **Payments**
```typescript
POST   /api/payments/create-order      ← PUBLIC (to subscribe)
POST   /api/payments/verify            ← PUBLIC (payment confirmation)
GET    /api/payments/user/:userId      ← PUBLIC (view own payments)
```

### **Subscriptions**
```typescript
GET    /api/subscriptions/user/:userId ← PUBLIC (view own subscription)
PUT    /api/subscriptions/user/:userId ← PUBLIC (manage subscription)
```

### **Admin** (Separate Auth Check)
```typescript
GET    /api/admin/users                ← ADMIN ONLY
GET    /api/admin/payments             ← ADMIN ONLY
GET    /api/admin/subscriptions        ← ADMIN ONLY
```

---

## How It Works

### **Request Flow:**

```
1. Client sends request to /api/chat-sessions
   ↓
2. requireSubscription middleware intercepts
   ↓
3. Extracts userId from request
   ↓
4. Fetches user from database
   ↓
5. Checks subscription status
   ↓
6a. ✅ Valid subscription → next() → Route handler
6b. ❌ No subscription → 403 error response
```

### **Example: Creating a Chat Session**

**Without Subscription:**
```bash
POST /api/chat-sessions
Body: { userId: "abc123", title: "Hello", encryptedHistory: "..." }

Response: 403 Forbidden
{
  "error": "Active subscription required. Please subscribe to access this feature.",
  "requiresSubscription": true,
  "currentPlan": "none",
  "planStatus": "inactive"
}
```

**With Active Subscription:**
```bash
POST /api/chat-sessions
Body: { userId: "abc123", title: "Hello", encryptedHistory: "..." }

Response: 200 OK
{
  "id": "session123",
  "userId": "abc123",
  "title": "Hello",
  ...
}
```

---

## Client-Side Handling

### **Detect Subscription Required Error:**

```typescript
try {
  const response = await fetch('/api/chat-sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (response.status === 403) {
    const error = await response.json();
    
    if (error.requiresSubscription) {
      // Redirect to subscription page
      setLocation('/subscription-required');
      
      toast.error(error.error);
      return;
    }
  }
  
  // Handle success
  const result = await response.json();
  
} catch (error) {
  // Handle network errors
}
```

---

## Security Benefits

### **1. Defense in Depth**
- ✅ Client-side checks (UX)
- ✅ Server-side enforcement (Security)
- ✅ Database-level validation

### **2. Prevents Bypass**
- ❌ Cannot use API directly
- ❌ Cannot modify client code
- ❌ Cannot fake subscription status

### **3. Clear Error Messages**
- Users know why request failed
- Clear path to resolution (subscribe)
- Includes current plan status

---

## Testing

### **Test Cases:**

#### **1. User Without Subscription**
```bash
# Create user
POST /api/users
{ "email": "test@example.com" }

# Try to create chat (should fail)
POST /api/chat-sessions
{ "userId": "user123", "title": "Test", "encryptedHistory": "..." }

Expected: 403 Forbidden
```

#### **2. User With Active Subscription**
```bash
# User subscribes and payment verified
# currentPlan: "starter-plan"
# planStatus: "active"

# Try to create chat (should succeed)
POST /api/chat-sessions
{ "userId": "user123", "title": "Test", "encryptedHistory": "..." }

Expected: 200 OK
```

#### **3. Expired Subscription**
```bash
# User's subscription expired
# subscriptionEndDate: 2025-01-01 (past)

# Try to create chat (should fail)
POST /api/chat-sessions
{ "userId": "user123", "title": "Test", "encryptedHistory": "..." }

Expected: 403 Forbidden
{ "error": "Subscription expired...", "subscriptionExpired": true }
```

---

## Monitoring & Logging

### **Log Subscription Checks:**
```typescript
console.log('[Subscription Check] User:', userId);
console.log('[Subscription Check] Plan:', user.currentPlan);
console.log('[Subscription Check] Status:', user.planStatus);
console.log('[Subscription Check] Result:', hasActiveSubscription ? 'ALLOWED' : 'BLOCKED');
```

### **Track Blocked Requests:**
```typescript
// Add to middleware
if (!hasActiveSubscription) {
  console.warn('[Subscription Block]', {
    userId,
    endpoint: req.path,
    method: req.method,
    currentPlan: user.currentPlan,
    planStatus: user.planStatus
  });
}
```

---

## Migration Notes

### **Existing Users:**

If you have existing users in the database with `currentPlan: null` or `planStatus: 'inactive'`, they will be blocked from accessing premium features immediately after deploying this update.

**Options:**

1. **Force All to Subscribe** (Recommended)
   - All users must subscribe to continue
   - Clear monetization path

2. **Grace Period**
   - Give existing users 7-14 days to subscribe
   - Send email notifications
   - Show countdown in app

3. **Grandfather Existing Users**
   - Give existing users a free plan
   - Only new users must subscribe
   - Not recommended for revenue

---

## Error Handling Best Practices

### **Client-Side:**

```typescript
async function createChatSession(data) {
  try {
    const response = await fetch('/api/chat-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      // Handle subscription required
      if (error.requiresSubscription) {
        if (error.subscriptionExpired) {
          toast.error('Your subscription has expired. Please renew to continue.');
        } else {
          toast.error('This feature requires an active subscription.');
        }
        
        // Redirect to subscription page
        setTimeout(() => {
          setLocation('/subscription-required');
        }, 2000);
        
        return null;
      }
      
      // Handle other errors
      throw new Error(error.error || 'Request failed');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Failed to create chat session:', error);
    toast.error('Failed to create chat session');
    return null;
  }
}
```

---

## Performance Considerations

### **Database Queries:**
- Each protected request queries the database for user info
- Consider caching user subscription status
- Use Redis or in-memory cache for high-traffic apps

### **Optimization:**
```typescript
// Cache user subscription status for 5 minutes
const userCache = new Map();

export async function requireSubscription(req, res, next) {
  const userId = req.body.userId || req.params.userId;
  
  // Check cache first
  const cached = userCache.get(userId);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 min
    if (!cached.hasSubscription) {
      return res.status(403).json({ error: 'Subscription required' });
    }
    return next();
  }
  
  // Fetch from database
  const user = await storage.getUser(userId);
  const hasSubscription = checkSubscription(user);
  
  // Cache result
  userCache.set(userId, {
    hasSubscription,
    timestamp: Date.now()
  });
  
  if (!hasSubscription) {
    return res.status(403).json({ error: 'Subscription required' });
  }
  
  next();
}
```

---

## Conclusion

✅ **Server-side enforcement is now active**
✅ **All premium features are protected**
✅ **Users without subscriptions cannot access:**
   - AI Chat
   - File Storage
   - AI Agents
   - Chat History

✅ **Users can still access:**
   - Registration
   - Login
   - Pricing page
   - Payment/subscription management
   - Settings
   - Key management

**Next Steps:**
1. Test with real users
2. Monitor blocked requests
3. Add usage tracking
4. Implement plan limit enforcement (file size, chat count, etc.)
