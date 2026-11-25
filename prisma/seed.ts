import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.student.deleteMany();

  await prisma.student.createMany({
    data: [
      { nim: '103022400001', nama: 'Budi Santoso', jurusan: 'Informatika', angkatan: 2024, email: 'budi@student.telkomuniversity.ac.id' },
      { nim: '103022400002', nama: 'Siti Aminah', jurusan: 'Sistem Informasi', angkatan: 2024, email: 'siti@student.telkomuniversity.ac.id' },
      { nim: '103022400003', nama: 'Andi Pratama', jurusan: 'Informatika', angkatan: 2023, email: 'andi@student.telkomuniversity.ac.id' },
      { nim: '103022400004', nama: 'Dewi Lestari', jurusan: 'Teknik Komputer', angkatan: 2023, email: 'dewi@student.telkomuniversity.ac.id' },
      { nim: '103022400005', nama: 'Rizky Maulana', jurusan: 'Sains Data', angkatan: 2025, email: 'rizky@student.telkomuniversity.ac.id' },
    ],
  });

  console.log('Seed selesai: 5 data student dimasukkan');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
