import { Module } from '@nestjs/common';
import { MessagingGateWay } from './gateway';
import { Services } from 'src/utils/constants';
import { GatewaySessionManager } from './gateway.session';

@Module({
  providers: [
    MessagingGateWay,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [
    MessagingGateWay,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
