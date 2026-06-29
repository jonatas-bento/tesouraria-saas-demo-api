import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  description!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  category!: string;

  @IsIn(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsIn(['pending', 'completed', 'cancelled'])
  status!: 'pending' | 'completed' | 'cancelled';
}
