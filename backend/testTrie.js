const Trie = require("./search/Trie");

const trie = new Trie();

trie.insert("apple");
trie.insert("application");
trie.insert("apply");
trie.insert("banana");
trie.insert("strawberry");
trie.insert("station");
trie.insert("street");
trie.insert("student");

console.log(
    trie.searchFuzzy("strrawberry", 2, 10)
);