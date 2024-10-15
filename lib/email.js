import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export async function sendVerificationEmail(email, verificationCode) {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Su código de verificación es: ${verificationCode}`,
        },
      },
      Subject: {
        Data: 'Verificación de cuenta RideSync',
      },
    },
    Source: 'noreply@ridesync.com',
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}