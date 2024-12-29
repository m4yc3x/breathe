interface BaseEmailTemplateProps {
  title: string
  content: string
}

export function baseEmailTemplate({ title, content }: BaseEmailTemplateProps) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Reset styles */
    body, table, td {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
    }
    
    /* Container styles */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    
    /* Button styles */
    .btn {
      margin: 30px 0;
    }
    .btn table {
      width: auto;
    }
    .btn table td {
      border-radius: 4px;
      text-align: center;
    }
    .btn a {
      display: inline-block;
      padding: 12px 24px;
      background-color: #0070f3;
      border-radius: 4px;
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
    }
    
    /* Content styles */
    h1 {
      color: #000;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 20px;
    }
    p {
      margin: 0 0 15px;
    }
    .url-display {
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      word-break: break-all;
    }
    .note {
      color: #666;
      font-size: 14px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
  `.trim()
} 