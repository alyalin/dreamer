import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsSESService {
  SESConfig: SES.ClientConfiguration = {
    apiVersion: '2010-12-01',
    accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
    region: this.configService.get('AWS_SES_REGION'),
  };

  constructor(private configService: ConfigService) {}

  async sendWelcomeEmail(userName: string, email: string, actionUrl: string) {
    const params: SES.Types.SendTemplatedEmailRequest = {
      Destination: {
        ToAddresses: [
          email,
        ],
      },
      ConfigurationSetName: 'TestConfig',
      Source: 'no-reply@justadreamer.ru',
      Template: 'WelcomeTemplate6',
      TemplateData: JSON.stringify({
        name: userName,
        action_url: actionUrl,
        login_url: 'https://justadreamer.ru/account/sign-in/',
        username: email,
        support_email: 'support@justadreamer.ru',
        help_url: 'https://justadreamer.ru/helpdesk/'
      }),
    };
    return await new SES(this.SESConfig).sendTemplatedEmail(params).promise();
  }
}
