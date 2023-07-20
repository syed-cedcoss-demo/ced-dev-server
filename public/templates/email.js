export const signup = (data) => {
  return `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      background-color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Inter", sans-serif;
      color: #344054;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 1px;
    }
  </style>
  <body>
    <div
      style="
        max-width: 768px;
        max-height: 880px;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
      "
    >
      <h1>Complete Server Setup by Syed</h1>
      <p>Hi ${data?.name},</p>
      <p>This is your verification code:</p>
      <div style="padding: 30px 0px">
        <span
          style="
            color: #7f56d9;
            border: solid #7f56d9 3px;
            font-weight: 500;
            font-size: 48px;
            border-radius: 8px;
            padding: 4px 16px;
            margin-right: 5px;
          "
          >${data?.otp?.charAt(0)}</span
        >
        <span
          style="
            color: #7f56d9;
            border: solid #7f56d9 3px;
            font-weight: 500;
            font-size: 48px;
            border-radius: 8px;
            padding: 4px 16px;
            margin-right: 5px;
          "
          >${data?.otp?.charAt(1)}</span
        >
        <span
          style="
            color: #7f56d9;
            border: solid #7f56d9 3px;
            font-weight: 500;
            font-size: 48px;
            border-radius: 8px;
            padding: 4px 16px;
            margin-right: 5px;
          "
          >${data?.otp?.charAt(2)}</span
        >
        <span
          style="
            color: #7f56d9;
            border: solid #7f56d9 3px;
            font-weight: 500;
            font-size: 48px;
            border-radius: 8px;
            padding: 4px 16px;
            margin-right: 5px;
          "
          >${data?.otp?.charAt(3)}</span
        >
      </div>
      <p style="max-width: 640px; font-style: normal; margin-bottom: 30px">
        This code will only be valid for the next 1 hour, If the code does not work, You
        con use below login verification link:
      </p>
      <a
        href=${data?.url}
        style="
          background-color: #7f56d9;
          color: #ffffff;
          font-weight: 600;
          padding: 10px 18px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 18px;
        "
        >Verify email</a
      >
      <p style="margin-top: 40px">
        Thanks <br />
        <strong>DEV: Syed Hasnain Mehadi</strong>
      </p>
      <p style="font-size: 12px">
        This mail sent from SYED's demo email server
      </p>
    </div>
  </body>
</html>

      `;
};

export const forget = (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      background-color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Inter", sans-serif;
      color: #5a6270;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 1px;
    }
  </style>
  <body>
    <div
      style="
        max-width: 768px;
        max-height: 880px;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
      "
    >
      <h1>Complete Server Setup by Syed</h1>
      <p>Hey <strong>${data?.email}</strong>,</p>
      <p style="max-width: 640px; font-style: normal; margin-bottom: 30px">
        Use blow button to reset your password
      </p>
      <a
        href="${data?.url}"
        style="
          background-color: #7f56d9;
          color: #ffffff;
          font-weight: 600;
          padding: 10px 18px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 18px;
        "
        onMouseOver="this.style.backgroundColor='#9f88d1'"
        onMouseOut="this.style.backgroundColor='#7f56d9'"
        >Click Here</a
      >
      <p style="margin-top: 40px; font-weight: bold">CedCommerce Pro Dev</p>
    </div>
  </body>
</html>
`;
};

export const logEmailTemp = (data) => {
  return `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Templates</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      background-color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Inter", sans-serif;
      color: #5a6270;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 1px;
    }
  </style>
  <body>
    <div
      style="
        max-width: 768px;
        max-height: 880px;
        background-color: #ffffff;
        padding: 10px;
        border-radius: 8px;
      "
    >
      <h2 style="color: #7f56d9; line-height: 30px">
        Zoho Inventory Integration by CedCommerce
      </h2>

      <p>Hey <strong>Syed</strong>,</p>
      <p style="max-width: 640px; font-style: normal; margin-bottom: 30px">
        We’re glad to have you onboard! You’re already on your way to creating beautiful visual
        products.
      </p>
      <br />

      <table
        style="
          border-collapse: collapse;
          font-size: 0.9em;
          font-family: sans-serif;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        "
      >
        <thead>
          <tr style="background-color: #7f56d9; color: #ffffff; text-align: left">
            <th style="padding: 12px 15px">#</th>
            <th style="padding: 12px 15px">Description</th>
          </tr>
        </thead>
        <tbody>
          ${data}
        </tbody>
      </table>
      <br />

      <p style="margin-top: 40px">
        Thanks, <br />
        The team <br />
        <strong>Team Zoho Inventory Integration</strong>
      </p>

      <p style="font-size: 12px">
        This mail sent to cedcommerce.com, if your don't want this type of email you can
        unsubscribe or manage email preference
      </p>
    </div>
  </body>
</html>

      `;
};
export const adsMailTemplate = (data) => {
  return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html
      data-editor-version="2"
      class="sg-campaigns"
      xmlns="http://www.w3.org/1999/xhtml"
    >
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap"
          rel="stylesheet"
        />
        <style>
          body {
            font-family: "Poppins", sans-serif;
            background-color: #f7f7f7;
            padding: 0px;
            margin: 0px;
          }
          table tr td {
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <table
          style="
            margin: 0px auto;
            width: 100%;
            max-width: 600px;
            padding-bottom: 50px;
            padding: 20px 25px;
            color: #333;
            background-color: #fff;
            border-radius: 5px;
            line-height: 1.8;
          "
        >
          <tr>
            <td
              style="
                text-align: center;
                border-bottom: 1px dashed #5d616d;
                padding-bottom: 10px;
              "
            >
              <h1
                style="color: #64d71f; cursor: pointer; font-weight: 600; margin: 0"
              >
                ZOHO &nbsp;<span style="color: #333">Integration</span>
              </h1>
            </td>
          </tr>
    
          <tr>
            <td style="padding-top: 50px">Hey <b> ${data?.name} </b></td>
          </tr>
          <tr>
            <td style="padding-top: 10px; text-align: justify">
              In order to verify your account you have to verify its you, use below
              button to verify the account.
            </td>
          </tr>
    
          <tr>
            <td style="text-align: center; padding-top: 20px">
              <a
                style="
                  margin-top: 10px;
                  cursor: pointer;
                  border: 1px solid #64d71f;
                  padding: 6px 24px;
                  background: #64d71f;
                  border-radius: 5px;
                  color: #fff;
                  font-size: 18px;
                  max-width: 166px;
                  text-align: center;
                  width: 100%;
                  text-decoration: none;
                "
                href=${data?.url}
                >Verify Account</a
              >
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px"> <b> Cedcommerce dev team </b></td>
          </tr>
           <tr>
            <td style="padding-top: 10px; text-align: justify">
              copyright &copy;  ${new Date().getFullYear()}-${
    new Date().getFullYear() + 1
  }, All rights reserved
            </td>
          </tr>
        </table>
      </body>
    </html>
      `;
};
