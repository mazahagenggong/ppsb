FROM node:20-alpine

# Membuat direktori kerja di dalam container
WORKDIR /usr/src/app

# Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Salin file Prisma
COPY prisma prisma/

# Menginstal dependensi Node.js
RUN npm install

# Generate Prisma client setelah npm install
RUN npx prisma generate

# Menjalankan aplikasi dalam mode pengembangan
CMD ["npx", "prisma", "generate"]
CMD ["npm", "run", "dev"]

#docker run -p 3000:3000 -v /run/media/mazaha/Data/new/ppsb/ppsb/:/usr/src/app -d ppsb