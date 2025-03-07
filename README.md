# Mailgun MCP Server

**Connect with LLM directly and send custom emails to your users directly from your IDE or LLM's desktop apps**


## Build Project

```
pnpm run build
```

## Attach MCP server with IDE or desktop app

```
{
  "mcpServers": {
    "mailgun-mcp-server": {
      "command": "node",
      "args": [
        "ABSOLUTE/PATH/TO/PROJECT/mailgun-mcp/build/index.js"
      ]
    }
  }
}

```

### That's it !