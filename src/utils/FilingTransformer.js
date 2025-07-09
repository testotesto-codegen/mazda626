export const  organizeFilingsByPeriod = (filings) => {
  const result = {};

  filings.forEach(filing => {
    // Extract year and quarter from report_date
    const date = new Date(filing.report_date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const quarter = Math.ceil(month / 3);

    if (!result[year]) {
      result[year] = {};
    }

    if (!result[year][`Q${quarter}`]) {
      result[year][`Q${quarter}`] = {};
    }

    if (!result[year][`Q${quarter}`][filing.form]) {
      result[year][`Q${quarter}`][filing.form] = [];
    }

    result[year][`Q${quarter}`][filing.form].push(filing);
  });

  return result;
}
