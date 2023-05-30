let fs = require('fs');

let text = fs.readFileSync('./copernicusold.json','utf-8');


// expects text in the format:
// {
//     "translations": {
//       "latin": [],
//       "english_literal": []
// }
// and returns in the correct format;

let json = JSON.parse(text);
let italian = json.translations.latin;
let english = json.translations.english_literal;

let paragraphSplit = [5,8,2,2,4,2,2,1,3,4,1,2,1,1,22,4,2,4,4,6,11,2,5,2,3];

let italianWithNotes = italian.map((l, i) => {return {lineNumber: i + 1, text:l, notes:[]}})
let englishWithNotes = english.map((l, i) => {return {lineNumber: i + 1, text:l, notes:[]}})

let paragraphs = [];
let lastLineCounter = 0;

for(var paragraphNum = 0; paragraphNum < paragraphSplit.length; paragraphNum++){
    let newLineCounter = lastLineCounter + paragraphSplit[paragraphNum];

    let paragraph = {
        paragraphNumber: paragraphNum,
        languages: [
            {
                language: "Latin",
                lines: italianWithNotes.slice(lastLineCounter, newLineCounter)
            },
            {
                language: "English",
                lines: englishWithNotes.slice(lastLineCounter, newLineCounter)
            }
        ]
    }

    paragraphs.push(paragraph);

    lastLineCounter = newLineCounter;
}

let textTitle = 'Entry on Copernicus';
let author = "Giovanni Battista Riccioli";

let schema = {
    "type": "Letter",
    title: textTitle,
    author,
    year: 1616,
    paragraphs
}

fs.writeFileSync('copernicus.json', JSON.stringify(schema), 'utf-8');