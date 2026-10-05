const Trie = require("./Trie");

class SearchEngine {
    constructor(words) {
        this.trie = new Trie();

        for (const word of words) {
            this.trie.insert(word);
        }
    }

    search(query, limit = 10) {
        query = query.toLowerCase().trim();

        if (!query) {
            return [];
        }

        const results = [];
        const prefixMatches = this.trie.searchPrefix(query, limit);

        for (const word of prefixMatches) {
            results.push({word, distance: 0, type: "prefix"});
        }

        const fuzzyMatches = this.trie.searchFuzzy(query, 2, 100);

        for (const result of fuzzyMatches) {
            if (!results.some(item => item.word === result.word)) {
                results.push({word: result.word, distance: result.distance, type: "fuzzy"});
            }
        }

        results.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === "prefix" ? -1 : 1;
            }
            
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            }

            if (a.word.length !== b.word.length) {
                return a.word.length - b.word.length;
            }

            return a.word.localeCompare(b.word);
        });

        return results.slice(0, limit);
    }
}

module.exports = SearchEngine;