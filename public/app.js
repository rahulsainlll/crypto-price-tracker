async function fetchData(baseUnit = "btc", quoteUnit = "inr") {
  try {
    const response = await fetch(
      `/api/tickers?base_unit=${baseUnit}&quote_unit=${quoteUnit}`
    );
    const data = await response.json();

    const buyPrice = parseFloat(data.buy);
    const sellPrice = parseFloat(data.sell);
    const lastPrice = parseFloat(data.last);
    const avgNetPrice = (buyPrice + sellPrice) / 2;
    const difference = ((lastPrice - avgNetPrice) / avgNetPrice) * 100;
    const savings = lastPrice - buyPrice;

    document.getElementById("best-price").innerText = `₹ ${buyPrice.toFixed(
      2
    )}`;
    document.getElementById("wazirx-last").innerText = `₹ ${lastPrice.toFixed(
      2
    )}`;
    document.getElementById(
      "wazirx-buy-sell"
    ).innerText = `₹ ${buyPrice.toFixed(2)} / ₹ ${sellPrice.toFixed(2)}`;
    document.getElementById(
      "wazirx-difference"
    ).innerText = `${difference.toFixed(2)}%`;
    document.getElementById("wazirx-savings").innerText = `₹ ${savings.toFixed(
      2
    )}`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.getElementById("filterBtn").addEventListener("click", () => {
  const baseUnit = document.getElementById("baseUnit").value;
  const quoteUnit = document.getElementById("quoteUnit").value;
  fetchData(baseUnit, quoteUnit);
});

fetchData();
setInterval(() => {
  const baseUnit = document.getElementById("baseUnit").value;
  const quoteUnit = document.getElementById("quoteUnit").value;
  fetchData(baseUnit, quoteUnit);
}, 45000);
