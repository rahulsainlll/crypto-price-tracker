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

    // update elem with fetched data
    document.getElementById("best-price").innerText = `₹ ${buyPrice.toFixed(
      2
    )}`;
    document.getElementById("wazirx-last").innerText = `₹ ${lastPrice.toFixed(
      2
    )}`;
    document.getElementById(
      "wazirx-buy-sell"
    ).innerText = `₹ ${buyPrice.toFixed(2)} / ₹ ${sellPrice.toFixed(2)}`;

    // Update difference and savings 
    const wazirxDifferenceElem = document.getElementById("wazirx-difference");
    const wazirxSavingsElem = document.getElementById("wazirx-savings");
    wazirxDifferenceElem.innerText = `${difference.toFixed(2)}%`;
    wazirxSavingsElem.innerText = `₹ ${savings.toFixed(2)}`;

    // set color
    if (difference >= 0) {
      wazirxDifferenceElem.classList.add("green-colour");
      wazirxSavingsElem.classList.add("green-colour");
    } else {
      wazirxDifferenceElem.classList.add("red-colour");
      wazirxSavingsElem.classList.add("red-colour");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// dark-mode
const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

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
