import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterStudentDto {
  @IsOptional()
  @IsString()
  jurusan?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'angkatan harus berupa angka' })
  angkatan?: number;

  @IsOptional()
  @IsString()
  search?: string;
}