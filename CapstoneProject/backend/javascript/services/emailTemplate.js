const emailTemplate = (name, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                background-color: #F4F4F4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #FFFFFF;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #2C3E50;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                color: #FFFFFF;
                font-size: 24px;
            }
            .body {
                padding: 30px;
                color: #333333;
            }
            .body h2 {
                font-size: 20px;
                margin-bottom: 15px;
                color: #2C3E50;
            }
            .body p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 15px;
                color: #555555;
            }
            .message-box {
                background-color: #F9F9F9;
                border-left: 4px solid #2C3E50;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #2C3E50;
                color: #FFFFFF !important;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                margin: 20px 0;
            }
            .footer {
                background-color: #F4F4F4;
                padding: 20px;
                text-align: center;
                color: #999999;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>:earth_africa: Adventure API</h1>
            </div>
            <div class="body">
                <h2>Hello, ${name}!</h2>
                <p>Thank you for getting in touch with us. We've received your message and will get back to you shortly.</p>
                <div class="message-box">
                    <p><strong>Your message:</strong></p>
                    <p>${message}</p>
                </div>
                <p>In the meantime, feel free to explore our adventures!</p>
                <a href="http://localhost:3000" class="button">View Adventures</a>
            </div>
            <div class="footer">
                <p>© 2026 Adventure API. All rights reserved.</p>
                <p>If you did not request this email, please ignore it.</p>
            </div>
        </div>
    </body>
    </html>
    `
}

module.exports = { emailTemplate }