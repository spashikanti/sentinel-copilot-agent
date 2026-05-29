# Azure OpenAI Integration

Sentinel uses Azure OpenAI to enable intelligent governance analysis of Power Automate flows.

---

## 🧠 Where AI is Used

Flow:
snl_fl_Intelligence_AnalyzeFlows

---

## 📥 Input to AI

- DefinitionJSON (Power Automate flow definition)
- Flow metadata from Sentinel Flows list

---

## ⚙️ Processing

Azure OpenAI analyzes the flow definition to detect:

- Security risks (e.g., hardcoded secrets, API keys)
- Lack of retry or error handling
- Concurrency and throttling risks
- Data exposure patterns
- Use of insecure connectors or configurations

---

## 📤 Output (Structured Data)

The AI generates structured output stored in Sentinel Results:

- RiskScore (0–100)
- RiskLevel (Low, Medium, High, Critical)
- GovernanceIssues (JSON format)
- IssueSummary (human-readable explanation)

---

## 🎯 Purpose

This enables:

- Automated governance analysis at scale
- Detection of issues that are difficult to identify using static rules
- Human-friendly summaries for administrators
- Consistent scoring for prioritization

---

## ✅ Why Azure OpenAI

- Enables semantic understanding of flow logic
- Goes beyond rule-based validation
- Provides explainable insights for governance decisions

---

## ⚙️ Implementation Details

- Azure OpenAI is invoked from the Power Automate flow `snl_fl_Intelligence_AnalyzeFlows`
- The flow passes the DefinitionJSON as input to the AI model
- A structured prompt is used to ensure consistent output format
- The response is parsed and stored in SharePoint (Sentinel Results)

---

## 🧩 Design Approach

- AI analysis is separated from data collection for scalability
- Structured output ensures compatibility with query and reporting flows
- Results are cached in SharePoint to avoid repeated AI calls
