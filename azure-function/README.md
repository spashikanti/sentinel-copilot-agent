# Sentinel Azure Function – AST Analysis Engine

This Azure Function is a core component of the Sentinel Copilot Agent architecture.

It performs **AST-style structural analysis and sanitization** of Power Automate flow definitions before they are processed by AI models.

---

## 🎯 Purpose

- Detect structural issues in flows  
- Identify sensitive data patterns  
- Enforce governance rules  
- Prevent unsafe data from being sent to AI  

---

## 🔐 Security & Compliance Role

This function acts as a **pre-processing security layer**:

✅ Detects:
- Hardcoded secrets  
- Sensitive URLs  
- Unsafe configurations  

✅ Protects:
- Prevents sensitive data from being sent to Azure OpenAI  
- Ensures controlled AI usage  

👉 Implements **"Analyze First, Send Later"** principle  

---

## 🔍 Analysis Capabilities

- Recursive parsing of flow definitions  
- Connector and action inspection  
- Risk detection:
  - Missing retry policies  
  - External HTTP calls  
  - Unsafe patterns  

---

## 🔗 Integration

Called from:

👉 `snl_fl_Intelligence_AnalyzeFlow`

### Input:

{
"definition": ""
}

### Output:

{
"issueCount": 3,
"issues": [...],
"hasSensitiveContent": true
}

---

## 🚀 Deployment Steps

1. Deploy using Azure Functions  
2. Copy:
   - Function URL  
   - Function Key  

3. Configure in environment variables:
   - `env_SentinelSanitizer_FunctionUrl`
   - `env_SentinelSanitizer_FunctionKey`

---

## 📦 Tech Stack

- Node.js Azure Functions  
- Power Automate integration  

---

✅ This function enhances Sentinel by adding a **deterministic, secure, rule-based governance layer** alongside AI.
