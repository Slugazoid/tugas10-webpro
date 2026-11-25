import { IsEmail, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsString({ message: 'nim harus berupa teks' })
  @IsNotEmpty({ message: 'nim wajib diisi' })
  nim: string;

  @IsString({ message: 'nama harus berupa teks' })
  @IsNotEmpty({ message: 'nama wajib diisi' })
  nama: string;

  @IsString({ message: 'jurusan harus berupa teks' })
  @IsNotEmpty({ message: 'jurusan wajib diisi' })
  jurusan: string;

  @Type(() => Number)
  @IsInt({ message: 'angkatan harus berupa angka' })
  @Min(2000, { message: 'angkatan minimal 2000' })
  @Max(2100, { message: 'angkatan maksimal 2100' })
  angkatan: number;

  @IsEmail({}, { message: 'format email tidak valid' })
  email: string;
}
