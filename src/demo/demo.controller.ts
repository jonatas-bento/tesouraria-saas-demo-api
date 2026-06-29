import { Controller, Post } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post('reset')
  reset() {
    return this.demoService.reset();
  }
}
