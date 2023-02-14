import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    //await this.userLogicalDeletion();
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
  /*async userLogicalDeletion() {
    this.$use(async (params: any, next: any) => {
      if (params.model == 'user') {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = {
            active: false,
            admin: false,
            deleted_at: new Date().toJSON(),
          };
        }
        if (params.action == 'update') {
          if (params.args.data['active']) {
            params.args.data['active'] = true;
            params.args.data['deleted_at'] = null;
          }
          if (!params.args.data['active']) {
            params.args['data'] = {
              active: false,
              admin: false,
              deleted_at: new Date().toJSON(),
            };
          }
        }
      }
      return next(params);
    });
  }*/
}
