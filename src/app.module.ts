import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [ConfigModule.forRoot(), Neo4jModule, Web3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
