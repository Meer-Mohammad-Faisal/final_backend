const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Email Verification</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .support{
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
            
            .highlight {
                font-weight: bold;
            }
            </style>
    </head>
    
    <body>
        <div class="container">
            <a href="https://studynotion-edtech-project.vercel.app"><img class="logo"
                    src="https://i.ibb.co/7Xyj3pc/logo.png" alt="studyNotion Logo"></a>
            <div class="message">OTP Email Verification</div>
            <div class="body">
                <p>Hey there,</p>
                <p>Thank you for registering with StudyNotion. To complete your registraion, please use the following
                (one-Time Password) to verify your account:</p>
                <h2 class="highlight">${otp}</h2>
                <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this
                Once your account is verified, you will have access to our platform and its feature.</p>
            </div>
               <div class="support">If you have any questions or need assistance, feel free to reach out to our support team
               <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help you!</div>
        </div>
        </body>
        </html>`;
}
module.exports = otpTemplate;