import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filter: FilterStudentDto = {}) {
    const { jurusan, angkatan, search } = filter;

    const data = await this.prisma.student.findMany({
      where: {
        jurusan: jurusan ? { equals: jurusan, mode: 'insensitive' } : undefined,
        angkatan: angkatan,
        nama: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy: { id: 'asc' },
    });
    return { total: data.length, data };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student dengan id ${id} tidak ditemukan`);
    }
    return student;
  }

  async create(dto: CreateStudentDto) {
    try {
      const student = await this.prisma.student.create({ data: dto });
      return { message: 'Student berhasil ditambahkan', data: student };
    } catch (error) {
      throw this.ubahError(error);
    }
  }

  async update(id: number, dto: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.update({
        where: { id },
        data: dto,
      });
      return { message: 'Student berhasil diubah', data: student };
    } catch (error) {
      throw this.ubahError(error, id);
    }
  }

  async remove(id: number) {
    try {
      const student = await this.prisma.student.delete({ where: { id } });
      return { message: 'Student berhasil dihapus', data: student };
    } catch (error) {
      throw this.ubahError(error, id);
    }
  }

  async stats() {
    const total = await this.prisma.student.count();

    const perJurusan = await this.prisma.student.groupBy({
      by: ['jurusan'],
      _count: { _all: true },
      orderBy: { jurusan: 'asc' },
    });

    return {
      total,
      perJurusan: perJurusan.map((item) => ({
        jurusan: item.jurusan,
        jumlah: item._count._all,
      })),
    };
  }

  private ubahError(error: any, id?: number): Error {
    if (error?.code === 'P2002') {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target.join(', ')
        : 'nim/email';
      return new ConflictException(`Data dengan ${field} tersebut sudah terdaftar`);
    }
    if (error?.code === 'P2025') {
      return new NotFoundException(`Student dengan id ${id} tidak ditemukan`);
    }
    return error;
  }
}