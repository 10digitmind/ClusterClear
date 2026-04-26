const resetEmailPassword = (name, resetUrl, year) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background:#f7f7f9;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f7f7f9;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e6e6e6;overflow:hidden;max-width:600px;">

<!-- HEADER -->
<tr>
<td align="center" style="padding:24px;border-bottom:1px solid #f1f1f1;background:#ffffff;">
  <a href="https://www.clusterclear.app" style="text-decoration:none;">
    <img 
      src="https://i.postimg.cc/J4zBvpSN/newcluster.png"
      alt="ClusterClear"
      width="180"
      style="display:block;border:0;outline:none;text-decoration:none;margin:auto;">
  </a>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:40px 36px;color:#222;font-size:15px;line-height:1.6;">

<p style="margin:0 0 18px 0;">Hello ${name},</p>

<p style="margin:0 0 18px 0;">
We received a request to reset your ClusterClear password.
</p>

<p style="margin:0 0 26px 0;">
Click the button below to set a new password. This link will expire in 24 hours.
</p>

<!-- BUTTON -->
<table role="presentation" align="center">
<tr>
<td align="center" bgcolor="#6355FF" style="border-radius:6px;">
  <a href="${resetUrl}" 
     style="display:inline-block;
            padding:14px 34px;
            font-size:15px;
            font-weight:600;
            color:#fff;
            text-decoration:none;
            border-radius:6px;">
    Reset Password
  </a>
</td>
</tr>
</table>

<!-- FALLBACK -->
<p style="margin:32px 0 10px;color:#555;">
If the button doesn’t work, copy and paste this link:
</p>

<p style="word-break:break-word;">
<a href="${resetUrl}" style="color:#6355FF;text-decoration:underline;">
  ${resetUrl}
</a>
</p>

<p style="margin-top:20px;color:#777;font-size:14px;">
If you didn’t request this, you can safely ignore this email.
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:22px;background:#6355FF;color:#fff;font-size:12px;">
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

module.exports = resetEmailPassword