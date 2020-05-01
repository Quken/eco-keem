const formatDateForDatabase = dateISOString => {
  const date = new Date(`${dateISOString}`).toLocaleDateString();
  const [month, day, year] = date.split('/');

  return `${year}-${month}-${day}`;
}

module.exports = {
  formatDateForDatabase
}
