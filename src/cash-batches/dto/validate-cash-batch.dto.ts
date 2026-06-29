import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ValidateCashBatchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  validatedBy!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
