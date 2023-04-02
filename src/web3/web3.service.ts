import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
import { Contract } from 'web3-eth-contract';
import { abi } from './abis/VerticalSNS.abi.json';
import { bytecode } from './bytecode/VerticalSNS.bytecode.json';

@Injectable()
export class Web3Service implements OnModuleInit {
  private web3: Web3;
  private config: any;
  private contract: Contract;

  constructor(
    @Inject('Web3Config') web3Config: any,
    private configService: ConfigService,
  ) {
    this.config = web3Config;
    this.web3 = new Web3(this.config.rpcUrl);
    this.contract = new this.web3.eth.Contract(
      abi as any,
      this.config.contractAddress,
    );
  }

  onModuleInit(): void {
    this.web3 = new Web3(this.config.rpcUrl);
  }

  getInstance(): Web3 {
    return this.web3;
  }

  getVerticalSNSContractInstance(): any {
    return new this.web3.eth.Contract(abi as any, this.config.contractAddress);
  }

  async deployContract() {
    const accounts = await this.web3.eth.getAccounts();
    const fromAccount = accounts[0];
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.web3.eth.estimateGas({ data: bytecode });

    const contract = new this.web3.eth.Contract(abi as any);

    const deployedContract = await contract
      .deploy({
        data: bytecode,
      })
      .send({
        from: fromAccount,
        gas: gasEstimate,
        gasPrice: gasPrice,
      });
    console.log(
      'Contract deployed at address:',
      deployedContract.options.address,
    );
    return deployedContract.options.address;
  }

  async registerUser(uniqueId: string): Promise<any> {
    const accounts = await this.web3.eth.getAccounts();
    const fromAccount = accounts[0];
    const gasPrice = await this.web3.eth.getGasPrice();
    const bytes32UniqueId = this.web3.utils.utf8ToHex(uniqueId);
    const gasEstimate = await this.contract.methods
      .registerUser(bytes32UniqueId)
      .estimateGas({ from: fromAccount });

    const result = await this.contract.methods
      .registerUser(bytes32UniqueId)
      .send({ from: fromAccount, gasPrice, gas: gasEstimate });
    return result;
  }
}
