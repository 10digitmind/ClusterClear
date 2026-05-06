const welcome = (name,dashboardUrl,year) =>`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Welcome to ClusterClear</title>
</head>

<body style="margin:0;padding:0;background:#f7f7f9;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f7f7f9;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e6e6e6;overflow:hidden;max-width:600px;">

<!-- Header -->
<tr>
  <td align="center" width="100%" bgcolor="white" style="padding:24px;border-bottom:1px solid #f1f1f1;background:#ffffff;">
    
    <a href="https://www.clusterclear.app" style="text-decoration:none;">
      <span style="
        font-size:24px;
        font-weight:700;
        color:#6355FF;
        font-family:Arial, Helvetica, sans-serif;
        letter-spacing:0.5px;
      ">
        ClusterClear
      </span>
    </a>

  </td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px 36px;color:#222222;font-size:15px;line-height:1.6;">

<p style="margin:0 0 18px 0;">Hello ${name},</p>

<p style="margin:0 0 18px 0;">
Welcome to <strong>ClusterClear</strong>! We're thrilled to have you join our creator community.
</p>

<p style="margin:0 0 26px 0;">
Your next step is to <strong>set your Priority Fee</strong> and generate your unique link. This will allow fans to send you priority messages and start earning from your content.
</p>

<!-- Button -->
<table role="presentation" align="center" cellpadding="0" cellspacing="0">
<tr>
<td align="center" bgcolor="#6355FF" style="border-radius:6px;">
<a href="${dashboardUrl}"
style="
display:inline-block;
padding:14px 34px;
font-size:15px;
font-weight:600;
color:#ffffff;
text-decoration:none;
border-radius:6px;
line-height:20px;
">
Set Your Priority Fee
</a>
</td>
</tr>
</table>

<!-- Fallback Link -->
<p style="margin:32px 0 10px 0;color:#555555;">
If the button doesn't work, copy and paste this link into your browser:
</p>

<p style="margin:0 0 20px 0;word-break:break-word;">
<a href="${dashboardUrl}" style="color:#6355FF;text-decoration:underline;">
${dashboardUrl}
</a>
</p>

<p style="margin:0;color:#777777;font-size:14px;">
Once your link is ready, you can pin it on your bio and start receiving priority messages immediately!
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:22px;background:#6355FF;color:#ffffff;font-size:12px;">
© ${year} ClusterClear. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>

`
module.exports = welcome