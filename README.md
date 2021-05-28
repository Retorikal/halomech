# BUILD INSTRUCTIONS

Instruksi tidak jelas dibuka via notepad? Akses di [github](https://github.com/Retorikal/halomech)

## Server
### Prerequisite
1. Pastikan InfluxDB sudah menyala.
2. Buat database di influx dengan perintah `CREATE DATABASE iot_motor`

### Build and Run
Di folder `./server`:
1. `npm i`
2. `node init`
	* Server akan menyala di `localhost:3000`. Akses via browser.
3. `node tests/populate_db testdata.csv`
    * Ini digunakan untuk menambahkan data sungguhan yang sudah diambil ke database.
4. `node tests/motor_sim myMotor`
    * Ini digunakan untuk menambahkan data simulasi ke database. Tekan `ctrl + c` setelah data yang ditambahkan dirasa cukup.

### Penggunaan

Ketik nama motor di navbar, lalu klik `Change`. Data getaran, RPM, dan Mileage dari motor tersebut akan ditampilkan.
* Dari prosedur build seharusnya sudah ada motor bernama `myMotor` dan `livetest`.

## Client

![Client](client.png?raw=true "Client")

**Bagian ini khusus jika hendak dilakukan perubahan pada antarmuka klien.**

Server sudah punya varian rilis dari antarmuka klien.

### Build

Di folder client:
1. `npm i`
2. `npm start` Tahap ini akan memakan waktu agak lama.
3. Konfirmasi saat muncul pertanyaan `Would you like to run the app on another port instead?`.
    * Bagian ini disebabkan oleh port 3000 yang sudah digunakan oleh antarmuka REST. 
	* Server sudah dikonfigurasi untuk mengarahkan permintaan ke port 3000 di `package.json`.
