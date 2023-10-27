import { Injectable } from '@nestjs/common'
import { Transporter, createTransport } from 'nodemailer'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EmailService {
  transporter: Transporter
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: configService.get('EMAIL_ADDRESS'),
        pass: configService.get('EMAIL_PASSWORD'),
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
