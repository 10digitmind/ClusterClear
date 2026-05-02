const paymentConfirmationToBuyer = (
  buyerName,
  creatorName,
  verifyUrl,
  year
) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Priority Message Sent</title>
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

<p style="margin:0 0 18px 0;">Hello ${buyerName || "there"},</p>

<p style="margin:0 0 18px 0;">
Your <b>Priority Message</b> has been successfully sent to <b>@${creatorName}</b>.
</p>

<!-- SUCCESS BOX -->
<div style="background:#ecfdf5;border:1px solid #bbf7d0;padding:14px;border-radius:8px;margin:20px 0;">
  <p style="margin:0;font-size:14px;color:#15803d;">
    ✓ Payment received and your message has been delivered.
  </p>
</div>

<p style="margin:0 0 18px 0;">
You’ll be notified when the creator replies.
</p>

<p style="margin:0 0 24px 0;">
Create or verify your account to track messages, receive replies faster, and manage future conversations.
</p>

<!-- CTA -->
<table role="presentation" align="center">
<tr>
<td align="center" bgcolor="#6355FF" style="border-radius:6px;">
  <a href="${verifyUrl}"
     style="display:inline-block;
            padding:14px 34px;
            font-size:15px;
            font-weight:600;
            color:#fff;
            text-decoration:none;
            border-radius:6px;">
    Verify Email & View Inbox
  </a>
</td>
</tr>
</table>

<!-- SECONDARY INFO -->
<p style="margin:28px 0 10px;color:#555;">
Why verify your email?
</p>

<ul style="padding-left:18px;margin:0;color:#555;font-size:14px;line-height:1.8;">
  <li>Track all messages in one dashboard</li>
  <li>Get notified when creators reply</li>
  <li>Recover your message history anytime</li>
</ul>

<p style="margin-top:24px;color:#777;font-size:13px;">
If you didn’t make this payment, please contact support immediately.
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

module.exports = paymentConfirmationToBuyer;