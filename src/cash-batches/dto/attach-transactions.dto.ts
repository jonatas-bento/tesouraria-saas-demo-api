import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AttachTransactionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  transactionIds!: string[];
}
