document.getElementById("filterBtn").addEventListener("click", fetchTickers);

document.addEventListener("DOMContentLoaded", () => {
  fetchTickers();
});

async function fetchTickers() {
  const baseUnit = document.getElementById("baseUnit").value;
  const quoteUnit = document.getElementById("quoteUnit").value;

  try {
    const response = await fetch(
      `/api/tickers?base_unit=${baseUnit}&quote_unit=${quoteUnit}`
    );
    const tickers = await response.json();
    displayTickers(tickers);
  } catch (error) {
    console.error("Error fetching ticker data:", error);
  }
}

function displayTickers(tickers) {
  const tickerTable = document.getElementById("tickerTable");
  let tableContent = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Last Traded Price</th>
          <th>Average Net Price</th>
          <th>Difference</th>
          <th>Savings (%)</th>
        </tr>
      </thead>
      <tbody>
  `;

  tickers.forEach((ticker) => {
    tableContent += `
      <tr>
        <td>${ticker.name}</td>
        <td>${ticker.last}</td>
        <td>${ticker.avgNetPrice}</td>
        <td>${ticker.difference}</td>
        <td>${ticker.savings}</td>
      </tr>
    `;
  });

  tableContent += `
      </tbody>
    </table>
  `;

  tickerTable.innerHTML = tableContent;
}
