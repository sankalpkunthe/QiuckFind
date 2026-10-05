const fs = require("fs");
const { performance } = require("perf_hooks");
const SearchEngine = require("./search/searchEngine");

const words = JSON.parse(fs.readFileSync("./data/words.json", "utf-8"));

const sizes = [1000, 10000, 50000, 100000];

const queries = ["app", "stawberry", "xyzxyz"];

function benchmark(engine, query, iterations = 100) {
    for (let i = 0; i < 10; i++) {
        engine.search(query);
    }

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        engine.search(query);
    }

    const end = performance.now();
    return (end - start) / iterations;
}

for (const size of sizes) {
    if (size > words.length) {
        continue;
    }

    console.log(`\nDataset: ${size}`);
    const dataset = words.slice(0, size);
    const engine = new SearchEngine(dataset);

    for (const query of queries) {
        const time = benchmark(engine, query);

        console.log(`${query.padEnd(12)} ${time.toFixed(3)} ms`);
    }
}