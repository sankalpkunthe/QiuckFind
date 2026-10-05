class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let current = this.root;

        for(const char of word) {
            if(!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }

            current = current.children.get(char);
        }

        current.isEnd = true;
    }

    searchPrefix(prefix, limit=10) {
        let current = this.root;

        for(const char of prefix) {
            if(!current.children.has(char)) {
                return [];
            }

            current = current.children.get(char);
        }

        const results = [];

        this.collectWords(current, prefix, results, limit);

        return results;
    }

    collectWords(current, prefix, results, limit) {
        if(results.length >= limit) return;

        if(current.isEnd) {
            results.push(prefix);
        }

        for(const [char, childNode] of current.children) {
            if(results.length >=limit) break;
            this.collectWords(childNode, prefix+char, results, limit);
        }
    }

    searchFuzzy(query, maxi = 2, limit = 10) {
        const results = [];

        const initialRow = [];

        for(let i=0; i<=query.length; i++) {
            initialRow.push(i);
        }

        this.searchFuzzyRecursive(this.root, "", query, initialRow, maxi, results, limit);
        
        return results;
    }

    searchFuzzyRecursive(node, current, query, previousRow, maxi, results, limit) {
        if(results.length>= limit) return;

        for(const [char, childNode] of node.children) {
            const currentRow = [previousRow[0] + 1];

            for (let i = 1; i <= query.length; i++) {
                const insertion = currentRow[i - 1] + 1;
                const deletion = previousRow[i] + 1;
                const replacement = previousRow[i - 1] + (query[i - 1] === char ? 0 : 1);
                currentRow[i] = Math.min(insertion, deletion, replacement);
            }

            const newWord = current + char;

            const rowMinimum = Math.min(...currentRow);

            if(rowMinimum > maxi) continue;

            if(childNode.isEnd && currentRow[query.length]<=maxi) {
                results.push({word: newWord,
                    distance: currentRow[query.length]
                });

                if(results.length >=limit) return;
            }
            this.searchFuzzyRecursive(childNode, newWord, query, currentRow, maxi, results, limit);
        }
    }
}

module.exports = Trie;