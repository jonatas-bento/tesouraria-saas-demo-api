import { IsArray, IsString } from 'class-validator';

export class AttachTransactionsDto {
  @IsArray()
  @IsString({ each: true })
  transactionIds!: string[];
}
