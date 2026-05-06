const priorityMessageAlertToCreator = (
  creatorName,
  buyerEmail,
  amountPaid,
  messagePreview,
  phoneNumber,
  subject,
  year
) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>New Priority Message</title>
</head>

<body style="margin:0;padding:0;background:#f7f7f9;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f7f7f9;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e6e6e6;overflow:hidden;max-width:600px;">

<!-- HEADER -->
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

<!-- BODY -->
<tr>
<td style="padding:40px 36px;color:#222;font-size:15px;line-height:1.6;">

<p style="margin:0 0 18px 0;">Hello ${creatorName},</p>

<p style="margin:0 0 18px 0;">
You’ve received a <b>Priority Message</b> from a buyer.
</p>

<!-- ALERT BOX -->
<div style="background:#f0f9ff;border:1px solid #bae6fd;padding:14px;border-radius:8px;margin:20px 0;">
  <p style="margin:0;font-size:14px;color:#0369a1;">
    ⚡ This message was prioritized with a payment of <b>₦${amountPaid}</b>
  </p>
</div>

<p style="margin:0 0 10px 0;"><b>From:</b> ${buyerEmail}</p>
<p style="margin:0 0 10px 0;">
  <b>Contact Number:</b> ${phoneNumber}
</p>
<p style="margin:0 0 10px 0;">
  <b>subject:</b> ${subject}
</p>

<p style="margin:0 0 18px 0;"><b>Message Preview:</b></p>

<div style="background:#f9fafb;border:1px solid #e5e7eb;padding:14px;border-radius:8px;color:#444;font-size:14px;">
  ${messagePreview}
</div>

<p style="margin:22px 0 10px 0;color:#555;">
Responding quickly improves your response rate and visibility.
</p>

<!-- CTA -->
<table role="presentation" align="center">
<tr>
<td align="center" bgcolor="#22c55e" style="border-radius:6px;">
  <a href="https://www.clusterclear.app/dashboard"
     style="display:inline-block;
            padding:14px 34px;
            font-size:15px;
            font-weight:600;
            color:#fff;
            text-decoration:none;
            border-radius:6px;">
    View Message
  </a>
</td>
</tr>
</table>

<p style="margin-top:26px;color:#777;font-size:13px;">
Priority messages are highlighted because the buyer paid for faster attention.
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

module.exports = priorityMessageAlertToCreator;