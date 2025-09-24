// generate-n8n-workflow.js
const fs = require("fs");

// n8n workflow JSON structure
const workflow = {
  name: "Client Reporting Data Aggregation",
  active: false,
  nodes: [
    {
      id: "1",
      name: "Cron Trigger",
      type: "n8n-nodes-base.cron",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        triggerTimes: [
          {
            mode: "everyWeek",
            weekday: "monday",
            hour: 8,
          },
        ],
      },
    },
    {
      id: "2",
      name: "Salesforce Fetch",
      type: "n8n-nodes-base.salesforce",
      typeVersion: 1,
      position: [500, 200],
      parameters: {
        operation: "getAll",
        resource: "record",
        soql: "SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE CloseDate = LAST_WEEK",
      },
      credentials: {
        salesforceOAuth2Api: {
          id: "your-salesforce-cred-id",
          name: "Salesforce Account",
        },
      },
    },
    {
      id: "3",
      name: "Google Analytics Fetch",
      type: "n8n-nodes-base.googleAnalytics",
      typeVersion: 1,
      position: [500, 400],
      parameters: {
        viewId: "your-view-id",
        metrics: "sessions,conversions,ctr",
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      },
      credentials: {
        googleAnalyticsOAuth2Api: {
          id: "your-ga-cred-id",
          name: "GA Account",
        },
      },
    },
    {
      id: "4",
      name: "Merge Data",
      type: "n8n-nodes-base.merge",
      typeVersion: 1,
      position: [750, 300],
      parameters: {
        mode: "mergeByIndex",
      },
    },
    {
      id: "5",
      name: "Generate Report",
      type: "n8n-nodes-base.spreadsheetFile",
      typeVersion: 1,
      position: [1000, 300],
      parameters: {
        operation: "write",
        options: {
          format: "xlsx",
        },
      },
    },
    {
      id: "6",
      name: "Send Email",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 1,
      position: [1250, 300],
      parameters: {
        toEmail: "client@example.com",
        subject: "Weekly Performance Report",
        options: {
          attachments: "data",
        },
      },
    },
    {
      id: "7",
      name: "KPI Check",
      type: "n8n-nodes-base.if",
      typeVersion: 1,
      position: [1000, 500],
      parameters: {
        conditions: {
          number: [
            {
              value1: "={{$json[\"ctr\"]}}",
              operation: "smaller",
              value2: 2,
            },
          ],
        },
      },
    },
    {
      id: "8",
      name: "Slack Alert",
      type: "n8n-nodes-base.slack",
      typeVersion: 1,
      position: [1250, 500],
      parameters: {
        channel: "#campaign-alerts",
        text: "⚠️ Campaign CTR dropped below 2%",
      },
      credentials: {
        slackApi: {
          id: "your-slack-cred-id",
          name: "Slack Account",
        },
      },
    },
  ],
  connections: {
    "Cron Trigger": {
      main: [[{ node: "Salesforce Fetch", type: "main", index: 0 }]],
    },
    "Salesforce Fetch": {
      main: [[{ node: "Merge Data", type: "main", index: 0 }]],
    },
    "Google Analytics Fetch": {
      main: [[{ node: "Merge Data", type: "main", index: 1 }]],
    },
    "Merge Data": {
      main: [
        [
          { node: "Generate Report", type: "main", index: 0 },
          { node: "KPI Check", type: "main", index: 0 },
        ],
      ],
    },
    "Generate Report": {
      main: [[{ node: "Send Email", type: "main", index: 0 }]],
    },
    "KPI Check": {
      main: [[{ node: "Slack Alert", type: "main", index: 0 }]],
    },
  },
};

// Write JSON file
fs.writeFileSync("reporting-workflow.json", JSON.stringify(workflow, null, 2));

console.log("✅ Workflow JSON generated: reporting-workflow.json");
