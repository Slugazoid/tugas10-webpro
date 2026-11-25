# Student API (NestJS + Prisma + PostgreSQL)

Project ini menjawab study case:
1. Endpoint API untuk **view data Student**
2. Penjelasan keterhubungan **module, controller, service (injectable)**
3. Koneksi ke **database** (Lokal: Docker Postgres / Supabase)
4. Hit lewat **Postman**, screenshot, dan penjelasan alurnya

---

## Step by Step Menjalankan

### 1. Install dependency
```bash
npm install
```

### 2. Siapkan file .env
```bash
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```
Lalu pilih database (lihat bagian "Pilih Database" di bawah).

### 3. Generate Prisma Client + buat tabel
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Isi data contoh (seed)
```bash
npx prisma db seed
```

### 5. Jalankan server
```bash
npm run start:dev
```
Kalau berhasil muncul: `Server jalan di http://localhost:3000`

### 6. Tes di Postman
| Method | URL | Hasil |
|--------|-----|-------|
| GET | http://localhost:3000/students | semua data student |
| GET | http://localhost:3000/students/1 | 1 student (id = 1) |
| GET | http://localhost:3000/students/99 | 404 Not Found |

Ambil screenshot request + response (Status 200 OK) untuk laporan.

---

## Pilih Database

### Opsi A: Lokal (Docker PostgreSQL)
```bash
docker compose up -d
```
Pakai isi `.env` bawaan dari `.env.example` (bagian OPSI A). Cek di pgAdmin / DBeaver: host `localhost`, port `5432`, user `postgres`, password `postgres`, db `student_db`.

> Kalau pakai XAMPP: XAMPP itu MySQL/MariaDB, bukan PostgreSQL. Ganti `provider = "mysql"` di `prisma/schema.prisma`, hapus baris `directUrl`, dan set `DATABASE_URL="mysql://root:@localhost:3306/student_db"`.

### Opsi B: Supabase
1. Buat project di supabase.com
2. Buka **Project Settings > Database > Connection string**
3. Isi `.env`:
   - `DATABASE_URL` = Transaction pooler (port 6543) + `?pgbouncer=true`
   - `DIRECT_URL` = Session pooler / Direct (port 5432)
4. Jalankan lagi step 3 sampai 5. Data otomatis muncul di Supabase > Table Editor > `students`.

---

## Struktur Folder
```
student-api/
├── prisma/
│   ├── schema.prisma          # definisi tabel students
│   └── seed.ts                # data contoh
├── src/
│   ├── main.ts                # titik awal aplikasi
│   ├── app.module.ts          # root module
│   ├── prisma/
│   │   ├── prisma.module.ts   # module koneksi DB
│   │   └── prisma.service.ts  # service koneksi DB
│   └── student/
│       ├── student.module.ts
│       ├── student.controller.ts
│       └── student.service.ts
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Penjelasan Point 2: Keterhubungan Module, Controller, Service

Analogi gampang: **restoran**.
- **Controller** = pelayan (terima pesanan dari pelanggan / request)
- **Service** = koki (yang benar-benar masak / olah data)
- **Prisma** = gudang bahan (database)
- **Module** = satu divisi restoran yang mengelompokkan pelayan + koki

| Komponen | File | Tugas |
|----------|------|-------|
| **Module** | `student.module.ts` | Mendaftarkan `StudentController` dan `StudentService` jadi satu paket fitur |
| **Controller** | `student.controller.ts` | Menerima request `GET /students`, lalu memanggil service |
| **Service (@Injectable)** | `student.service.ts` | Mengambil data dari database lewat Prisma |
| **PrismaService** | `prisma.service.ts` | Jembatan ke database (baca `DATABASE_URL`) |

**Injectable** = class yang bisa "dititipkan" otomatis oleh NestJS ke class lain lewat constructor (Dependency Injection). Jadi kita tidak perlu `new StudentService()` manual.

### Alur Request sampai Database
```
Postman: GET /students
        │
        ▼
main.ts  → AppModule → StudentModule
        │
        ▼
StudentController.findAll()      (route @Get di /students)
        │  memanggil
        ▼
StudentService.findAll()         (@Injectable)
        │  memanggil
        ▼
PrismaService.student.findMany() (Prisma Client)
        │  Prisma ubah jadi SQL: SELECT * FROM students ORDER BY id
        ▼
Database PostgreSQL (Lokal / Supabase)
        │
        ▼  hasil data balik lewat jalur yang sama
Response JSON → Postman
```

---

## Contoh Response `GET /students`
```json
{
  "total": 5,
  "data": [
    {
      "id": 1,
      "nim": "103022400001",
      "nama": "Budi Santoso",
      "jurusan": "Informatika",
      "angkatan": 2024,
      "email": "budi@student.telkomuniversity.ac.id",
      "createdAt": "2026-11-19T00:00:00.000Z"
    }
  ]
}
```

## Template Penjelasan untuk Laporan (di bawah screenshot)
> Saat Postman mengirim `GET /students`, request masuk ke `StudentController` (method `findAll`). Controller tidak mengambil data sendiri, melainkan memanggil `StudentService` yang sudah di-inject lewat constructor. `StudentService` memakai `PrismaService` untuk menjalankan `findMany()`, yang diterjemahkan Prisma menjadi query `SELECT * FROM students` ke database. Hasilnya dikembalikan ke service, lalu ke controller, dan dikirim ke Postman sebagai JSON dengan status 200 OK. `StudentModule` yang mengikat controller dan service ini dalam satu fitur, dan `AppModule` mendaftarkan `StudentModule` ke aplikasi.
