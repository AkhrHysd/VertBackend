import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from './web3/web3.module';
import { UserService } from './user/user.service';
import { Web3Controller } from './web3/web3.controller';

@Module({
  imports: [ConfigModule.forRoot(), Neo4jModule, Web3Module],
  controllers: [AppController, UserController, Web3Controller],
  providers: [AppService, UserService],
})
export class AppModule {}
