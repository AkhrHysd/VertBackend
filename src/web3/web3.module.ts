import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    Web3Service,
    {
      provide: 'Web3Config',
      useFactory: (configService: ConfigService) => ({
        rpcUrl: configService.get('WEB3_RPC_URL'),
        contractAddress: configService.get('CONTRACT_ADDRESS'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [Web3Service],
})
export class Web3Module {}
