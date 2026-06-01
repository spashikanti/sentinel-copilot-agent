# SharePoint Data Model

Sentinel uses SharePoint as the primary storage layer for governance data.  
It leverages **two lists** to separate flow discovery and analysis.

---

## 📂 1. Sentinel Flows (Source of Truth)

### Purpose
Stores raw metadata and definition details of Power Automate flows discovered in the environment.

### Columns

| Column Name            | Type                | Description |
|----------------------|---------------------|------------|
| FlowID              | Single line text    | Unique identifier of the flow |
| Title (Flow Name)            | Single line text    | Name of the flow |
| EnvironmentId       | Single line text    | Environment identifier |
| LastModifiedDateTime | Date and Time   | Last modified timestamp from source |
| DefinitionJSON      | Multiple lines text | Full flow definition (used for AI analysis) |
| AnalysisStatus      | Choice              | Status of analysis (Pending / Completed / Failed / Error) |
| LastAnalyzed        | Date and Time       | Timestamp of last AI analysis |
| IsActive            | Yes/No              | Indicates if flow is active |
| ErrorMessage         | Multiple lines text | Stores error details if analysis fails |
| SanitizedDefinition      | Multiple lines text | Full flow definition (used for AI analysis) |
| Modified             | Date and Time       | System column |
| Created              | Date and Time       | System column |
| Created By           | Person or Group     | System column |
| Modified By          | Person or Group     | System column |

---

## 📊 2. Sentinel Results (Analyzed Insights)

### Purpose
Stores AI-generated governance insights and risk analysis for each flow.

### Columns

| Column Name        | Type                 | Description |
|-------------------|----------------------|------------|
| FlowID           | Single line text     | Reference to original flow |
| Title (Flow Name)         | Single line text     | Name of the flow |
| RiskScore        | Number               | Calculated risk score (0–100) |
| RiskLevel        | Choice               | Risk category (Low, Medium, High, Critical) |
| GovernanceIssues | Multiple lines text  | Structured JSON of detected issues |
| IssueSummary     | Multiple lines text  | Human-readable summary of issues |
| LastAnalyzed     | Date and Time        | Last analysis timestamp |
| TrendDelta        | Number               | Tracks change in risk over time |
| DevOpsBugId     | Single line text     | Linked bug ID if already created |
| Modified          | Date and Time        | System column |
| Created           | Date and Time        | System column |
| Created By        | Person or Group      | System column |
| Modified By       | Person or Group      | System column |

---

## 🔄 Data Flow

1. **Collector Flow** (`snl_fl_Collector_DiscoverFlows`)
   - Discovers Power Automate flows from the environment
   - Stores metadata and Definition JSON in **Sentinel Flows**

2. **Intelligence Flow (Azure OpenAI)** (`snl_fl_Intelligence_AnalyzeFlows`)
   - Reads Definition JSON from **Sentinel Flows**
   - Uses Azure OpenAI to analyze governance risks
   - Generates structured insights (RiskScore, Issues, Summary)
   - Writes results into **Sentinel Results**

3. **Copilot Query Flow** (`snl_fl_Copilot_QueryFlows`)
   - Acts as the orchestration layer between Copilot and data
   - Processes user requests such as:
     - Show top risky flows
     - Explain a flow
     - Check bug status
   - Retrieves structured data from **Sentinel Results**
   - Formats and returns responses to the Copilot agent

4. **Sentinel Copilot Agent**
   - Receives natural language queries from users
   - Maps intent to appropriate topic
   - Calls **snl_fl_Copilot_QueryFlows**
   - Presents governance insights conversationally
---

## 🧠 Interaction Flow

User → Copilot Agent → Query Flow → SharePoint (Sentinel Results) → Response

- Copilot handles natural language understanding
- Query Flow handles data retrieval and business logic
- SharePoint stores structured governance data

---
## ✅ Design Rationale

- Separation of concerns:
  - **Sentinel Flows → Raw data**
  - **Sentinel Results → AI insights**
- Supports incremental analysis and reprocessing
- Enables trend tracking and governance audit history
