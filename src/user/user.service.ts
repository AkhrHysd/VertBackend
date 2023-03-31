import { Injectable } from '@nestjs/common';
import type { User } from './user.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class UserService {
  constructor(
    private readonly neo4jService: Neo4jService, // Neo4jServiceを注入
    private readonly web3Service: Web3Service, // Web3Serviceを注入
  ) {}

  async create(user: User): Promise<User> {
    const session = this.neo4jService.getSession();
    try {
      // Ethereumスマートコントラクトをデプロイ
      // const contractAddress = await this.web3Service.deployContract(user);
      const contractAddress = 'x0xdddffffdddsamdfadfa';

      // Neo4jにユーザーを作成
      const query = `
          CREATE (u:User {
            username: $username,
            email: $email,
            birthDate: $birthDate,
            departureDate: $departureDate,
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

  async findAll(): Promise<User[]> {
    // ここに全てのユーザーを取得するロジックを実装する
  }

  async findOne(id: string): Promise<User> {
    // 特定ユーザー取得
  }

  async update(id: string, updatedUser: Partial<User>): Promise<User> {
    // ここにユーザー情報の更新ロジックを実装する
  }

  async delete(id: string): Promise<void> {
    // ここにユーザー削除のロジックを実装する
  }
}
