async function parallelLimit(urls, limit, cb) {
  const memo = {};
  const results = [];
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
  async function fetchNext() {
    for (let i = 0; i < urls.length; i++) {
      if (results[i] === undefined) {
        await fetchUrl(urls[i], i);
      }
    }
  }
  const fetchPromises = [];
  for (let i = 0; i < limit; i++) {
    fetchPromises.push(fetchNext());
  }
  await Promise.all(fetchPromises);
  cb(results);
}

const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
  "https://jsonplaceholder.typicode.com/posts/3",
];
const limit = 2;
parallelLimit(urls, limit, (responses) => {
  console.log(responses);
});
