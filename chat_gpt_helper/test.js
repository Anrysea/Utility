const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const firstTenChars = data.substring(0, 22)
    console.log(firstTenChars.slice(0, -1));


});