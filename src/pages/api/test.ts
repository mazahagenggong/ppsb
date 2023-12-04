// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const apiUrl = "https://us1.pdfgeneratorapi.com/api/v4/documents/generate";
  const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkNzZiMzM5YTk2OGZlZGU0ZGUyNjA2NzQ1OTBmMDFlYmRlMTBiYjQyZjZkNTIwMmJjODRjMmZlYzQyNzU3MmZlIiwic3ViIjoibWF6YWhhZ2VuZ2dvbmczQGdtYWlsLmNvbSIsImV4cCI6MTcwMTQ5Mzk2NH0.sTnWYvX9R6Vm4M3Z11NojRMy95WzFtG8quJJPOcfv1M"; // Ganti dengan API key yang valid

  try {
    const response = await axios.post(apiUrl, {
      template: {
        id: '883072',
        data: { nama: 'MA ZAHA', kode: 'asdada', jk:"lk" },
      },
      format: 'pdf',
      output: 'url',
      name: 'MA ZAHA',
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
}
