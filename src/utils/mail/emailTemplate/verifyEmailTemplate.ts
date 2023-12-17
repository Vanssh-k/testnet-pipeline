export const VerifyMailTemplate = (url: string) => `
    <!DOCTYPE html>
<!DOCTYPE html>
<html>

<head>
    <title>Verify your email address</title>
</head>

<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #EEEEEE;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
        style="border-collapse: collapse; background-color: #FFFFFF;">
        <tr>
            <td style="padding: 10px 0 10px 0;background: #0D0217;">
                <img src="https://files.lighthouse.storage/LighthouseLogo.svg" alt="Lighthouse Logo" width="200"
                    height="30" style="display: block;" />
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 40px; font-size: 36px; font-weight: bold; color: #262626;"></td>
        </tr>
        <tr>
        <tr>
            <td align="center" style="padding: 0 5rem; padding-bottom: 5rem;">
                <div style="border: 1px solid #B2B2B2; border-radius: 10px; padding: 0rem 2rem;">
                    <p align="center"
                        style="font-size: 20px; line-height: 24px; color: #666666; padding: 20px; max-width: 25rem;">
                        Please help us by verifying your email address. </p>

                    <a href="${url}" target="_blank"
                        style="font-size: 18px; font-weight: bold; color: #FFFFFF; text-decoration: none; background-color: #1a82e2; padding: 15px 25px; border-radius: 4px; display: inline-block;">Verify
                        email address</a>


                    <p align="center"
                        style="font-size: 16px; line-height: 24px; color: #666666; padding: 20px; max-width: 25rem;">
                        If you have any questions, just reply to this email – we're always happy to help you out.
                    </p>
                </div>
            </td>
        </tr>
        <tr>
            <td bgcolor="#0D0217"
                style="padding: 20px; text-align: center; color: #ffffff; font-family: 'Arial', sans-serif;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; padding: 8px 0;">Get in touch</p>
                <p style="margin: 0;color: white; fill:white">
                    <a href="https://t.me/LighthouseStorage" style="margin: 0 10px;">
                        <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 448 512" height="24px"
                            width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z">
                            </path>
                        </svg>
                    </a>
                    <a href="https://discord.com/invite/c4a4CGCdJG" style="margin: 0 10px;">
                        <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 640 512" height="24px"
                            width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z">
                            </path>
                        </svg></a>
                    <a href="https://twitter.com/lighthouseweb3" style="margin: 0 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1001 937"
                            fill="none" height="24px" width="24px">
                            <path
                                d="M2.44 0L388.83 516.64L0 936.69H87.51L427.93 568.93L702.98 936.69H1000.78L592.65 390.99L954.57 0H867.06L553.55 338.7L300.24 0H2.44ZM131.13 64.46H267.94L872.07 872.22H735.26L131.13 64.46Z"
                                fill="white" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/company/lighthouse-web3/" style="margin: 0 10px;">
                        <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 448 512" height="24px"
                            width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                            </path>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/lighthouseweb3/" style="margin: 0 10px;"><svg stroke="white"
                            fill="white" stroke-width="0" viewBox="0 0 448 512" height="24px" width="24px"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                            </path>
                        </svg></a>
                </p>
                <p style="margin: 0; font-size: 12px; margin: 20px 0;">©2023 All Rights Reserved | Lighthouse.Storage
                </p>
            </td>
        </tr>
    </table>
</body>

</html>
`
