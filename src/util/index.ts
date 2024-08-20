import { load } from 'cheerio';

export function extractMovieDetails(htmlTable: string): string {
  const $ = load(htmlTable);
  const tableData: string[][] = [];

  const headers: string[] = [];
  $('th').each((_, th) => {
    headers.push($(th).text().trim());
  });
  tableData.push(headers);

  $('tr').each((rowIndex, row) => {
    if (rowIndex === 0) return;
    const cols: string[] = [];
    $(row)
      .find('td')
      .each((_, td) => {
        cols.push($(td).text().trim());
      });
    tableData.push(cols);
  });

  return tableData.map((row) => row.join(' | ')).join('\n');
}
