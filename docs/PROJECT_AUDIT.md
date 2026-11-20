# Audit awal dan rencana pengembangan SportsCenter

Tanggal: 20 November 2026. Tujuan: menyelesaikan e-commerce sederhana untuk portofolio, tanpa payment gateway, kemudian menyiapkan deployment VPS, lalu rebranding nama dan tampilan.

Dokumen ini mencatat kondisi awal, bukan daftar fitur yang sudah selesai diperbaiki. Pemeriksaan mencakup source backend/frontend, konfigurasi, seed database, build, lint, dan percobaan test. Alur melalui browser dan API yang berjalan belum diverifikasi karena koneksi MySQL ditolak.

## 1. Peta proyek

| Bagian | Implementasi saat audit |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 8, Material UI 5 |
| State dan form | Redux Toolkit, React Hook Form, Yup |
| Routing dan HTTP | React Router 7, Axios |
| Backend | Java 25, Spring Boot 4.0.6, Spring MVC, Spring Security |
| Data | MySQL untuk produk dan pesanan; Redis untuk keranjang |
| Mapping dan dokumentasi API | MapStruct dan Springdoc OpenAPI |
| Infrastruktur | Docker Compose berisi MySQL dan Redis; aplikasi belum dikontainerisasi |

Alur data yang dimaksud: React -> REST API -> controller -> service -> repository -> MySQL/Redis. Struktur ini cukup untuk kebutuhan proyek; belum perlu mengganti stack atau memecah backend menjadi banyak layanan.

Lokasi utama:

- `client/src/features`: halaman dan state katalog, akun, keranjang, checkout, pesanan, home, contact.
- `client/src/app/api`: HTTP client dan sinkronisasi keranjang.
- `src/main/java/com/ecommerce/sportscenter`: controller, service, entity, repository, security, mapper, DTO.
- `docker/data.sql`: skema dan seed katalog.
- `docker/docker-compose.yml`: layanan data lokal.

## 2. Inventaris fitur

| Fitur | Kondisi dari kode | Kekurangan utama |
| --- | --- | --- |
| Home | Ada hero dan navigasi ke toko/kontak | Peninjauan isi dan identitas saat rebranding |
| Katalog | Ada daftar, pencarian nama, filter brand/tipe, urutan nama, pagination | Parameter dan state belum terpadu; hasil filter dapat tertimpa request lain |
| Detail produk | Ada gambar, deskripsi, brand, tipe, harga, kontrol keranjang | Belum ada stok atau status tidak tersedia |
| Keranjang | Tambah/hapus, ubah jumlah, subtotal dan ongkir; ditulis ke Redis dan localStorage | Browser menjadi sumber pembacaan; belum memulihkan dari Redis atau menangani keranjang kedaluwarsa |
| Login | Ada endpoint JWT, form, dan route guard frontend | Satu akun in-memory, pemulihan sesi belum dipanggil, batas akses backend belum tepat |
| Registrasi | Halaman ada | Submit hanya `console.log(formData)`; tidak ada endpoint maupun tabel pengguna |
| Checkout | Alamat -> review -> data kartu -> buat pesanan -> konfirmasi | Data kartu tidak diproses; integritas harga dan item pesanan perlu diperbaiki |
| Riwayat pesanan | Ada daftar dengan nomor, tanggal, status, total | Daftar seluruh pesanan; belum punya pemilik, detail barang, atau pembatalan |
| Admin | Belum ada halaman atau API pengelolaan | Belum bisa mengelola produk, stok, dan status pesanan |
| Kontak | Ada halaman dan form | Tombol hanya mencegah aksi default; belum mengirim atau menyimpan pesan |
| Dark/light mode dan mobile | Ada tema, drawer navigasi/filter, dan variasi layout | Preferensi tema belum disimpan; tampilan dan aksesibilitas belum diuji langsung |

## 3. Temuan yang harus didahulukan

### A. Batas akses dan akun

1. **API pesanan terbuka.** `SecurityConfig` mencocokkan `/products` dan `/auth/login`, sedangkan controller menggunakan awalan `/api`. Aturan terakhir `anyRequest().permitAll()` membuat endpoint lain terbuka. Route guard React tidak melindungi API. Sumber: `config/SecurityConfig.java`, `controller/OrdersController.java`.
2. **Belum ada kepemilikan pesanan.** Entity `Order` tidak menyimpan pembeli, dan service memakai `findAll()` / `findById()` tanpa menyaring pengguna. Endpoint hapus juga tidak memeriksa pemilik atau role. Sumber: `entity/OrderAggregate/Order.java`, `service/OrderServiceImpl.java`.
3. **Akun belum persisten.** `MyConfig` membuat satu akun in-memory. Registrasi frontend belum terhubung dan masih mencetak form termasuk password ke console. Sumber: `config/MyConfig.java`, `client/src/features/account/RegisterPage.tsx`.
4. **Sesi frontend tidak dipulihkan.** `fetchCurrentUser` tersedia, tetapi tidak dipanggil saat bootstrap. Implementasinya sendiri baru membaca localStorage, belum memvalidasi sesi ke server. Penanganan token kedaluwarsa/401 belum ada. Sumber: `accountSlice.ts`, `App.tsx`, `main.tsx`, `agent.ts`.
5. **Secret dan logging perlu dibenahi.** JWT secret dan kredensial database tertulis di source; filter mencatat seluruh header Authorization. Endpoint `/api/auth/user` mengembalikan `UserDetails` langsung: ganti dengan DTO publik agar detail internal akun tidak ikut terekspos. Sumber: `security/JwtHelper.java`, `security/JwtAuthenticationFilter.java`, `controller/AuthController.java`, `application.yaml`.

### B. Integritas checkout dan pesanan

1. **Harga belum bersumber dari database saat checkout.** Basket menerima harga, nama, dan kuantitas dari request browser. `createOrder` menghitung subtotal dari harga basket tersebut. Pengiriman ongkir dan tanggal juga masih ditentukan client. Backend perlu menerima identitas barang/jumlah dan mengambil harga aktual dari database, menetapkan ongkir serta waktu sendiri, lalu memvalidasi seluruh item.
2. **Snapshot item pesanan belum lengkap.** `mapBasketItemToOrderItem` mengisi produk dan jumlah tetapi tidak mengisi `price` atau `orderItem.setOrder(order)`. Relasi `Order.orderItems` menggunakan `mappedBy = "order"`, sehingga sisi pemilik relasi perlu diisi. Ini temuan kode; efek persistensi belum diuji dengan database berjalan.
3. **Tanggal/status respons tidak mencerminkan data tersimpan.** `OrderMapper.OrderToOrderResponse` menggunakan waktu saat respons dibuat dan status konstan `Pending`. Riwayat akan menampilkan tanggal baru saat dibaca dan tidak dapat menampilkan perkembangan status yang sebenarnya.
4. **DTO belum memvalidasi input.** Controller menggunakan `@Valid`, tetapi `OrderDto` dan alamat belum memiliki constraint. Keranjang kosong, jumlah nol/negatif, produk tidak ditemukan, dan alamat kosong perlu ditolak secara eksplisit.
5. **Belum ada mekanisme stok atau perlindungan retry checkout.** Tambahkan validasi/pengurangan stok dalam transaksi database, dan pastikan pengiriman ulang checkout tidak membuat dua pesanan. Transaksi MySQL tidak otomatis membuat operasi Redis menjadi atomik; tangani kegagalan pembersihan basket secara terpisah.
6. **Representasi uang belum konsisten.** Produk menggunakan `Long`, subtotal entity `Double`, DTO subtotal `Long`, dan seed harga `DECIMAL`. Untuk harga rupiah utuh, pilih satuan rupiah integer secara konsisten dan periksa batas nilainya.

Sumber utama: `controller/BasketController.java`, `service/OrderServiceImpl.java`, `mapper/OrderMapper.java`, `model/OrderDto.java`, `entity/OrderAggregate/*`, `client/src/features/checkout/CheckoutPage.tsx`.

### C. Katalog, keranjang, dan HTTP client

- `Catalog.tsx` memiliki beberapa jalur fetch: perubahan halaman mengambil produk tanpa filter; filter/sort membangun URL yang tidak menyertakan pagination; pencarian memakai request terpisah dan membaca `productsRes.length` alih-alih `totalElements`. Ada pemanggilan setelah perubahan state yang masih dapat memakai nilai lama dan request yang saling menimpa.
- Solusi sederhana: satu objek parameter query untuk page, size, keyword, brand, type, sort, order; satu jalur fetch; reset halaman saat filter berubah; batalkan/abaikan respons yang sudah tidak relevan. Pencarian, filter, sort, pagination harus bekerja bersama.
- `basketService.getBasket()` hanya membaca localStorage. Keranjang yang masih ada di browser tetapi hilang di Redis dapat gagal saat checkout. `getBasketFromApi()` memanggil endpoint daftar semua keranjang tetapi dideklarasikan sebagai satu `Basket`.
- Keranjang belum menyimpan pemilik atau TTL. Endpoint daftar semua basket sebaiknya dihilangkan dari API publik; akses mutasi/per-basket perlu dibatasi, termasuk ketika membawa guest basket ke akun setelah login.
- `agent.ts` mengakses `error.response.status` tanpa memeriksa apakah response tersedia. Gangguan jaringan dapat menimbulkan error tambahan. Error juga diubah menjadi string sehingga detail respons hilang.
- Helper `requests.delete` memanggil `axios.put`. Belum dipakai oleh fitur hapus saat ini, tetapi salah dan perlu diperbaiki sebelum digunakan.
- Checkout menghapus basket lagi dari frontend setelah backend sudah menghapusnya; request kedua tidak di-await. Tentukan satu pemilik pembersihan basket.
- URL API `localhost:8081` tersebar di frontend. Pusatkan konfigurasi agar build dapat berjalan di VPS.
- Validasi parameter backend perlu membatasi page/size dan mengizinkan hanya kolom sort yang didukung, agar input salah menjadi respons 400 yang jelas.

### D. Konfigurasi dan kesiapan pengujian

- Konfigurasi Redis berada di `data.redis` tingkat root; periksa dan letakkan pada namespace konfigurasi Spring yang benar (`spring.data.redis`). Default localhost dapat menyamarkan masalah ini saat pengembangan lokal.
- `Basket` memakai import `jakarta.persistence.Id` untuk model Redis. Verifikasi pemetaan ID; gunakan anotasi Spring Data sesuai penyimpanan yang dipakai.
- `ProductRepository` mendeklarasikan derived-query method yang mengembalikan `Specification<Product>`. Method tersebut tidak dipakai oleh service; tinjau atau hapus, dan verifikasi startup setelah database tersedia. Audit belum membuktikan kegagalan startup pada bagian ini.
- Test backend hanya `contextLoads`; belum ada pengujian aturan harga, kepemilikan, item pesanan, stok, dan checkout. Belum ditemukan test aplikasi frontend.
- Test saat ini langsung bergantung pada database lokal dan konfigurasi aplikasi. Sediakan konfigurasi database test terpisah sebelum menguji alur yang menulis data.
- README menyebut real-time inventory dan klaim skala/performa yang belum didukung implementasi maupun pengukuran. Rapikan menjadi deskripsi faktual, langkah setup teruji, batasan demo, dan skenario penggunaan.

## 4. Hasil verifikasi kondisi awal

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` dari `client` | Gagal: 8 diagnostik TypeScript |
| `npm run lint` dari `client` | Gagal: 24 error, 1 warning |
| `./mvnw.cmd test` | Gagal saat memulai application context: akses MySQL ditolak untuk akun konfigurasi lokal |
| `./mvnw.cmd -DskipTests clean package` | Berhasil; backend dapat dikompilasi dan dikemas setelah build bersih |
| Pengujian browser/API end-to-end | Belum dilakukan; backend belum dapat dijalankan dengan konfigurasi database saat audit |

Error TypeScript mencakup parameter/event tanpa tipe di registrasi, parameter/import tidak dipakai di account/catalog/home, dan pembandingan nilai literal ongkir yang tidak mungkin terpenuhi di BasketPage. Tidak perlu menonaktifkan strict mode untuk memperbaikinya.

Java 25, Node 24, dan Docker tersedia. Port MySQL lokal 3306 sudah dipakai; Redis 6379 juga dipakai proyek lain. Lingkungan SportsCenter perlu diisolasi agar tidak bergantung pada atau mengganggu layanan tersebut. Kredensial database belum diubah dan layanan Docker lain belum dimodifikasi.

## 5. Cakupan fitur sederhana yang disarankan

Target demo: pengunjung dapat mencari produk, mendaftar/login, membuat pesanan simulasi, dan melihat pesanannya sendiri. Admin dapat mengelola produk/stok serta memproses status pesanan.

| Prioritas | Fitur/perbaikan | Kriteria selesai |
| --- | --- | --- |
| P0 | Build, konfigurasi lokal terisolasi, error handling | Frontend build/lint lolos, backend berjalan dengan database khusus proyek, error jaringan tidak merusak UI |
| P0 | Register/login database dan role `CUSTOMER`/`ADMIN` | Password di-hash; username/email unik; sesi pulih saat refresh; pengguna tidak bisa memilih role admin saat registrasi |
| P0 | Otorisasi dan kepemilikan | Anonim ditolak di API pesanan; pelanggan hanya bisa membaca/mengubah data yang diizinkan; admin endpoint memerlukan role admin |
| P0 | Perbaikan penyimpanan pesanan | Harga dari database; alamat/jumlah valid; item dan harga tersimpan; tanggal/status benar; retry tidak menggandakan pesanan |
| P1 | Checkout simulasi | Alamat -> review dan konfirmasi demo -> berhasil; tidak meminta nomor kartu/CVV; pemberitahuan jelas tidak ada pembayaran/pengiriman sungguhan |
| P1 | Katalog konsisten | Search + filter + sort + pagination bisa digabung; ada reset filter, kondisi kosong/gagal, dan sort harga |
| P1 | Keranjang konsisten | State UI/server selaras; jumlah valid; basket hilang ditangani; akses antarpengguna dibatasi |
| P1 | Stok sederhana | Satu angka stok per produk; tidak bisa membeli melebihi stok; dua checkout bersamaan tidak membuat stok negatif |
| P1 | Detail dan pembatalan pesanan | Tampil snapshot barang, kuantitas, harga, alamat, ongkir, total, status; pelanggan hanya dapat membatalkan pesanan miliknya yang belum diproses |
| P1 | Admin sederhana | Tambah/edit/nonaktifkan produk; atur stok; lihat pesanan; ubah status sesuai alur yang diizinkan |
| P2 | Pengalaman demo dan dokumentasi | Data contoh mudah disiapkan, akses demo pelanggan, panduan admin lokal, README faktual dan skenario demo singkat |
| P2 | Kontak sederhana | Gunakan kontak yang benar atau link email; tidak menampilkan form yang seolah mengirim tetapi tidak berfungsi |

Untuk admin produk, nonaktifkan produk yang sudah pernah dipesan agar histori tetap utuh. Awalnya gunakan gambar yang sudah tersedia atau URL terkontrol; upload gambar dapat menyusul jika dibutuhkan. Demo admin publik, jika nanti dibuat, perlu pembatasan mutasi/reset data; jangan langsung mempublikasikan akun admin produksi.

Status pesanan yang diusulkan: `PENDING -> PROCESSING -> SHIPPED -> COMPLETED`. `PENDING -> CANCELLED` mengembalikan stok tepat satu kali. Label halaman menegaskan bahwa ini simulasi. Status pembayaran lama perlu dipetakan saat migrasi jika sudah ada data penting.

Tidak perlu memasukkan payment gateway, integrasi ongkir/kurir, kupon kompleks, multi-vendor, chat, review, atau wishlist ke cakupan awal. Ongkir tetap satu tarif yang ditetapkan backend. Formulir kartu dan klaim email konfirmasi terkirim di halaman sukses sebaiknya diganti sesuai perilaku demo yang sebenarnya.

Pertahankan React + Spring Boot + MySQL. Redis dapat dipertahankan pada iterasi awal agar perubahan terfokus; bila setelah fitur stabil ingin mengurangi layanan di VPS, evaluasi penyimpanan keranjang di MySQL sebagai pekerjaan tersendiri.

## 6. Urutan pengerjaan

1. **Stabilisasi dasar:** perbaiki build/lint dan HTTP client; isolasi database/Redis lokal; pindahkan konfigurasi ke environment; pastikan startup dan katalog bekerja.
2. **Akun dan akses:** pengguna persisten, registrasi, login, bootstrap sesi, role, DTO akun publik, ownership pesanan/basket.
3. **Alur belanja:** satukan query katalog, sinkronkan basket, checkout simulasi, integritas item/harga/stok/transaksi, detail dan pembatalan pesanan.
4. **Admin:** pengelolaan produk/stok serta status pesanan, dengan validasi dan otorisasi server.
5. **Verifikasi dan demo:** test aturan bisnis penting, uji dua pengguna berbeda, uji stok bersamaan, uji browser mobile/desktop, siapkan data dan dokumentasi demo.
6. **Persiapan VPS:** kemasan frontend/backend, Compose produksi, reverse proxy/HTTPS, migrasi data, backup/restore, healthcheck, deployment dan rollback teruji.
7. **Rebranding:** pilih nama dan arah visual, perbarui identitas/halaman, screenshot baru, metadata, dan deskripsi case study untuk situs portofolio. Setelah rebranding, build dan deploy ulang.

Urutan ini mengikuti permintaan: fungsi -> persiapan VPS -> rebranding. Belum ada penggantian nama, perombakan UI, atau deployment yang dilakukan dalam audit awal.

## 7. Catatan untuk fase VPS

Rancangan awal yang cukup: satu VPS, satu reverse proxy yang melayani frontend statis dan meneruskan `/api` ke Spring Boot, dengan MySQL serta Redis di jaringan privat Compose. Detail kapasitas, domain, OS, dan integrasi dengan layanan VPS yang sudah ada ditentukan ketika masuk fase deployment.

Pekerjaan yang perlu disiapkan:

- Dockerfile backend dan build frontend yang dapat diulang, versi image dipatok, konfigurasi development/production dipisah.
- URL API relatif `/api` atau satu environment variable; fallback SPA untuk refresh `/store/:id` dan route lain.
- Database user khusus aplikasi, secret dari environment yang tidak di-commit, token tidak masuk log, CORS sesuai domain.
- Database/Redis tidak diekspos ke internet; persistent volume, healthcheck, restart policy, serta batas pemakaian sumber daya sesuai VPS.
- Migrasi skema berversi. `ddl-auto: update` dan seed yang berisi `DROP TABLE` tidak dijadikan prosedur update produksi.
- Cek sensitivitas huruf besar/kecil nama tabel dan file gambar pada Linux: entity/seed memakai `Product`, `Type`, `Brand`, sedangkan aset frontend memakai folder `images/products`.
- Backup yang benar-benar diuji pemulihannya, log yang dapat dibaca, prosedur deploy dan rollback, serta smoke test setelah deployment.
- README setup dan demo, screenshot, daftar fitur aktual, serta batasan simulasi yang sesuai implementasi.

## 8. Batas kepastian audit

Temuan tentang rute, pemetaan order, parameter query, form registrasi, dan konfigurasi didasarkan pada kode yang dibaca. Error build/lint dan penolakan MySQL diperoleh dengan menjalankan perintah. Perilaku persistensi, otorisasi lewat HTTP, koneksi Redis, responsivitas visual, performa, dan aksesibilitas masih perlu dibuktikan setelah lingkungan aplikasi siap.
