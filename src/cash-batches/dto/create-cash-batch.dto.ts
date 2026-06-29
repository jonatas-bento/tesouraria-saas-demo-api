import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCashBatchDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  description!: string;

  @IsNumber()
  @Min(0)
  countedAmount!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  countedBy!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
