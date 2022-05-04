import enWords from  './resources/en/4words.json';
import enFreqs from  './resources/en/4freqs.json';

import plWords from  './resources/pl/4words.json';
import plFreqs from  './resources/pl/4freqs.json';

import itWords from './resources/it/4words.json';
import itFreqs from './resources/it/4freqs.json';

const Database = {};

Database['en'] = {"words": enWords, 
              "freqs": enFreqs};
Database['it'] = {"words": itWords, 
                "freqs": itFreqs};
Database['pl'] = {"words": plWords, 
                  "freqs": plFreqs};

export default Database;





