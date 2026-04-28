const emailTemplate = (name, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aussie Adventures</title>
    </head>
    <body style="margin:0;padding:20px;font-family:Arial,sans-serif;background-color:#050d1a;">

        <div style="max-width:600px;margin:0 auto;background-color:#0a1628;border-radius:12px;overflow:hidden;border:1px solid rgba(0,56,168,0.4);">

            <!-- Header -->
            <div style="background-color:#0a1628;padding:30px;text-align:center;border-bottom:3px solid #CC0000;">
                <h1 style="color:#ffffff;font-size:26px;margin:0 0 6px;">:kangaroo: Aussie Adventures</h1>
                <p style="color:#00b4d8;font-size:13px;margin:0;font-style:italic;">Affordable Adventures. Your Data Stays Yours.</p>
            </div>

            <!-- Australian flag stripe -->
            <div style="height:4px;background:linear-gradient(90deg,#00008B 33%,#CC0000 33%,#CC0000 66%,#FFFFFF 66%);"></div>

            <!-- Body -->
            <div style="padding:32px 30px;background-color:#0a1628;">
                <h2 style="font-size:22px;margin:0 0 16px;color:#ffffff;font-family:Georgia,serif;">
                    G'day, ${name}! :earth_asia:
                </h2>
                <p style="font-size:15px;line-height:1.7;margin:0 0 16px;color:#a0b4cc;">
                    Thank you for booking with Aussie Adventures. We've received your request and your adventure awaits!
                </p>

                <!-- Message box -->
                <div style="background-color:#0d2144;border-left:4px solid #0038A8;padding:16px;margin:20px 0;border-radius:4px;">
                    <p style="font-size:14px;color:#00b4d8;margin:0 0 8px;font-weight:bold;">Your message:</p>
                    <p style="font-size:15px;color:#ccd9e8;margin:0;line-height:1.6;">
    ${message || 'No adventures selected'}
</p>
                </div>

                <p style="font-size:15px;line-height:1.7;margin:0 0 20px;color:#a0b4cc;">
                    In the meantime, feel free to explore more incredible Australian adventures on our platform!
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:24px 0;">
                    <a href="https://github.com/ErsonAus/Capstone"
                       style="display:inline-block;padding:14px 36px;background-color:#CC0000;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;letter-spacing:0.03em;">
                        View Adventures
                    </a>
                </div>

                <!-- Privacy note -->
                <div style="background-color:#061830;border:1px solid rgba(0,56,168,0.3);border-radius:8px;padding:12px 16px;margin-top:24px;text-align:center;">
                    <p style="color:#556677;font-size:12px;margin:0;">
                        :lock: Your privacy is our priority. We never store or share your personal data.
                    </p>
                </div>
            </div>

            <!-- Australian flag stripe -->
            <div style="height:4px;background:linear-gradient(90deg,#00008B 33%,#CC0000 33%,#CC0000 66%,#FFFFFF 66%);"></div>

            <!-- Footer -->
            <div style="background-color:#050d1a;padding:20px;text-align:center;">
                <p style="color:#556677;font-size:12px;margin:0 0 4px;">© 2026 Aussie Adventures. All rights reserved.</p>
                <p style="color:#445566;font-size:11px;margin:0;">If you did not request this email, please ignore it.</p>
            </div>

        </div>
    </body>
    </html>
    `
}

module.exports = { emailTemplate }