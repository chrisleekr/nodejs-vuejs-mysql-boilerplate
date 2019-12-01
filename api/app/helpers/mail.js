const _ = require('lodash');
const fs = require('fs');
const nodemailer = require('nodemailer');

const { logger } = require('./logger');

class Mail {
  constructor() {
    this.moduleLogger = logger.child({ module: 'mail' });

    this.transportConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true'
    };

    if (process.env.SMTP_SECURE === 'true') {
      this.transportConfig.auth.user = process.env.SMTP_AUTH_USER;
      this.transportConfig.auth.pass = process.env.SMTP_AUTH_PASS;
    }

    if (process.env.SMTP_DEBUG === 'true') {
      this.transportConfig.debug = true;
    }
    if (process.env.SMTP_LOGGER === 'true') {
      this.transportConfig.logger = true;
    }

    this.transporter = nodemailer.createTransport(this.transportConfig);

    this.moduleLogger.debug({ transportConfig: this.transportConfig }, 'mail class initialized');
  }

  static replaceTemplateValues(content, templateValues) {
    let convertedContent = content;
    _.forEach(templateValues, (value, key) => {
      convertedContent = _.replace(convertedContent, new RegExp(`{${key}}`, 'g'), value);
    });
    return convertedContent;
  }

  async sendEmail({ from, to, subject, templatePath, templateValues } = {}) {
    this.moduleLogger.debug({ from, to, subject, templatePath, templateValues }, 'sendEmail triggered');

    fs.readFile(templatePath, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        this.moduleLogger.error(err, 'Error occurred while reading template file');
        // should not throw error because it will crash the app
        return;
      }

      const renderedHtml = Mail.replaceTemplateValues(html, templateValues);
      this.moduleLogger.debug({ renderedHtml }, 'HTML file loaded for email, send now');

      this.transporter.sendMail({
        from: from || `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to,
        subject,
        html: renderedHtml
      });
    });
  }
}

module.exports = new Mail();
