import { Injectable } from '@nestjs/common';
import { hash, Options, verify } from 'argon2';

@Injectable()
export class HashingService {
  public async hash(data: string, options?: Partial<Options>): Promise<string> {
    return hash(data, options);
  }

  public async verify(hashedData: string, plain: string): Promise<boolean> {
    return verify(hashedData, plain);
  }
}
