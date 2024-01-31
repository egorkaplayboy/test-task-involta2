async function parallelLimit(urls, limit, cb) {
  const memo = {};
  const results = Array(urls.length).fill(null);
  async function fetchUrl(url, index) {
    if (memo[url]) {
      results[index] = memo[url];
      return;
    }
    const response = await fetch(url);
    const result = await response.json();
    memo[url] = result;
    results[index] = result;
  }
  const fetchAll = async (start) => {
    const batch = urls.slice(start, start + limit);
    const promises = batch.map(async (url, index) => {
      await fetchUrl(url, start + index);
    });
    await Promise.all(promises);
  };
  for (let i = 0; i < urls.length; i += limit) {
    await fetchAll(i);
  }
  cb(results);
}

const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
  "https://jsonplaceholder.typicode.com/posts/3",
];
const limit = 1;

parallelLimit(urls, limit, (responses) => {
  console.log(responses);
});
