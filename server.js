const express = require("express");
const app = express();
const mongoose = require("mongoose");
const amqplib = require("amqplib");
var nodemailer = require("nodemailer");

const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("email me running");
});

mongoose
  .connect(
    "mongodb+srv://miguelmarcoramcharan:miguelmarcoramcharan@marcoramcharan.ji59fop.mongodb.net/sayhi?retryWrites=true&w=majority&appName=MARCORAMCHARAN"
  )
  .then(() => {
    console.log("connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

var transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: "jobfinder1956@outlook.com",
    pass: "Marco@outlook1999",
  },
});

const PORT = process.env.PORT || 5001;

// rabbitmq to be global variables
let channel, connection;

connect();

async function connect() {
  try {
    const amqpServer =
      "amqps://gcojgcij:vn1d4yTk3KJTMVa__Szb2-ak0bEyihTI@woodpecker.rmq.cloudamqp.com/gcojgcij";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();
    console.log("connected")

    // consume all the orders that are not acknowledged
    await channel.consume("orders", (data) => {
      console.log(`Received ${Buffer.from(data.content)}`);
      let code = JSON.parse(`${Buffer.from(data.content)}`).code;
      let email = JSON.parse(`${Buffer.from(data.content)}`).email;
      let token = JSON.parse(`${Buffer.from(data.content)}`).token;
      let body = JSON.parse(`${Buffer.from(data.content)}`).body;
      let name = JSON.parse(`${Buffer.from(data.content)}`).name;
      let recipient = JSON.parse(`${Buffer.from(data.content)}`).recipient;
      let con = JSON.parse(`${Buffer.from(data.content)}`).reply_email_content

      if (code == 1) {
        sendWelcome(email);
      }
      if (code == 2) {
        sendGoodbye(email);
      }
      if (code == 3) {
        sendResetPasswordLink(email, token);
      }
      if (code == 4) {
        sendPasswordChangeInform(email);
      }
      if (code == 5) {
        sendResetPasswordLessLoginCode(email, token);
      }
      if (code == 6) {
        sendTwoFactorAuthCode(email, token);
      }
      if (code == 7) {
        sendReply(email, con);
      }
      if (code == 8) {
        sendEmail(email, body, name, recipient);
      }
      channel.ack(data);
    });
  } catch (error) {
    console.log(error);
  }
}

let logSomeShit = () => {
  console.log("someshit");
};

let sendEmail = async (email, body, name, recipient) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: recipient, // list of receivers (who receives)
      subject: "files", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `
            
<div>
<p>you have new mail</h1>
<p>${email}</p>
<p>${body}</p>
<p>${name}</p>


</div>             `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent: " + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendWelcome = async (email) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "files", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<p>welcome to contactme</h1> `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent: " + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendGoodbye = async (email) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "files", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<p>so sorry to see you leave</h1> `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent to " + email + ":" + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendResetPasswordLink = async (email, token) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "files", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<div>
          <h1>reset password email</h1>
          <p>please follow this link to reset your password</p>
          <p>this token is valid for 24 hours and cant be used after</p>
          <a href='http://localhost:5173/forgotpassword/change?token=${token}'>click here to reset your password</a>
          </div> 
          `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent to " + email + ":" + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendPasswordChangeInform = async (email) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "files", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<p>your password has been changes</h1> `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent to " + email + ":" + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendResetPasswordLessLoginCode = async (email, token) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "passwordless login code", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<div>
          <h1>passwordless login email</h1>
          <p>enter this code to login</p>
          <p>this token is valid for 24 hours and can only be used once</p>
          <h1>${token}</h1>
          </div> 
          `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent to " + email + ":" + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendTwoFactorAuthCode = async (email, token) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "two afctor code", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<div>
          <p>enter this code to complete login</p>
          <p>this token is valid for 24 hours and can only be used once</p>
          <h1>${token}</h1>
          </div> 
          `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent to " + email + ":" + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

let sendReply = async (email,con) => {
  try {
    var mailOptions = {
      from: '"jobfinder " <jobfinder1956@outlook.com>', // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "files", // Subject line
      /*text: 'Hello world ', // plaintext body*/
      html: `<p>hey i will conact you back ${con}</p> `, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return;
        console.log(error);
      }
      console.log("Message sent: " + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log("server running");
});
