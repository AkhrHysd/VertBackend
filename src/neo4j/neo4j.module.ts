import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    Neo4jService,
    {
      provide: 'Neo4jConfig',
      useFactory: (configService: ConfigService) => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [Neo4jService],
})
export class Neo4jModule {}
