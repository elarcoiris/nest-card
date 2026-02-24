import { Injectable } from '@nestjs/common';
import { tmpdir } from 'os';
import { promises } from 'fs';
import { join } from 'path';

@Injectable()
export class CertificateService {
  // private keysCreated: boolean;
  private keyPath: string;
  private password: string;

  constructor() {
    // this.keysCreated = false;
    this.keyPath = null;
    this.password = null;
  }

  async getKeys(): Promise<[string, string]> {
    // if (!this.keysCreated) {
    this.keyPath = await promises.mkdtemp(
      join(tmpdir(), 'apple-store-card-certificate'),
    );
    try {
      await promises.writeFile(
        join(this.keyPath, 'store-card.p12'),
        Buffer.from('APPLE_STORE_CARD_PK'),
        'base64',
      );

      await promises.writeFile(
        join(this.keyPath, 'wwdr.pem'),
        Buffer.from('APPLE_WWDR_PEM'),
        'base64',
      );

      await promises.writeFile(
        join(this.keyPath, 'tech.inspirare.wallet.pem'),
        Buffer.from('APPLE_STORE_CARD_PEM'),
        'base64',
      );

      const base64Password = 'APPLE_PK_PASSWORD';
      this.password = Buffer.from(base64Password, 'base64').toString();

      // this.keysCreated = true;
    } catch (error) {
      console.error(error);
    }
    // }
    return [this.keyPath, this.password];
  }
}
