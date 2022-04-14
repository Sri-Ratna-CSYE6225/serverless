var aws = require("aws-sdk");

var ses = new aws.SES({
    region: "us-east-1"
});
var DynamoDB = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    let message = JSON.parse(event.Records[0].Sns.Message);

    console.log(JSON.stringify(message));

    let verifyMsg = message.verify;
    console.log('verify email', verifyMsg)

    if (!verifyMsg) {
        console.log('inside verify check')
        sendEmail(message);
    }

};

var sendEmail = (data) => {

    let link = `http://${data.domainName}/v1/verifyUserEmail?email=${data.username}&token=${data.token}`;

    let body = "Hi " + data.first_name + ",\n\n" +
    "We just need to verify your email address before you can access our portal. Verify your email address here: " + link + "\n\n\n" +
    "Kind Regards, Sri Ratna" + "\n\n\n" 
    let from = "no-reply@" + data.domainName
    let emailParams = {
        Destination: {
            ToAddresses: [data.username],
        },
        Message: {
            Body: {
                Text: {
                    Data: body
                },
            },
            Subject: {
                Data: "Verify your mail address"
            },
        },
        Source: from,
    };

    let sendEmailPromise = ses.sendEmail(emailParams).promise()
    sendEmailPromise
        .then(function (result) {
            console.log(result);
        })
        .catch(function (err) {
            console.error(err, err.stack);
        });
}