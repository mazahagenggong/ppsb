// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import puppeteer from 'puppeteer'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Buat HTML yang akan dimasukkan ke dalam halaman
    const htmlContent = `
<html lang="en">
  <body>
    <center>
      <img src="http://localhost:3000/assets/img/kop.jpg" style="width: 80vw; height: 20vw" alt="kop" />
    </center>
    <p>Test</p>
  </body>
</html>
    `;

    // Masukkan HTML ke dalam halaman
    await page.setContent(htmlContent, {waitUntil: 'networkidle0'});


    const pdfBuffer = await page.pdf({format: 'a4'});
    // Ganti nama file menjadi data.pdf
    res.setHeader('Content-disposition', 'attachment; filename=data.pdf');
    res.send(pdfBuffer);

    await browser.close();
}
