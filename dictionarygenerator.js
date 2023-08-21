let fs = require('fs');

let text = fs.readFileSync('./discourseonthetides.json', 'utf-8');

let json = JSON.parse(text);

let paragraphLineList = json.paragraphs.map(p => p.languages[0].lines.map(l => l.text).join(' '));

let line = paragraphLineList.join(' ');

let isNumber = str => !isNaN(Number(str));

Array.prototype.unique = function (compareFunc) {
    return this.reduce((a, b) => {
        if(a.every((item) => !compareFunc(item, b))){
            a.push(b);
        }
        return a;
    }, [])
}

let isAllUpper = (str) => str.toUpperCase() == str;

let words = line.replace(/[`'’]/g, ' ').split(' ')
    .map(w => w.replace(/[,.:;()?]/g,""))
    .filter(w => !isNumber(w) && w.length > 2)
    .filter(w => !isAllUpper(w))
    .map(w => w.toLowerCase())
    .unique((a, b) => a == b)
    .sort()

let currentDictionaryText = fs.readFileSync('./italiandictionary.json', 'utf-8');

let currentDictionaryJson = JSON.parse(currentDictionaryText);

let newWords = words.filter(w => currentDictionaryJson.every(e => e.original.toLowerCase() != w));

fs.writeFileSync('./generateddictionary.txt', newWords.join('\n'), 'utf-8');
