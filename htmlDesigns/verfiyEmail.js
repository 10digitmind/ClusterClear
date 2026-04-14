const verifyEmail = (name, verificationUrl, year) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background:#f7f7f9;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f7f7f9;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e6e6e6;overflow:hidden;max-width:600px;">

<!-- Header -->
<tr>
<td align="center" bgcolor="#ffffff" style="padding:24px;border-bottom:1px solid #f1f1f1;">

<a href="https://www.clusterclear.app" style="text-decoration:none;">
<img 
src="https://i.postimg.cc/J4zBvpSN/newcluster.png"
alt="ClusterClear"
width="200"
style="display:block;border:0;outline:none;text-decoration:none;margin:auto;">
</a>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px 36px;color:#222;font-size:15px;line-height:1.6;">

<p style="margin:0 0 18px 0;">Hello ${name},</p>

<p style="margin:0 0 18px 0;">
Welcome to <strong>ClusterClear</strong>. We're excited to have you on board.
</p>

<p style="margin:0 0 26px 0;">
Please verify your email to activate your account.
</p>

<!-- Button -->
<table role="presentation" align="center" cellpadding="0" cellspacing="0">
<tr>
<td align="center" bgcolor="#6355FF" style="border-radius:6px;">
<a href="${verificationUrl}"
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
Verify Email
</a>
</td>
</tr>
</table>

<!-- Fallback -->
<p style="margin:32px 0 10px 0;color:#555;">
If the button doesn't work, copy and paste this link:
</p>

<p style="margin:0 0 20px 0;word-break:break-word;">
<a href="${verificationUrl}" style="color:#6355FF;text-decoration:underline;">
${verificationUrl}
</a>
</p>

<p style="margin:0;color:#777;font-size:14px;">
This verification link expires in 24 hours.
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
`;

module.exports = verifyEmail;