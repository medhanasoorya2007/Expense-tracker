export function groupByCategory(records) {
  const totals = records.reduce((result, record) => {
    const category = record.category || "Other";
    result[category] = (result[category] || 0) + Number(record.amount || 0);
    return result;
  }, {});

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

export function groupByMonth(records, key, months = 6) {
  const now = new Date();
  const dates = Array.from({ length: months }, (_, index) => new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1));
  const totals = records.reduce((result, record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    result[monthKey] = (result[monthKey] || 0) + Number(record.amount || 0);
    return result;
  }, {});

  return dates.map((date) => ({
    name: date.toLocaleString("en-IN", { month: "short" }),
    [key]: totals[`${date.getFullYear()}-${date.getMonth()}`] || 0,
  }));
}
