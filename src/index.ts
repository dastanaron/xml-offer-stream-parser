import fs from 'fs';
import path from 'path';

import {download} from "./File/Download";
import TagExtractor from "./XML/TagExtractor";


(async () => {
    const tempFile = path.resolve(__dirname, '../', 'example', 'downloaded_.q5kdo407b.xml');//await download('https://samoletgroup.ru/feed/yandex-novos', 'xml');
    const stream = fs.createReadStream(tempFile, { encoding: 'utf8', highWaterMark: 1024 });

    const parsingTag = 'offer';

    const extractor = new TagExtractor(parsingTag);
    stream.pipe(extractor);

    extractor.on('data', (offer: string) => {
        console.log(offer);
    });

    stream.on('end', () => {
        console.log('parsing completed');
    })

})();

