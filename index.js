const cache = new Map();

async function parallelLimit(urls, limit, cb) {
  const cacheKey = urls.join("-");
  if (cache.has(cacheKey)) {
    return cb(cache.get(cacheKey));
  }

  const uniqueUrls = Array.from(new Set(urls));
  const results = [];

  for (let i = 0; i < uniqueUrls.length; i += limit) {
    const chunk = uniqueUrls.slice(i, i + limit);
    const chunkResults = await Promise.all(
      chunk.map((url) => fetch(url).then((response) => response.json()))
    );
    results.push(...chunkResults);
  }

  cache.set(cacheKey, results);
  cb(results);
}

const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
  "https://jsonplaceholder.typicode.com/posts/3",
  "https://jsonplaceholder.typicode.com/posts/4",
  "https://jsonplaceholder.typicode.com/posts/5",
  "https://jsonplaceholder.typicode.com/posts/5",
];
const limit = 2;

parallelLimit(urls, limit, (responses) => {
  console.log(responses);
});

