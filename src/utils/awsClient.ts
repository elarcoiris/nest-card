import { config, DynamoDB, SecretsManager } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class AwsClient {
  readonly dynamoDB: DynamoDB.DocumentClient;
  readonly secretsManager: SecretsManager;

  constructor() {
    config.update({
      region: process.env.AWS_DEFAULT_REGION || 'ap-southeast-2',
    });

    this.dynamoDB = new DynamoDB.DocumentClient({
      ...(process.env.ENV === 'development' && {
        endpoint: 'http:localhost:8008',
        region: 'localhost',
        accessKeyId: process.env.DEFAULT_ACCESS_KEY,
        secretAccessKey: process.env.DEFAULT_SECRET,
      }),
    });

    this.secretsManager = new SecretsManager();
  }

  async getSecret(key: string) {
    if (process.env.ENV === 'development' && process.env[key]) {
      return process.env[key];
    }

    try {
      return new Promise((resolve, reject) => {
        this.secretsManager.getSecretValue(
          {
            SecretId: `/example_channel/${key}`,
          },
          (err, data) => {
            if (err) {
              logger.error(`Error retrieving secret for ${key}`);
              reject(err.message);
            } else if (data.SecretString) {
              resolve(data.SecretString);
            } else if (data.SecretBinary) {
              resolve(data.SecretBinary);
            }
          },
        );
      });
    } catch (error) {
      logger.error(
        `There was an issue retrieving key ${key} from secrets: ${JSON.stringify(
          error.message,
        )}`,
      );
    }
  }
}
