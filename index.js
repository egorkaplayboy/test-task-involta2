function parallelLimit(urls, limit, cb) {
  const uniqueUrls = Array.from(new Set(urls));
  const chunks = [];
  for (let i = 0; i < uniqueUrls.length; i += limit) {
    chunks.push(uniqueUrls.slice(i, i + limit));
  }

  const results = [];

  const fetchChunk = async (chunk) => {
    const promises = chunk.map((url) =>
      fetch(url).then((response) => response.json())
    );
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
  };

  const executeChunks = async () => {
    for (let i = 0; i < chunks.length; i++) {
      await fetchChunk(chunks[i]);
    }
    cb(results);
  };

  executeChunks();
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
const limit = 1;

parallelLimit(urls, limit, (responses) => {
  console.log(responses);
});
