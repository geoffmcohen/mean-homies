// Creates the email transporter needed to send app@veganhomies.com emails
getAppEmailTransporter = function(){
  nodeMailer = require('nodemailer');

  // Create the transporter to return
  var transporterInput = {
    host: 'mail.hover.com',
    port: 465,
    auth: {user: "app@veganhomies.com", pass: process.env.VH_APP_EMAIL_PASS}
  };
  return nodeMailer.createTransport( transporterInput );
}

// Sends a basic email from app@veganhomies.com
exports.sendAppEmail = function(to, subject, text, html){
  nodeMailer = require('nodemailer');

  // Set up the  email options
  var mailOptions = {
      from: '"Vegan Homies" <app@veganhomies.com>',
      to: to,
      subject: subject,
      text: text,
      html: html
  };

  // Send the email
  getAppEmailTransporter().sendMail(mailOptions, function(err, info){
    if(err){
      console.error("Unable to send email");
      console.error(err);
    } else {
      console.log("Email successfully sent");
    }
  });
};

// Sends a template email from app@veganhomies.com
exports.sendAppTemplateEmail = function(to, template, input, send = true, preview = false){
  var Email = require('email-templates');
  var transporter = getAppEmailTransporter();

  // Create the email using ejs template
  var email = new Email({
    message: {from: '"Vegan Homies" <app@veganhomies.com>'},
    send: send,
    preview: preview,
    transport: getAppEmailTransporter(),
    views: {
      options: {
        extension: 'ejs'
      }
    }
  });

  // Send the email
  email.send({
    template: require('util').format("../templates/%s", template),
    message: {to: to},
    locals: input
  }).then( res => {
    console.log("Succesfully sent '%s' email", template);
  }).catch(console.error);
}
