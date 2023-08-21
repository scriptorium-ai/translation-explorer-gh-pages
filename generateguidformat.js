const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const fs = require('fs');

let files = ['copernicus.json', 'discourseonthetides.json'];

let generateFolder = (fileName) => {
    let fileText = fs.readFileSync(fileName, 'utf-8');
    let fileJson = JSON.parse(fileText);

    let fileId = randomUUID();
    let chapterId = randomUUID();

    let filePath = `./${fileId}`;

    fs.mkdirSync(filePath);

    let indexPath = `${filePath}/index.json`;

    let index = {
        title: fileJson.title,
        original_language: fileJson.paragraphs[0].languages[0].language.toLowerCase(),
        chapter_ids: [chapterId],
        author: fileJson.author,
        year: fileJson.year
    }

    fs.writeFileSync(indexPath, JSON.stringify(index), 'utf-8');

    let languages = fileJson.paragraphs[0].languages.map(l => l.language.toLowerCase());

    let notes = [];

    let languageSplit = languages.map(l => {
        return {
            language: l,
            paragraphs: []
        }
    });

    for(var i = 0; i < fileJson.paragraphs.length; i++){
        let paragraph = fileJson.paragraphs[i];

        for(var j = 0; j < paragraph.languages.length; j++){
            let languageJ = paragraph.languages[j];
            let language = languageJ.language.toLowerCase();

            let lines = [];

            for(var k = 0; k < languageJ.lines.length; k++){
                let line = languageJ.lines[k];

                lines.push(line.text);

                notes.push(...line.notes.map(n => {
                    return {
                        bookId: fileId,
                        chapterId: chapterId,
                        id: randomUUID(),
                        lineInParagraph: k,
                        lineInChapter: line.lineNumber,
                        line: line.lineNumber,
                        language: language,
                        note: n
                    }
                }))
            }

            languageSplit.filter(l => l.language == language)[0].paragraphs.push(lines);
        }
    }

    for(var i = 0; i < languageSplit.length; i++){
        fs.mkdirSync(`${filePath}/${languageSplit[i].language}`);
        let chapterPath = `${filePath}/${languageSplit[i].language}/${chapterId}.json`

        let chapter = {
            title: '',
            paragraphs: languageSplit[i].paragraphs
        };

        fs.writeFileSync(chapterPath, JSON.stringify(chapter), 'utf-8');
    }

    let notePath = `${filePath}/notes.json`

    fs.writeFileSync(notePath, JSON.stringify(notes), 'utf-8');
}

for(var i = 0; i < files.length; i++){
    generateFolder(files[i]);
}

// {title: '', paragraphs: ''};

// index
// {
//     "title": "PROOEMIUM SANCTI BONAVENTURAE IN LIBRUM PRIMUM SENTENTIARUM.",
//     "original_language": "latin",
//     "chapter_ids": [
//       "1dca1752-e1da-4875-b8f3-70a522f40128",
//       "46a2b2bc-b338-4cbb-a165-9bed6ca6a012",
//       "4581744d-accb-45fb-9204-d1569018a944",
//       "0b2a08fb-69b7-46ef-b97e-05c74b4a8bf7"
//     ]
//   }