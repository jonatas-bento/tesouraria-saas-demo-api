import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(140)
  email?: string;

  @IsOptional()
  @IsIn(['active', 'away', 'visitor', 'transferred'])
  status?: 'active' | 'away' | 'visitor' | 'transferred';

  @IsOptional()
  @IsDateString()
  joinedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observations?: string;
}
