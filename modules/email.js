exports.sendAppEmail = function(to, subject, text, html){
  nodeMailer = require('nodemailer');

  var transporterInput = {
    host: 'mail.hover.com',
    port: 465,
    auth: {
      user: "app@veganhomies.com",
      pass: process.env.VH_APP_EMAIL_PASS
    }
  };

  var transporter = nodeMailer.createTransport( transporterInput );

  var mailOptions = {
      from: '"Vegan Homies" <app@veganhomies.com>',
      to: to,
      subject: subject,
      text: text,
      html: html
  };

  console.log("mailOptions =\n%s", mailOptions);

  transporter.sendMail(mailOptions, function(err, info){
    if(err){
      console.error("Unable to send email");
      console.error(err);
    } else {
      console.log("Email successfully sent");
      console.log(info);
    }
  });

};
