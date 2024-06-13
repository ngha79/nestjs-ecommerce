import { Module } from '@nestjs/common';
import { GatewayModule } from 'src/adapters/gateway.module';

@Module({
  imports: [GatewayModule],
})
export class EventsModule {}
