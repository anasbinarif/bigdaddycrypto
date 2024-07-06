async function getCoins() {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/list', {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error('Failed to fetch coin data');
  }
  return await response.json();
}

export default getCoins;