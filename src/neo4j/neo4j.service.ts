import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Driver, Record, session, Session } from 'neo4j-driver';
import { ConfigService } from '@nestjs/config';
import * as neo4j from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit {
  private driver: Driver;
  private config: any;

  constructor(
    @Inject('Neo4jConfig') neo4jConfig: any,
    private configService: ConfigService,
  ) {
    this.config = neo4jConfig;
  }

  onModuleInit(): void {
    this.driver = neo4j.driver(
      `${this.config.scheme}://${this.config.host}:${this.config.port}`,
      neo4j.auth.basic(this.config.username, this.config.password),
    );
  }

  getDriver(): Driver {
    return this.driver;
  }

  getSession(database?: string): Session {
    return this.driver.session({
      database: database || this.configService.get('NEO4J_DATABASE'),
      defaultAccessMode: session.WRITE,
    });
  }
  getReadSession(database?: string): Session {
    return this.driver.session({
      database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string): Session {
    return this.driver.session({
      database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  async run(query: string, params?: { [key: string]: any }): Promise<Record[]> {
    const session = this.getSession();
    try {
      const result = await session.run(query, params);
      return result.records;
    } finally {
      session.close();
    }
  }
}
