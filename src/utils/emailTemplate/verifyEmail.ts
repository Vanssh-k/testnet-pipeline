export const VerifyMailTemplate = (url: string) => `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
        <tr>
            <td align="center">
                <!-- Header -->
                <table width="600" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td bgcolor="#4452fe" style="padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
                            Lighthouse Storage
                        </td>
                    </tr>
                </table>
                <!-- Body -->
                <table width="600" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <h1>Welcome!</h1>
                            <img src="path_to_your_image.jpg" alt="Welcome Image" width="200" style="margin-bottom: 20px;">
                            <p>We're excited to have you get started! First you need to confirm your account. Just click the button below.</p>
                            <!-- Button -->
                            <table border="0" cellspacing="0" cellpadding="0" style="margin: auto;">
                                <tr>
                                    <td align="center" style="background-color: #0000FF; margin: 20px; padding: 10px;">
                                        <a href="${url}" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 16px;">Confirm Your Account</a>
                                    </td>
                                </tr>
                            </table>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </td>
                    </tr>
                </table>
                <!-- Footer -->
                <table width="600" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 20px; text-align: center; font-size: 14px;">
                            If you have any questions, Please feel free to inform - We're always ready to help out.
                            <br><br>
                            Cheers,
                            <br>
                            The Team Name.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
