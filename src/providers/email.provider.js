import transporter from '../config/email.config.js'

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER, // tên người gửi
            to,
            subject,
            text,
        })
        console.log('Email sent:', info.messageId)
        return info
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

export default sendEmail

// import transport from '../config/email.config.js'

// const sendEmail = async (emailOptions) => {
//     try {
//         const info = await transport.sendMail(emailOptions)
//         console.log('Email sent:', info.response)
//     } catch (error) {
//         console.error('Error sending email:', error)
//         throw error
//     }
// }

// export default sendEmail
