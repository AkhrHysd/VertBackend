import { Controller, Get, Post, Param } from '@nestjs/common';
import { Web3Service } from './web3.service';

@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('test')
  async testWeb3(): Promise<string> {
    const web3 = this.web3Service.getInstance();
    const accounts = await web3.eth.getAccounts();

    return `First account: ${accounts[0]}`;
  }
  @Get(':id')
  async registerUser(@Param('id') id: string) {
    const result = await this.web3Service.registerUser(id);
    console.log(result); // 結果をコンソールに表示
    return { message: 'User registered successfully', result: result }; // 結果をレスポンスに含める
  }

  @Post('deploy')
  async deployContract(): Promise<any> {
    const deploymentResult = await this.web3Service.deployContract();
    return deploymentResult;
  }
}
