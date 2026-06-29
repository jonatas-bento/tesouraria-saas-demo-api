import {
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MaxLength(140)
  name?: string;

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
