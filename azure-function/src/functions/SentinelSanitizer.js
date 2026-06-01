const { app } = require('@azure/functions');

/**
 * Sentinel Copilot Agent - AST Analysis Function
 * Performs structural validation of Power Automate flow definitions
 * Complements Azure OpenAI semantic analysis
 */
app.http('SentinelSanitizer', {
    methods: ['GET', 'POST'],
    authLevel: 'function',

    handler: async (req, context) => {
        context.log('Sentinel Recursive Sanitizer triggered');

        let rawDefinition;
        let connectorMap = {};
        let hasHardcodedUrls = false;
        let hasApiKeys = false;

        try {
            rawDefinition = await req.json();
        } catch (e) {
            return {
                status: 400,
                jsonBody: { error: "Invalid JSON body" }
            };
        }

        if (!rawDefinition || !rawDefinition.actions) {
            return {
                status: 400,
                jsonBody: { error: "Missing actions node" }
            };
        }

        // ✅ Core Output Containers
        let flattenedActions = [];
        let controlFlow = [];

        let metrics = {
            actionsCount: 0,
            httpActions: 0,
            loopsCount: 0,
            conditionsCount: 0,
            hasChildFlows: false
        };

        const normalizeConnector = (name) => {
            if (!name) return "Unknown";

            name = name.toLowerCase();

            if (name.includes("sharepoint")) return "SharePoint";
            if (name.includes("outlook")) return "Outlook";
            if (name.includes("sql")) return "SQL";
            if (name.includes("dataverse")) return "Dataverse";
            if (name.includes("http")) return "HTTP";

            return name;
        };

        // ✅ Recursive Engine
        function parseNode(name, node, parentScope = "root", path = "$.actions") {

            const currentPath = `${path}.${name}`;
            const type = node?.type || "Unknown";

            metrics.actionsCount++;

            // ✅ Category Classification
            let category = "Action";

            if (["If", "Switch"].includes(type)) {
                category = "Control";
                metrics.conditionsCount++;

                controlFlow.push({
                    type: type,
                    name: name,
                    path: currentPath,
                    parentScope: parentScope,
                    details: {
                        conditionType: type
                    }
                });
            }

            if (["Foreach", "Until"].includes(type)) {
                category = "Control";
                metrics.loopsCount++;

                let concurrency = node?.runtimeConfiguration?.concurrency?.repetitions || 1;

                controlFlow.push({
                    type: type,
                    name: name,
                    path: currentPath,
                    parentScope: parentScope,
                    details: {
                        loopConcurrency: concurrency
                    }
                });
            }

            // ✅ Scope only category, no metrics
            if (type === "Scope") {
                category = "Control";
            }

            // ✅ HTTP Detection
            const isHttp = type === "Http";
            if (isHttp) metrics.httpActions++;

            // ✅ Child Flow Detection
            if (type === "RunWorkflow") {
                metrics.hasChildFlows = true;
            }

            // ✅ SAFE endpoint masking
            let endpoint = null;
            let method = null;

            if (node.inputs) {
                method = node.inputs.method || null;

                if (node.inputs.uri) {
                    try {
                        const url = new URL(node.inputs.uri);
                        endpoint = `https://${url.hostname}/masked`;
                    } catch {
                        endpoint = "masked-invalid-url";
                    }
                }
            }

            // ✅ Connector Detection            
            let connectorName = "Unknown";

            if (type === "Http") {
                connectorName = normalizeConnector("HTTP");
            } else if (node.inputs?.host?.apiId) {
                const fullId = node.inputs.host.apiId;
                connectorName = fullId.split('/').pop().replace('shared_', '');
                connectorName = normalizeConnector(connectorName);
            }

            // Track usage
            if (connectorName !== "Unknown") {
                connectorMap[connectorName] = (connectorMap[connectorName] || 0) + 1;
            }

            // ✅ Governance checks
            if (node?.inputs?.uri && node.inputs.uri.startsWith('http')) {
                hasHardcodedUrls = true;
            }

            // ✅ Detect HARDCODED API keys ONLY (not expressions)
            if (node?.inputs?.uri) {
                const uri = node.inputs.uri;
                if (
                    (
                        uri.toLowerCase().includes("apikey") ||
                        uri.toLowerCase().includes("x-api-key") ||
                        uri.toLowerCase().includes("key=")
                    ) &&
                    !uri.includes("@{")
                ) {
                    hasApiKeys = true;
                }
            }

            // ✅ Append sanitized action
            flattenedActions.push({
                name: name,
                type: type,
                category: category,
                path: currentPath,
                parentScope: parentScope,
                runAfter: node.runAfter ? Object.keys(node.runAfter) : [],
                hasRetryPolicy: !!node?.runtimeConfiguration?.retryPolicy,
                hasAuthentication: !!node?.inputs?.authentication,
                isHttp: isHttp,
                endpoint: endpoint,
                method: method
            });

            // ✅ RECURSION: nested actions
            if (node.actions) {
                Object.keys(node.actions).forEach(child => {
                    parseNode(child, node.actions[child], name, `${currentPath}.actions`);
                });
            }

            // ✅ Handle ELSE block
            if (node.else && node.else.actions) {
                Object.keys(node.else.actions).forEach(child => {
                    parseNode(child, node.else.actions[child], `${name}_Else`, `${currentPath}.else.actions`);
                });
            }
        }

        // ✅ Start recursion from root
        Object.keys(rawDefinition.actions).forEach(name => {
            parseNode(name, rawDefinition.actions[name]);
        });

        // ✅ Convert connectors to array
        let connectors = Object.keys(connectorMap).map(name => ({
            name: name,
            usageCount: connectorMap[name]
        }));

        let riskLevel = "Low";

        if (hasApiKeys || metrics.httpActions > 2) {
            riskLevel = "High";
        } else if (hasHardcodedUrls) {
            riskLevel = "Medium";
        }
        
        let complexityScore =
            metrics.actionsCount +
            (metrics.loopsCount * 2) +
            (metrics.conditionsCount * 2) +
            (metrics.httpActions * 3);

        return {
            status: 200,
            jsonBody: {
                summary: metrics,
                actions: flattenedActions,
                controlFlow: controlFlow,
                connectors: connectors,
                governance: {
                    hasHardcodedUrls,
                    hasApiKeys,
                    hasDeprecatedConnectors: false,
                    riskLevel
                },
                complexityScore,
                analyzedOn: new Date().toISOString()
            }
        };
    }
});