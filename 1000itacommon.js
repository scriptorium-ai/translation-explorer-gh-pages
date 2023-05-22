var fs = require('fs');

var text = fs.readFileSync('1000itacommon.csv', 'utf-8');

var lines = text.split('\r\n');

var cells = lines.map(l => l.split(','));

var objects = cells.map(cells => {return {original: cells[1], english: cells[2]}});

fs.writeFileSync('./1000itacommon.json', JSON.stringify(objects), 'utf-8');

console.log(lines.length);