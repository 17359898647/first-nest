import { Injectable } from '@nestjs/common'
import { Transporter, createTransport } from 'nodemailer'

@Injectable()
export class EmailService {
  transporter: Transporter
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: '1635656638@qq.com',
        pass: 'ddsicgwgkooobdjg',
      },
    })
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预约系统',
        address: '1635656638@qq.com',
      },
      to,
      subject,
      html,
    })
  }
}
