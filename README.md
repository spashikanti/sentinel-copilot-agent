# Sentinel – AI-Powered Governance Agent for Power Platform

Sentinel is an intelligent governance assistant built using Copilot Studio, Power Automate, and Azure OpenAI. It enables organizations to automatically analyze, monitor, and interact with Power Automate flows through a conversational Copilot interface.

While the current implementation focuses on Power Automate flows, Sentinel is designed as a scalable governance platform for the entire Power Platform ecosystem, including Power Apps, Power Pages, and Dataverse.

---

## 🚨 Problem Statement

As organizations scale their Power Platform usage, governance becomes difficult due to:

- Lack of centralized visibility into flows
- Hardcoded secrets and insecure configurations
- Missing retry, error handling, and pagination controls
- Manual and reactive auditing processes
- No easy way to query governance insights

This results in **security risks, operational failures, and compliance gaps**.

---

## 💡 Solution Overview

Sentinel addresses these challenges by introducing an **AI-powered governance system** that:

- Automatically discovers Power Automate flows through the Power Automate Management API
- Uses Azure OpenAI to analyze risks and detect issues
- Stores structured insights in SharePoint
- Enables natural language interaction via Copilot

Users can simply ask:

"Show risky flows"
"Explain snl_fl_Test_BadFlow"
"Create bug for this flow"

And receive instant insights.

---

## 🧠 Key Features

### ✅ Autonomous Flow Discovery
- Collector flow runs on a schedule
- Captures metadata and Definition JSON of flows

### ✅ AI-Powered Risk Analysis
- Azure OpenAI analyzes flow definitions
- Detects:
  - Hardcoded secrets
  - Missing retry/error handling
  - Concurrency and throttling risks
  - Data exposure issues

### ✅ Structured Governance Data
- Results stored in SharePoint
- Includes:
  - Risk Score
  - Risk Level
  - Issue Summary
  - Governance Issues (JSON)

### ✅ Conversational Copilot Interface
- Built using Copilot Studio
- Enables:
  - Querying risky flows
  - Explaining flow issues
  - Checking bug status

### ✅ Extensible Architecture
- Designed for integration with:
  - Azure DevOps
  - Jira
  - ServiceNow

---

## 🏗️ Architecture Overview

![Architecture](./docs/Sentinel%20Copilot%20Agent%20-%20Architectural%20Diagram.png)

Sentinel follows a layered architecture:

- **User Interaction Layer** → Copilot Agent  
- **Query Layer** → Power Automate Query Flow  
- **Data Layer** → SharePoint Lists  
- **Processing Layer** → Collector & Intelligence Flows  
- **Service Layer** → Azure OpenAI & Power Platform APIs  

---

## 🔄 System Workflow

1. **Collector Flow (`snl_fl_Collector_DiscoverFlows`)**
   - Runs on a schedule (hourly)
   - Discovers flows and saves them in *Sentinel Flows*

2. **Intelligence Flow (`snl_fl_Intelligence_AnalyzeFlows`)**
   - Reads Definition JSON from *Sentinel Flows*
   - Uses Azure OpenAI to analyze governance risks
   - Stores results in *Sentinel Results*

3. **Copilot Query Flow (`snl_fl_Copilot_QueryFlows`)**
   - Handles user queries
   - Retrieves and formats results from *Sentinel Results*
   - Returns responses to Copilot

4. **Copilot Agent**
   - Enables natural language interaction
   - Routes user intent to flows

---

## 📊 Data Model

Sentinel uses two SharePoint lists:

### 1. Sentinel Flows
Stores:
- Flow metadata
- Definition JSON
- Analysis status

### 2. Sentinel Results
Stores:
- Risk score and level
- Issue summary
- Governance insights
- Bug tracking reference

👉 See full schema:
./docs/sharepoint-setup.md

---

## 🤖 AI Integration (Azure OpenAI)

Sentinel uses Azure OpenAI to:

- Analyze flow definitions semantically
- Identify complex governance risks
- Generate human-readable explanations
- Provide structured outputs for decision-making

Azure OpenAI configuration is managed using environment variables to ensure secure and flexible deployment across environments.

👉 Details:
./docs/ai/openai-usage.md

---

## 🎯 Use Case

### 👤 Target Users
- Power Platform Administrators
- Governance Teams
- Enterprise IT Teams

### ✅ Example Scenario

Instead of manually reviewing hundreds of flows, use the Sentinel Copilot Agent:

User: Show high risk flows

👉 Sentinel instantly returns the most critical flows.


User: Explain *snl_fl_Test_BadFlow* (flow name)

👉 Sentinel explains risks in simple language.


User: Create bug for *snl_fl_Test_BadFlow* (flow name)

👉 Sentinel checks if a bug exists and suggests next action.

---

## 🚀 Demo Instructions

Ask the Copilot Agent:

- `Show top risky flows`
- `Explain <flow_name>`
- `Create bug for <flow_name>`

---

## 🔧 Setup Instructions

1. Import solution:

/solution/Sentinel.zip

2. Create SharePoint lists:
- Sentinel Flows
- Sentinel Results

3. Configure environment variables

4. Deploy Copilot agent

5. Configure Azure OpenAI:
   - Create an Azure OpenAI resource
   - Deploy a model (e.g., GPT-4 / GPT-4o)
   - Update environment variables with:
     - Endpoint
     - API Key
     - Deployment Name
  
---

## 🔮 Future Enhancements

- ✅ DevOps integration (bug creation automation)
- ✅ Knowledge base + semantic search
- ✅ Predictive risk scoring
- ✅ Cross-platform governance (Power Apps, Dataverse)
- ✅ Multi-agent orchestration

---

## 🏁 Conclusion

Sentinel transforms governance from a **manual, reactive process** into an **intelligent, autonomous system** powered by AI and Copilot.

---

## 🎥 Demo Video

_Add your demo video link here (≤ 5 minutes)_

---

## 📦 Solution Package

Available in:

/solution/Sentinel.zip

---

## 🙌 Acknowledgements

Built using:

- Microsoft Copilot Studio
- Power Automate
- SharePoint
- Azure OpenAI
