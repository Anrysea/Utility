const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const fs = require('fs');




(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        args: [
            ...chromium.args,
            `--user-data-dir=C:/Users/anrys/AppData/Local/Google/Chrome/User Data`,
            `--gl=egl-angle`,
            `--gl=egl-angle`,
        ],

        defaultViewport: chromium.defaultViewport,
    });

    const add = `Мне нужнно написать определение кандзи в формате -- **"сам кандзи"\\"список его чтений через запятую(только часто используемых чтений, если чтение устарело или слова с ним очень редко используются в текстах, то его вносить не нужно)"\\"обобщенное значение кандзи на русском языке"\\ "4 часто используемых слова с этим кандзи НА РАЗНЫЕ ЧТЕНИЯ. ПРОСТЫЕ И ПОПУЛЯРНЫЕ СЛОВА В ПРИОРИТЕТЕ. к каждому слову нужен перевод на русский язык. вот формат "слово(перевод к слову)x"" ** . Пример: ** 全\\ゼン,まった(く),すべ(て)\\весь, полный, всеобъемлющий\\全部(всё, полностью), 全然(совсем, абсолютно), 全く(в самом деле,совершенно), 全て(всё)x** . Напиши только в таком формате, без номеров и лишних сообщений. В конце каждой строчки ставь "x". Сами кандзи - "`

    const page = await browser.newPage();
    await page.goto('https://chat.openai.com/?model=gpt-4');
    await new Promise(resolve => setTimeout(resolve, 5000));

    async function sendMessage(page, message) {
        await page.waitForSelector('textarea[tabindex="0"]');
        await page.waitForSelector('button[class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"]');
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.evaluate(() => {
            const sendButton = document.querySelector('button[class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"]');
            sendButton.removeAttribute('disabled');
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.type('textarea[tabindex="0"]', message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.click('button[class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"]');
    }

    async function checkResponse(page) {
        await page.waitForSelector('div.flex.flex-col.items-center.text-sm.dark\\:bg-gray-800');

        const lastMessage = await page.evaluate(() => {
            const messagesContainer = document.querySelector('div.flex.flex-col.items-center.text-sm.dark\\:bg-gray-800');
            const messages = Array.from(messagesContainer.children).filter(msg => msg.querySelector('.markdown.prose'));
            const lastMessageElement = messages[messages.length - 1];

            return lastMessageElement.querySelector('.markdown.prose').textContent;
        });

        return lastMessage;
    }

    const inputFileContent = fs.readFileSync('input.txt', 'utf-8');
    const messageParts = inputFileContent.match(/.{1,20}/g);

    for (const message of messageParts) {
        const correctMessage = add + message.slice(0, -1) + `"`
        await sendMessage(page, correctMessage);
        await new Promise(resolve => setTimeout(resolve, 240000));

        const response = await checkResponse(page);

        const outputLines = response.split('x');
        const outputContent = outputLines.join('\n');
        fs.appendFileSync('output.txt', outputContent + '\n', 'utf-8');
        console.log('Ответ записан в файл output.txt');


        await new Promise(resolve => setTimeout(resolve, 200000));
    }

    await browser.close();
})();
