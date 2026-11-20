# Avero — Brief rebranding visual

**Arah yang diusulkan** · Avero sebagai toko perlengkapan olahraga dengan karakter editorial. Beranda membawa energi kampanye olahraga. Katalog, detail, dan checkout memberi ruang pada produk dan keputusan belanja. Targetnya, pengunjung baru langsung paham apa yang dijual dan bisa menemukan katalog dari layar pertama.

## Temuan dari MotionSites

| Referensi | Yang terlihat | Adaptasi untuk Avero |
| --- | --- | --- |
| [Vertex](https://motionsites.ai/?prompt=vertex) | Hero gelap dengan headline putih besar dan aksen cyan. Kartu bergerak dalam perspektif melengkung. Mockup toko di depan kartu memberi kedalaman. | Beri satu fokus visual di layar pertama. Gunakan produk olahraga asli dari katalog sebagai subjek dan susun pencahayaan serta lapisan yang khas Avero. |
| [Outfit Carousel](https://motionsites.ai/?prompt=outfit-carousel) | Tampilan terang dengan satu look tajam di tengah, look lain lebih lembut di sekitarnya. Panel sebelahnya memperlihatkan item, harga, dan aksi. | Buat pilihan koleksi yang bisa digeser. Arahkan setiap pilihan ke produk atau filter nyata, dengan harga dan tindakan yang jelas. |
| [Performance Eyewear](https://motionsites.ai/?prompt=performance-eyewear) | Foto close-up atlet dan kacamata mendominasi bingkai. Komposisinya memberi karakter bahkan sebelum ada gerakan. | Buat foto kampanye dengan framing dekat, tekstur material, dan ruang untuk teks. Temuan ini berasal dari pratinjau publik. |

### Pelajaran dari prompt Vertex

Prompt Vertex menjelaskan komposisi, urutan lapisan, dan hasil yang harus diperiksa. Ia menetapkan geometri carousel, mengatur siklus animasi, serta memisahkan koreografi masuk dari gerak ambien. Urutannya membawa perhatian dari navigasi dan judul ke tombol, lalu ke lapisan visual di bawah. Prompt juga menjelaskan pendekatan berbeda untuk ponsel, dukungan keyboard untuk menu, gambar cadangan, dan cara menghentikan gerakan lewat `prefers-reduced-motion`. [Sumber prompt](https://motionsites.ai/?prompt=vertex).

Pendekatan yang diambil untuk Avero adalah menuliskan perilaku, durasi, kondisi statis, dan kriteria review sebelum membuat animasi. Vertex membuat satu hero statis dalam dokumen satu layar dengan kanvas desktop berskala. Avero perlu halaman yang mengalir normal, katalog yang datanya berubah, serta formulir yang tetap dapat digunakan pada ukuran teks besar. Gunakan layout responsif di React dan batasi posisi absolut pada lapisan dekoratif hero.

## Arah visual dan konten

- **Identitas** · Wordmark Avero yang tegas, warna grafit dan putih hangat, dengan satu aksen hijau volt untuk tombol utama dan indikator aktif. Uji kontras sebelum mengunci palet. Kandidat font adalah Barlow Condensed untuk headline dan Geist untuk antarmuka.
- **Foto** · Satu foto kampanye lebar dan crop khusus mobile. Arah utama bisa dimulai dari adegan badminton atau tenis karena raket dan sepatu tersedia di katalog. Siapkan foto kategori dan potongan produk dengan skala, cahaya, dan latar yang konsisten. Foto kampanye boleh editorial. Foto kartu dan detail harus tetap mewakili barang yang dipilih.
- **Pesan** · Contoh headline eksplorasi adalah “Gear for the way you play.” Sebut jenis produk dalam deskripsi singkat. Gunakan satu CTA dominan menuju katalog. Ganti judul New Arrivals dengan Featured Gear jika belum ada data tanggal rilis. Tandai sifat demo di tempat yang relevan, terutama checkout.
- **Ritme beranda** · Hero grafit → kategori atau koleksi pilihan → grid produk unggulan di permukaan terang → satu panel cerita brand → footer. Kategori ditautkan langsung ke filter katalog.

## Sistem motion

| Area | Gerak yang diusulkan | Mobile dan kondisi statis |
| --- | --- | --- |
| Hero | Judul masuk singkat dalam dua baris, CTA siap digunakan, lalu satu produk muncul dari lapisan cahaya atau perspektif. | Pertahankan CTA sejak awal. Pada ponsel, buat komposisi vertikal dengan crop yang dirancang khusus. Pada reduced motion, tampilkan komposisi akhir langsung. |
| Koleksi | Perpindahan fokus pada produk yang dipilih. Tiap adegan berakhir di posisi yang stabil dengan nama kategori terlihat. | Swipe opsional dengan tombol sebelumnya/berikutnya. Kontrol dapat dipakai via keyboard. Konten tetap tersedia sebagai daftar mendatar saat gerakan dikurangi. |
| Katalog dan detail | Reveal singkat untuk section, zoom gambar pada hover, pergantian gambar dan feedback tambah ke tas. | Harga, stok, dan tombol langsung terlihat. Fokus keyboard dan interaksi sentuh memiliki feedback yang setara. |
| Tas dan checkout | Panel tas dan perubahan jumlah memberi respons singkat. Konfirmasi sukses punya satu reveal ringan. | Nama kolom, input, ringkasan, dan error tetap stabil. Pertahankan opsi lihat pesanan dan kembali belanja. |

Mulai dengan CSS untuk hover, fokus, dan transisi. Pakai satu pustaka animasi hanya jika koreografi hero benar-benar membutuhkannya. Muat efek berat setelah hero bisa digunakan. Preferensikan transformasi dan opacity, hentikan efek ambien ketika elemen keluar layar atau tab disembunyikan, dan gunakan gambar dengan ukuran yang sesuai perangkat. Prototipe pertama dapat menghasilkan kedalaman dengan CSS perspektif. Jadikan 3D interaktif opsi setelah pengujian perangkat.

## Urutan pengerjaan

1. **Kunci arah visual.** Buat wordmark dan token warna, font, jarak, radius, serta aturan motion. Siapkan aset hero dan foto koleksi. Hasil pertama yang bisa dinilai adalah satu prototipe hero desktop dan mobile dengan tombol yang berfungsi.
2. **Bangun storefront.** Terapkan shell, navigasi, footer, beranda, koleksi, katalog, dan detail. Uji alur pilih kategori → lihat produk → tambah ke tas. Gunakan data dan route yang tersedia.
3. **Terapkan ke seluruh alur.** Tata ulang tas, login, registrasi, checkout simulasi, konfirmasi, riwayat, detail pesanan, halaman bantuan dan error. Admin mendapat warna dan tipografi yang sama dengan prioritas keterbacaan. Pertahankan kontrak API, perhitungan stok, dan status pesanan.
4. **Uji preview dan terbitkan.** Bandingkan desktop dan ponsel, cek keyboard, kontras, reduced motion, kegagalan aset, dan koneksi lambat. Ukur sebelum/sesudah pada build produksi. Jalankan ulang alur katalog hingga pesanan dan admin sebelum mengganti rilis Caddy.

## Kriteria review

- Dalam lima detik, pengunjung bisa menyebut bahwa Avero menjual perlengkapan olahraga dan menemukan tombol menuju katalog.
- Hero tetap terbaca pada lebar 320 px, tanpa scroll horizontal atau tombol tertutup. Pengguna keyboard dapat mencapai semua tindakan penting.
- Toko tetap dapat digunakan ketika mode reduced motion aktif atau visual hero gagal dimuat. Harga dan stok tampil sepanjang alur. Checkout tetap berupa simulasi.
- Ukur mobile sebelum dan sesudah. Sasaran peluncuran adalah LCP ≤ 2,5 detik, CLS ≤ 0,1 dan INP ≤ 200 ms. Gunakan pengujian lab sebelum rilis dan nilai data lapangan setelah sampelnya cukup. [Definisi Core Web Vitals](https://web.dev/articles/vitals).

## Aset kampanye yang digunakan

Kedua foto dibuat dengan ImageGen bawaan. Hasilnya diproses menjadi WebP untuk situs, dan hero mendapat crop tersendiri untuk ponsel. Foto kampanye melengkapi foto katalog yang dipakai pada halaman produk.

| Berkas | Pemakaian |
| --- | --- |
| `client/public/images/avero/court-hero.webp` | Hero desktop, 1536 px lebar |
| `client/public/images/avero/court-mobile.webp` | Crop gambar yang sama untuk hero ponsel, 680 px lebar |
| `client/public/images/avero/court-study.webp` | Panel editorial, halaman akun, dan halaman tentang Avero |

## Hasil verifikasi rilis

- Rilis live memuat hero, foto kampanye WebP, tautan detail produk, 35 produk, dan respons 401 untuk akses pesanan anonim.
- Uji browser lokal mencakup katalog hingga pembatalan pesanan demo, menu ponsel dengan keyboard, serta lebar 320 px tanpa overflow horizontal pada beranda dan katalog.
- Lighthouse mobile lokal mencatat skor performa 94, LCP 2,88 detik, CLS 0,007, dan TBT 132 ms pada build yang dipilih. Pada preview lama, sampel mencatat skor 96, LCP 2,17 detik, dan CLS 0,052. Kedua sampel memakai server lokal yang berbeda sehingga angka ini hanya pembanding awal. LCP belum mencapai sasaran 2,5 detik dan INP lapangan belum diukur. Percobaan preload foto dan pemecahan lebih banyak rute tidak meningkatkan LCP pada sampel tersebut.

**Prompt hero**

> Generate one wide 3:2 photorealistic sports fashion campaign photograph for Avero, a premium court sport gear storefront. It will be used behind website text. Editorial sports photography, near-black graphite indoor badminton court, small chartreuse/volt green light accents reflected off a midnight green rubber floor, crisp white side lighting, analog grain, believable athlete anatomy, dramatic recognizable sports action. On the RIGHT 60% of the image only: one young adult Southeast Asian female badminton athlete with dark hair pulled back, in black lightweight technical short-sleeved shirt and black shorts, white crew socks and chalk-white court shoes, in an energetic wide low lunge facing slightly left, her body fully visible from head to shoes, right arm extended diagonally towards one realistic badminton racket above and in front of her, white shuttlecock just ahead of racket. Athlete and action centered near 66% x, no cropping of her face; screen-right backlight on arms. Court lines and edge light give depth. LEFT 38% largely empty very dark charcoal, shadows with unobtrusive court texture, natural photographic transition, open for large off-white text to be added later. Useful crop centered on the athlete on phone. Premium brand campaign with striking contrast and fast shutter, understated acid green accents, no floating UI, no lettering, no text, no logos, no trademark, no collage, no watermarks.

**Prompt foto editorial**

> Generate one wide 3:2 photorealistic premium sports editorial still life for Avero, graphite / bone / subtle acid green art direction. Photographed close to the floor: one black badminton racket with luminous soft white strings and a single real white feather shuttlecock, both on charcoal court surface with a hard diagonal pale floor boundary line. Close-up tangible textured feather and racket detail. Strong lateral light, moody shadow, editorial asymmetrical crop and shallow depth of field, modern sports campaign, high quality natural photography. Place objects in upper right and center, easy to use as a wide image crop. Photography only. No people, no lettering, no logos, no graphics, no watermarks.
