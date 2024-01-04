export const VerifyMailTemplate = (url: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Verify your email address</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-color: #eeeeee;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      max-width="600px"
      style="border-collapse: collapse; background-color: #0d0217"
    >
      <tr>
        <td style="padding: 20px 0 10px 0; background: #0d0217">
          <img
            src="https://drive.google.com/uc?export=download&id=1QzIqY44mqceYuBKC1bflzU1oQoqMuwj6"
            alt="Lighthouse Logo"
            height="30"
            style="display: block; margin: 0 auto"
          />
        </td>
      </tr>
      <tr>
        <td align="center">
          <div
            style="
              max-width: 600px;
            "
          >
            <p
              align="center"
              style="
                font-size: 16px;
                line-height: 24px;
                color: #DDD;
                padding: 20px;
                max-width: 25rem;
              "
            >
                Please click the button below to verify your email address.
            </p>

            <a
              href="${url}"
              target="_blank"
              style="
                font-size: 18px;
                font-weight: bold;
                color: #ffffff;
                text-decoration: none;
                background-color: #1a82e2;
                padding: 15px 25px;
                border-radius: 4px;
                display: inline-block;
              "
              >Verify email address</a
            >

            <p
              align="center"
              style="
                font-size: 16px;
                line-height: 24px;
                color: #DDD;
                padding: 20px;
                max-width: 25rem;
              "
            >
                The verification link will be expired in an hour. If you have any questions, do reach out to us on Discord – we're always happy to help you out.
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td
          bgcolor="#0D0217"
          style="
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-family: 'Arial', sans-serif;
          "
        >
          <p
            style="
              margin: 0;
              margin-bottom: 5px;
              font-size: 18px;
              font-weight: bold;
              padding: 8px 0px;
            "
          >
            Get in touch
          </p>
          <p style="margin: 0; color: white; fill: white; display: flex; justify-content: center;">
            <a href="https://t.me/LighthouseStorage" style="margin: 0 10px">
              <img
                src="https://drive.google.com/uc?export=download&id=1DcOAJnnLl0jVuLsDd_D9jdXSsSRMi4M3"
                width="24"
                height="24"
                style="display: block; margin: 0 auto"
              />
            </a>
            <a
              href="https://discord.com/invite/c4a4CGCdJG"
              style="margin: 0 10px"
            >
              <img
                src="https://drive.google.com/uc?export=download&id=14k7M1uujumwAuLshtzNvmAt0gielleIR"
                width="24"
                height="24"
                style="display: block; margin: 0 auto"
              />
            </a>
            <a href="https://twitter.com/lighthouseweb3" style="margin: 0 10px">
              <img
                src="https://drive.google.com/uc?export=download&id=1iCHPjGLWjnssHH_s_1QGT93h6eYslqjh"
                width="24"
                height="24"
                style="display: block; margin: 0 auto"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/lighthouse-web3/"
              style="margin: 0 10px"
            >
              <img
                src="https://drive.google.com/uc?export=download&id=1ieziz79_6XTHvO-G5fr3v4ei473YXoqP"
                width="24"
                height="24"
                style="display: block; margin: 0 auto"
              />
            </a>
            <a
              href="https://www.instagram.com/lighthouseweb3/"
              style="margin: 0 10px"
            >
              <img
                src="https://drive.google.com/uc?export=download&id=1F3T5NR0Yd9S24YgqA5M_Fun9MyuO6Lmh"
                width="24"
                height="24"
                style="display: block; margin: 0 auto"
              />
            </a>
          </p>
          <p style="margin: 0; font-size: 12px; margin: 20px 0">
            ©2023 All Rights Reserved | Lighthouse.Storage
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`
