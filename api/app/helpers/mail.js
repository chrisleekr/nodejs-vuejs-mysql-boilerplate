const config = require('config');
const _ = require('lodash');
const fs = require('fs');
const nodemailer = require('nodemailer');

const { logger } = require('./logger');

class Mail {
  constructor() {
    this.moduleLogger = logger.child({ module: 'mail' });

    this.transportConfig = {
      host: config.get('smtp.host'),
      port: config.get('smtp.port'),
      secure: config.get('smtp.secure')
    };

    if (config.get('smtp.secure') === true) {
      this.transportConfig.auth.user = config.get('smtp.authUser');
      this.transportConfig.auth.pass = config.get('smtp.authPass');
    }

    if (config.get('smtp.debug') === true) {
      this.transportConfig.debug = true;
    }
    if (config.get('smtp.logger') === true) {
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
        from: from || `"${config.get('email.fromName')}" <${config.get('email.fromAddress')}>`,
        to,
        subject,
        html: renderedHtml
      });
    });
  }
}

module.exports = new Mail();
