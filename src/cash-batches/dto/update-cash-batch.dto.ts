import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCashBatchDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  countedAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  countedBy?: string;

  @IsOptional()
  @IsIn(['open', 'checking', 'validated', 'divergent'])
  status?: 'open' | 'checking' | 'validated' | 'divergent';

  @IsOptional()
  @IsString()
  @MaxLength(120)
  validatedBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
