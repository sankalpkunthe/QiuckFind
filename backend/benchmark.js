const { performance } = require("perf_hooks");
const SearchEngine = require("./search/searchEngine");

const baseWords = [
    "apple",
    "application",
    "apply",
    "app",
    "banana",
    "bank",
    "basket",
    "strawberry",
    "staberry",
    "station",
    "status",
    "standard",
    "street",
    "student",
    "study"
];

function createDataset(size) {
    const words = [];

    for (let i = 0; i < size; i++) {
        const baseWord = baseWords[i % baseWords.length];

        words.push(`${baseWord}${i}`);
    }

    return words;
}

const sizes = [
    1000,
    10000,
    50000,
    100000
];

function benchmark(engine, query, iterations = 100) {

    // Warm-up
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

    const words = createDataset(size);

    const engine = new SearchEngine(words);

    const averageTime =
        benchmark(
            engine,
            "stawberry",
            100
        );

    console.log(
        `Dataset: ${size}`,
        `Average: ${averageTime.toFixed(3)} ms`
    );
}