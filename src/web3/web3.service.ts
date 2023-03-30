import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Web3Service implements OnModuleInit {
  private web3: Web3;
  private config: any;

  constructor(
    @Inject('Web3Config') web3Config: any,
    private configService: ConfigService,
  ) {
    this.config = web3Config;
  }

  onModuleInit(): void {
    this.web3 = new Web3(this.config.rpcUrl);
  }

  getInstance(): Web3 {
    return this.web3;
  }
}
