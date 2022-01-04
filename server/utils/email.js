const sgMail = require('@sendgrid/mail')
const dotenv=require('dotenv')

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.sendMail=async (msg)=>{
  let confrm=
  await sgMail
    .send(msg)
    .then((response) => {
      
        return true
      
    })
    .catch((error) => {
      console.log(error.response.body.errors)
      return false
    })
    if(confrm)
      return true
    else
      return false
}