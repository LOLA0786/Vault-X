# Testing Subscription Enforcement

## Quick Test Guide

### **Step 1: Restart the Server**
The middleware changes require a server restart to take effect.

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### **Step 2: Create a New User (No Subscription)**

1. Go to the app
2. Sign up with a new email (e.g., `test-free@example.com`)
3. Complete encryption onboarding

**Expected User State:**
```json
{
  "currentPlan": null,
  "planStatus": "inactive"
}
```

### **Step 3: Try to Access Protected Features**

#### **Test 1: Try to Create a Chat**
1. Go to `/chat`
2. Try to send a message

**Expected Behavior:**
- ❌ Client-side: Redirected to `/subscription-required`
- ❌ Server-side: If API called directly, returns `403 Forbidden`

**Server Logs Should Show:**
```
[Subscription Check] {
  userId: 'xxx',
  endpoint: '/api/chat-sessions',
  currentPlan: null,
  planStatus: 'inactive',
  hasActiveSubscription: false
}
```

#### **Test 2: Try to Upload a File**
1. Go to `/vault` (dashboard vault tab)
2. Try to upload a file

**Expected Behavior:**
- ❌ Redirected to `/subscription-required`
- ❌ API returns `403 Forbidden`

#### **Test 3: Try to Create an AI Agent**
1. Go to `/agents`
2. Try to create a new agent

**Expected Behavior:**
- ❌ Redirected to `/subscription-required`
- ❌ API returns `403 Forbidden`

### **Step 4: Subscribe to a Plan**

1. Click "View Plans" on subscription-required page
2. Go to `/pricing`
3. Select a plan (e.g., Starter - $7/month)
4. Complete payment

**Expected User State After Payment:**
```json
{
  "currentPlan": "starter-plan",
  "planStatus": "active",
  "subscriptionStartDate": "2025-01-11T...",
  "subscriptionEndDate": "2025-02-11T..."
}
```

### **Step 5: Try Protected Features Again**

#### **Test 4: Create a Chat (With Subscription)**
1. Go to `/chat`
2. Send a message

**Expected Behavior:**
- ✅ Chat works
- ✅ Message sent successfully
- ✅ Server logs show: `hasActiveSubscription: true`

#### **Test 5: Upload a File (With Subscription)**
1. Go to `/vault`
2. Upload a file

**Expected Behavior:**
- ✅ File uploads successfully
- ✅ File appears in vault

#### **Test 6: Create an AI Agent (With Subscription)**
1. Go to `/agents`
2. Create a new agent

**Expected Behavior:**
- ✅ Agent created successfully

---

## Manual API Testing

### **Test Without Subscription:**

```bash
# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Response: { "id": "user123", "currentPlan": null, "planStatus": "inactive" }

# Try to create a chat session
curl -X POST http://localhost:5000/api/chat-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Test Chat",
    "encryptedHistory": "encrypted_data_here"
  }'

# Expected Response: 403 Forbidden
# {
#   "error": "Active subscription required. Please subscribe to access this feature.",
#   "requiresSubscription": true,
#   "currentPlan": "none",
#   "planStatus": "inactive"
# }
```

### **Test With Subscription:**

```bash
# Manually update user in database to have a subscription
# (Or complete payment flow)

# Try to create a chat session
curl -X POST http://localhost:5000/api/chat-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Test Chat",
    "encryptedHistory": "encrypted_data_here"
  }'

# Expected Response: 200 OK
# {
#   "id": "session123",
#   "userId": "user123",
#   "title": "Test Chat",
#   ...
# }
```

---

## Debugging

### **If Users Can Still Access Features Without Subscription:**

1. **Check if server was restarted**
   - Middleware changes require restart
   - Look for `[Subscription Check]` logs

2. **Check middleware is applied**
   ```typescript
   // In server/routes.ts
   app.post("/api/chat-sessions", requireSubscription, async (req, res) => {
   //                             ^^^^^^^^^^^^^^^^^^^^ Must be here
   ```

3. **Check user's plan status**
   ```bash
   # Query database
   SELECT id, email, currentPlan, planStatus FROM users WHERE email = 'test@example.com';
   ```

4. **Check server logs**
   - Should see `[Subscription Check]` for each protected request
   - Should show `hasActiveSubscription: false` for users without plans

### **Common Issues:**

#### **Issue 1: Middleware Not Running**
**Symptom:** No `[Subscription Check]` logs
**Solution:** Restart server, verify middleware is imported and applied

#### **Issue 2: Wrong User ID**
**Symptom:** `User not found` error
**Solution:** Verify userId is being passed correctly in request

#### **Issue 3: Plan Status Not Updated**
**Symptom:** User paid but still blocked
**Solution:** Check payment verification updates `currentPlan` and `planStatus`

---

## Expected Server Logs

### **User Without Subscription:**
```
[Subscription Check] {
  userId: 'f286b984-654f-4b74-8874-55bf471789ea',
  endpoint: '/api/chat-sessions',
  currentPlan: null,
  planStatus: 'inactive',
  hasActiveSubscription: false
}
11:07:13 PM [express] POST /api/chat-sessions 403 in 50ms :: {"error":"Active subscription required..."}
```

### **User With Active Subscription:**
```
[Subscription Check] {
  userId: 'abc123',
  endpoint: '/api/chat-sessions',
  currentPlan: 'starter-plan',
  planStatus: 'active',
  hasActiveSubscription: true
}
11:07:13 PM [express] POST /api/chat-sessions 200 in 150ms :: {"id":"session123"...}
```

---

## Checklist

Before considering the feature complete, verify:

- [ ] Server restarted after middleware changes
- [ ] New users have `currentPlan: null` and `planStatus: 'inactive'`
- [ ] Users without subscription **cannot** create chats
- [ ] Users without subscription **cannot** upload files
- [ ] Users without subscription **cannot** create AI agents
- [ ] Users **can** view pricing page
- [ ] Users **can** subscribe/pay
- [ ] After payment, `currentPlan` and `planStatus` are updated
- [ ] Users with active subscription **can** access all features
- [ ] Server logs show `[Subscription Check]` for protected requests
- [ ] 403 errors have clear messages
- [ ] Client redirects to `/subscription-required` on 403

---

## Next Steps After Verification

Once subscription enforcement is working:

1. **Add Usage Tracking**
   - Track monthly chat count
   - Track storage used
   - Track AI agent count

2. **Enforce Plan Limits**
   - Block file uploads exceeding size limit
   - Block chats when monthly limit reached
   - Block agent creation when limit reached

3. **Add Usage Meters**
   - Show "150/200 chats used this month"
   - Show "45/50 GB storage used"
   - Show "2/3 AI agents created"

4. **Add Upgrade Prompts**
   - When approaching limits
   - When trying to exceed limits
   - Suggest appropriate plan upgrade
