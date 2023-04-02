import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from './user.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class UserService {
  constructor(
    private readonly neo4jService: Neo4jService, // Neo4jServiceを注入
    private readonly web3Service: Web3Service, // Web3Serviceを注入
  ) {}

  async create(user: Omit<User, 'contractAddress'>): Promise<User> {
    const session = this.neo4jService.getWriteSession();
    try {
      // Ethereumスマートコントラクトをデプロイ
      const contractAddress = await this.web3Service.deployContract();

      // Neo4jにユーザーを作成
      const query = `
          CREATE (u:User {
            username: $username,
            email: $email,
            birthDate: $birthDate,
            passingDate: $passingDate,
            contractAddress: $contractAddress
          })
          RETURN u
        `;
      const result = await session.run(query, { ...user, contractAddress });

      // 作成したユーザーオブジェクトを返す
      const createdUser = result.records[0].get('u').properties as User;
      return createdUser;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      session.close();
    }
  }

  async findOne(contractAddress: string): Promise<User> {
    const session = this.neo4jService.getReadSession();
    const result = await session.run(
      'MATCH (u:User {contractAddress: $contractAddress}) RETURN u',
      {
        contractAddress,
      },
    );
    session.close();

    if (result.records.length === 0) {
      throw new NotFoundException(`User with ID ${contractAddress} not found`);
    }

    return result.records[0].get('u').properties;
  }

  async update(
    contractAddress: string,
    updateUserData: Partial<User>,
  ): Promise<User> {
    const session = this.neo4jService.getWriteSession();
    const result = await session.run(
      `
        MATCH (u:User {contractAddress: $contractAddress})
        SET u += $updateUserData
        RETURN u
      `,
      { contractAddress, updateUserData },
    );
    session.close();

    if (result.records.length === 0) {
      throw new NotFoundException(
        `User with contractAddress ${contractAddress} not found`,
      );
    }

    return result.records[0].get('u').properties;
  }

  async delete(contractAddress: string): Promise<void> {
    const session = this.neo4jService.getWriteSession();
    const result = await session.run(
      'MATCH (u:User {contractAddress: $contractAddress}) DELETE u',
      {
        contractAddress,
      },
    );
    session.close();

    if (result.summary.counters.updates().nodesDeleted === 0) {
      throw new NotFoundException(`User with ID ${contractAddress} not found`);
    }
  }
}
