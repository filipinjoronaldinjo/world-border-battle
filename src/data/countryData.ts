export interface CountryData {
  name: string;
  borders: string[];
}

// We'll add North and South American countries to our data
export const countryData: { [key: string]: CountryData } = {
  // North America
  "Kanada": {
    name: "Kanada",
    borders: ["Sjedinjene Američke Države"]
  },
  "Sjedinjene Američke Države": {
    name: "Sjedinjene Američke Države",
    borders: ["Kanada", "Meksiko"]
  },
  "Meksiko": {
    name: "Meksiko",
    borders: ["Sjedinjene Američke Države", "Gvatemala", "Belize"]
  },
  "Gvatemala": {
    name: "Gvatemala",
    borders: ["Meksiko", "Belize", "Honduras", "Salvador"]
  },
  "Belize": {
    name: "Belize",
    borders: ["Meksiko", "Gvatemala"]
  },
  "Salvador": {
    name: "Salvador",
    borders: ["Gvatemala", "Honduras"]
  },
  "Honduras": {
    name: "Honduras",
    borders: ["Gvatemala", "Salvador", "Nikaragva"]
  },
  "Nikaragva": {
    name: "Nikaragva",
    borders: ["Honduras", "Kostarika"]
  },
  "Kostarika": {
    name: "Kostarika",
    borders: ["Nikaragva", "Panama"]
  },
  "Panama": {
    name: "Panama",
    borders: ["Kostarika", "Kolumbija"]
  },
  
  // South America
  "Kolumbija": {
    name: "Kolumbija",
    borders: ["Panama", "Venecuela", "Brazil", "Peru", "Ekvador"]
  },
  "Venecuela": {
    name: "Venecuela",
    borders: ["Kolumbija", "Brazil", "Gvajana"]
  },
  "Gvajana": {
    name: "Gvajana",
    borders: ["Venecuela", "Brazil", "Surinam"]
  },
  "Surinam": {
    name: "Surinam",
    borders: ["Gvajana", "Brazil", "Francuska Gvajana"]
  },
  "Francuska Gvajana": {
    name: "Francuska Gvajana",
    borders: ["Surinam", "Brazil"]
  },
  "Brazil": {
    name: "Brazil",
    borders: ["Francuska Gvajana", "Surinam", "Gvajana", "Venecuela", "Kolumbija", "Peru", "Bolivija", "Paragvaj", "Argentina", "Urugvaj"]
  },
  "Ekvador": {
    name: "Ekvador",
    borders: ["Kolumbija", "Peru"]
  },
  "Peru": {
    name: "Peru",
    borders: ["Ekvador", "Kolumbija", "Brazil", "Bolivija", "Čile"]
  },
  "Bolivija": {
    name: "Bolivija",
    borders: ["Peru", "Brazil", "Paragvaj", "Argentina", "Čile"]
  },
  "Paragvaj": {
    name: "Paragvaj",
    borders: ["Bolivija", "Brazil", "Argentina"]
  },
  "Urugvaj": {
    name: "Urugvaj",
    borders: ["Brazil", "Argentina"]
  },
  "Argentina": {
    name: "Argentina",
    borders: ["Čile", "Bolivija", "Paragvaj", "Brazil", "Urugvaj"]
  },
  "Čile": {
    name: "Čile",
    borders: ["Peru", "Bolivija", "Argentina"]
  },
  
  // Europe and the rest of the existing countries...
  "Srbija": {
    name: "Srbija",
    borders: ["Mađarska", "Rumunija", "Bugarska", "Severna Makedonija", "Crna Gora", "Bosna i Hercegovina", "Hrvatska"]
  },
  "Mađarska": {
    name: "Mađarska",
    borders: ["Slovačka", "Ukrajina", "Rumunija", "Srbija", "Hrvatska", "Slovenija", "Austrija"]
  },
  "Rumunija": {
    name: "Rumunija",
    borders: ["Ukrajina", "Moldavija", "Bugarska", "Srbija", "Mađarska"]
  },
  "Bugarska": {
    name: "Bugarska",
    borders: ["Rumunija", "Turska", "Grčka", "Severna Makedonija", "Srbija"]
  },
  "Severna Makedonija": {
    name: "Severna Makedonija",
    borders: ["Srbija", "Bugarska", "Grčka", "Albanija", "Kosovo"]
  },
  "Kosovo": {
    name: "Kosovo",
    borders: ["Srbija", "Severna Makedonija", "Albanija", "Crna Gora"]
  },
  "Crna Gora": {
    name: "Crna Gora",
    borders: ["Hrvatska", "Bosna i Hercegovina", "Srbija", "Kosovo", "Albanija"]
  },
  "Bosna i Hercegovina": {
    name: "Bosna i Hercegovina",
    borders: ["Hrvatska", "Srbija", "Crna Gora"]
  },
  "Hrvatska": {
    name: "Hrvatska",
    borders: ["Slovenija", "Mađarska", "Srbija", "Bosna i Hercegovina", "Crna Gora"]
  },
  "Slovenija": {
    name: "Slovenija",
    borders: ["Italija", "Austrija", "Mađarska", "Hrvatska"]
  },
  "Italija": {
    name: "Italija",
    borders: ["Francuska", "Švajcarska", "Austrija", "Slovenija", "San Marino", "Vatikan"]
  },
  "San Marino": {
    name: "San Marino",
    borders: ["Italija"]
  },
  "Vatikan": {
    name: "Vatikan",
    borders: ["Italija"]
  },
  "Austrija": {
    name: "Austrija",
    borders: ["Nemačka", "Češka", "Slovačka", "Mađarska", "Slovenija", "Italija", "Švajcarska", "Lihtenštajn"]
  },
  "Lihtenštajn": {
    name: "Lihtenštajn",
    borders: ["Švajcarska", "Austrija"]
  },
  "Švajcarska": {
    name: "Švajcarska",
    borders: ["Francuska", "Nemačka", "Austrija", "Lihtenštajn", "Italija"]
  },
  "Francuska": {
    name: "Francuska",
    borders: ["Belgija", "Luksemburg", "Nemačka", "Švajcarska", "Italija", "Monako", "Španija", "Andora"]
  },
  "Monako": {
    name: "Monako",
    borders: ["Francuska"]
  },
  "Španija": {
    name: "Španija",
    borders: ["Francuska", "Andora", "Portugal", "Gibraltar"]
  },
  "Andora": {
    name: "Andora",
    borders: ["Francuska", "Španija"]
  },
  "Portugal": {
    name: "Portugal",
    borders: ["Španija"]
  },
  "Gibraltar": {
    name: "Gibraltar",
    borders: ["Španija"]
  },
  "Nemačka": {
    name: "Nemačka",
    borders: ["Danska", "Poljska", "Češka", "Austrija", "Švajcarska", "Francuska", "Luksemburg", "Belgija", "Holandija"]
  },
  "Belgija": {
    name: "Belgija",
    borders: ["Holandija", "Nemačka", "Luksemburg", "Francuska"]
  },
  "Luksemburg": {
    name: "Luksemburg",
    borders: ["Belgija", "Nemačka", "Francuska"]
  },
  "Holandija": {
    name: "Holandija",
    borders: ["Belgija", "Nemačka"]
  },
  "Češka": {
    name: "Češka",
    borders: ["Nemačka", "Poljska", "Slovačka", "Austrija"]
  },
  "Slovačka": {
    name: "Slovačka",
    borders: ["Poljska", "Ukrajina", "Mađarska", "Austrija", "Češka"]
  },
  "Poljska": {
    name: "Poljska",
    borders: ["Nemačka", "Češka", "Slovačka", "Ukrajina", "Belorusija", "Litvanija", "Rusija"]
  },
  "Danska": {
    name: "Danska",
    borders: ["Nemačka", "Švedska"]
  },
  "Švedska": {
    name: "Švedska",
    borders: ["Norveška", "Finska", "Danska"]
  },
  "Norveška": {
    name: "Norveška",
    borders: ["Finska", "Švedska", "Rusija"]
  },
  "Finska": {
    name: "Finska",
    borders: ["Norveška", "Švedska", "Rusija"]
  },
  "Rusija": {
    name: "Rusija",
    borders: ["Norveška", "Finska", "Estonija", "Letonija", "Litvanija", "Poljska", "Belorusija", "Ukrajina", "Gruzija", "Azerbejdžan", "Kazahstan", "Mongolija", "Kina", "Severna Koreja"]
  },
  "Estonija": {
    name: "Estonija",
    borders: ["Rusija", "Letonija"]
  },
  "Letonija": {
    name: "Letonija",
    borders: ["Estonija", "Rusija", "Belorusija", "Litvanija"]
  },
  "Litvanija": {
    name: "Litvanija",
    borders: ["Letonija", "Belorusija", "Poljska", "Rusija"]
  },
  "Belorusija": {
    name: "Belorusija",
    borders: ["Rusija", "Ukrajina", "Poljska", "Litvanija", "Letonija"]
  },
  "Ukrajina": {
    name: "Ukrajina",
    borders: ["Belorusija", "Rusija", "Moldavija", "Rumunija", "Mađarska", "Slovačka", "Poljska"]
  },
  "Moldavija": {
    name: "Moldavija",
    borders: ["Ukrajina", "Rumunija"]
  },
  "Albanija": {
    name: "Albanija",
    borders: ["Crna Gora", "Kosovo", "Severna Makedonija", "Grčka"]
  },
  "Grčka": {
    name: "Grčka",
    borders: ["Albanija", "Severna Makedonija", "Bugarska", "Turska"]
  },
  "Turska": {
    name: "Turska",
    borders: ["Grčka", "Bugarska", "Gruzija", "Jermenija", "Azerbejdžan", "Iran", "Irak", "Sirija"]
  },
  "Gruzija": {
    name: "Gruzija",
    borders: ["Rusija", "Jermenija", "Turska", "Azerbejdžan"]
  },
  "Jermenija": {
    name: "Jermenija",
    borders: ["Gruzija", "Azerbejdžan", "Iran", "Turska"]
  },
  "Azerbejdžan": {
    name: "Azerbejdžan",
    borders: ["Rusija", "Gruzija", "Jermenija", "Iran"]
  },
  "Iran": {
    name: "Iran",
    borders: ["Turska", "Jermenija", "Azerbejdžan", "Turkmenistan", "Avganistan", "Pakistan", "Irak"]
  },
  "Turkmenistan": {
    name: "Turkmenistan",
    borders: ["Kazahstan", "Uzbekistan", "Avganistan", "Iran"]
  },
  "Kazahstan": {
    name: "Kazahstan",
    borders: ["Rusija", "Kina", "Kirgistan", "Uzbekistan", "Turkmenistan"]
  },
  "Uzbekistan": {
    name: "Uzbekistan",
    borders: ["Kazahstan", "Kirgistan", "Tadžikistan", "Avganistan", "Turkmenistan"]
  },
  "Kirgistan": {
    name: "Kirgistan",
    borders: ["Kazahstan", "Kina", "Tadžikistan", "Uzbekistan"]
  },
  "Tadžikistan": {
    name: "Tadžikistan",
    borders: ["Kirgistan", "Kina", "Avganistan", "Uzbekistan"]
  },
  "Avganistan": {
    name: "Avganistan",
    borders: ["Turkmenistan", "Uzbekistan", "Tadžikistan", "Kina", "Pakistan", "Iran"]
  },
  "Pakistan": {
    name: "Pakistan",
    borders: ["Iran", "Avganistan", "Kina", "Indija"]
  },
  "Indija": {
    name: "Indija",
    borders: ["Pakistan", "Kina", "Nepal", "Butan", "Bangladeš", "Mjanmar"]
  },
  "Kina": {
    name: "Kina",
    borders: ["Rusija", "Mongolija", "Severna Koreja", "Vijetnam", "Laos", "Mjanmar", "Indija", "Butan", "Nepal", "Pakistan", "Avganistan", "Tadžikistan", "Kirgistan", "Kazahstan"]
  },
  "Mongolija": {
    name: "Mongolija",
    borders: ["Rusija", "Kina"]
  },
  "Severna Koreja": {
    name: "Severna Koreja",
    borders: ["Kina", "Rusija", "Južna Koreja"]
  },
  "Južna Koreja": {
    name: "Južna Koreja",
    borders: ["Severna Koreja"]
  },
  "Nepal": {
    name: "Nepal",
    borders: ["Indija", "Kina"]
  },
  "Butan": {
    name: "Butan",
    borders: ["Indija", "Kina"]
  },
  "Bangladeš": {
    name: "Bangladeš",
    borders: ["Indija", "Mjanmar"]
  },
  "Mjanmar": {
    name: "Mjanmar",
    borders: ["Indija", "Bangladeš", "Kina", "Laos", "Tajland"]
  },
  "Tajland": {
    name: "Tajland",
    borders: ["Mjanmar", "Laos", "Kambodža", "Malezija"]
  },
  "Laos": {
    name: "Laos",
    borders: ["Kina", "Mjanmar", "Tajland", "Kambodža", "Vijetnam"]
  },
  "Vijetnam": {
    name: "Vijetnam",
    borders: ["Kina", "Laos", "Kambodža"]
  },
  "Kambodža": {
    name: "Kambodža",
    borders: ["Tajland", "Laos", "Vijetnam"]
  },
  "Malezija": {
    name: "Malezija",
    borders: ["Tajland", "Singapur", "Brunej", "Indonezija"]
  },
  "Singapur": {
    name: "Singapur",
    borders: ["Malezija"]
  },
  "Brunej": {
    name: "Brunej",
    borders: ["Malezija"]
  },
  "Indonezija": {
    name: "Indonezija",
    borders: ["Malezija", "Papua Nova Gvineja", "Istočni Timor"]
  },
  "Istočni Timor": {
    name: "Istočni Timor",
    borders: ["Indonezija"]
  },
  "Papua Nova Gvineja": {
    name: "Papua Nova Gvineja",
    borders: ["Indonezija"]
  },
  "Irak": {
    name: "Irak",
    borders: ["Turska", "Sirija", "Jordan", "Saudijska Arabija", "Kuvajt", "Iran"]
  },
  "Sirija": {
    name: "Sirija",
    borders: ["Turska", "Irak", "Jordan", "Liban", "Izrael"]
  },
  "Jordan": {
    name: "Jordan",
    borders: ["Sirija", "Irak", "Saudijska Arabija", "Izrael"]
  },
  "Liban": {
    name: "Liban",
    borders: ["Sirija", "Izrael"]
  },
  "Izrael": {
    name: "Izrael",
    borders: ["Liban", "Sirija", "Jordan", "Egipat", "Palestina"]
  },
  "Palestina": {
    name: "Palestina",
    borders: ["Izrael", "Egipat", "Jordan"]
  },
  "Egipat": {
    name: "Egipat",
    borders: ["Izrael", "Palestina", "Sudan", "Libija"]
  },
  "Libija": {
    name: "Libija",
    borders: ["Egipat", "Sudan", "Čad", "Niger", "Alžir", "Tunis"]
  },
  "Sudan": {
    name: "Sudan",
    borders: ["Egipat", "Libija", "Čad", "Centralnoafrička Republika", "Južni Sudan", "Etiopija", "Eritreja"]
  },
  "Južni Sudan": {
    name: "Južni Sudan",
    borders: ["Sudan", "Etiopija", "Kenija", "Uganda", "Demokratska Republika Kongo", "Centralnoafrička Republika"]
  },
  "Eritreja": {
    name: "Eritreja",
    borders: ["Sudan", "Etiopija", "Džibuti"]
  },
  "Etiopija": {
    name: "Etiopija",
    borders: ["Eritreja", "Džibuti", "Somalija", "Kenija", "Južni Sudan", "Sudan"]
  },
  "Džibuti": {
    name: "Džibuti",
    borders: ["Eritreja", "Etiopija", "Somalija"]
  },
  "Somalija": {
    name: "Somalija",
    borders: ["Džibuti", "Etiopija", "Kenija"]
  },
  "Kenija": {
    name: "Kenija",
    borders: ["Somalija", "Etiopija", "Južni Sudan", "Uganda", "Tanzanija"]
  },
  "Uganda": {
    name: "Uganda",
    borders: ["Južni Sudan", "Kenija", "Tanzanija", "Ruanda", "Demokratska Republika Kongo"]
  },
  "Ruanda": {
    name: "Ruanda",
    borders: ["Uganda", "Tanzanija", "Burundi", "Demokratska Republika Kongo"]
  },
  "Burundi": {
    name: "Burundi",
    borders: ["Ruanda", "Tanzanija", "Demokratska Republika Kongo"]
  },
  "Tanzanija": {
    name: "Tanzanija",
    borders: ["Kenija", "Uganda", "Ruanda", "Burundi", "Demokratska Republika Kongo", "Zambija", "Malavi", "Mozambik"]
  },
  "Demokratska Republika Kongo": {
    name: "Demokratska Republika Kongo",
    borders: ["Centralnoafrička Republika", "Južni Sudan", "Uganda", "Ruanda", "Burundi", "Tanzanija", "Zambija", "Angola", "Republika Kongo"]
  },
  "Republika Kongo": {
    name: "Republika Kongo",
    borders: ["Gabon", "Kamerun", "Centralnoafrička Republika", "Demokratska Republika Kongo", "Angola"]
  },
  "Centralnoafrička Republika": {
    name: "Centralnoafrička Republika",
    borders: ["Čad", "Sudan", "Južni Sudan", "Demokratska Republika Kongo", "Republika Kongo", "Kamerun"]
  },
  "Kamerun": {
    name: "Kamerun",
    borders: ["Nigerija", "Čad", "Centralnoafrička Republika", "Republika Kongo", "Gabon", "Ekvatorijalna Gvineja"]
  },
  "Gabon": {
    name: "Gabon",
    borders: ["Ekvatorijalna Gvineja", "Kamerun", "Republika Kongo"]
  },
  "Ekvatorijalna Gvineja": {
    name: "Ekvatorijalna Gvineja",
    borders: ["Kamerun", "Gabon"]
  },
  "Čad": {
    name: "Čad",
    borders: ["Libija", "Sudan", "Centralnoafrička Republika", "Kamerun", "Nigerija", "Niger"]
  },
  "Niger": {
    name: "Niger",
    borders: ["Libija", "Čad", "Nigerija", "Benin", "Burkina Faso", "Mali", "Alžir"]
  },
  "Nigerija": {
    name: "Nigerija",
    borders: ["Niger", "Čad", "Kamerun", "Benin"]
  },
  "Benin": {
    name: "Benin",
    borders: ["Niger", "Nigerija", "Togo", "Burkina Faso"]
  },
  "Togo": {
    name: "Togo",
    borders: ["Benin", "Burkina Faso", "Gana"]
  },
  "Burkina Faso": {
    name: "Burkina Faso",
    borders: ["Mali", "Niger", "Benin", "Togo", "Gana", "Obala Slonovače"]
  },
  "Gana": {
    name: "Gana",
    borders: ["Burkina Faso", "Togo", "Obala Slonovače"]
  },
  "Obala Slonovače": {
    name: "Obala Slonovače",
    borders: ["Liberija", "Gvineja", "Mali", "Burkina Faso", "Gana"]
  },
  "Liberija": {
    name: "Liberija",
    borders: ["Sijera Leone", "Gvineja", "Obala Slonovače"]
  },
  "Sijera Leone": {
    name: "Sijera Leone",
    borders: ["Gvineja", "Liberija"]
  },
  "Gvineja": {
    name: "Gvineja",
    borders: ["Gvineja Bisao", "Senegal", "Mali", "Obala Slonovače", "Liberija", "Sijera Leone"]
  },
  "Gvineja Bisao": {
    name: "Gvineja Bisao",
    borders: ["Senegal", "Gvineja"]
  },
  "Senegal": {
    name: "Senegal",
    borders: ["Mauritanija", "Mali", "Gvineja", "Gvineja Bisao", "Gambija"]
  },
  "Gambija": {
    name: "Gambija",
    borders: ["Senegal"]
  },
  "Mali": {
    name: "Mali",
    borders: ["Alžir", "Niger", "Burkina Faso", "Obala Slonovače", "Gvineja", "Senegal", "Mauritanija"]
  },
  "Mauritanija": {
    name: "Mauritanija",
    borders: ["Zapadna Sahara", "Alžir", "Mali", "Senegal"]
  },
  "Alžir": {
    name: "Alžir",
    borders: ["Maroko", "Zapadna Sahara", "Mauritanija", "Mali", "Niger", "Libija", "Tunis"]
  },
  "Tunis": {
    name: "Tunis",
    borders: ["Alžir", "Libija"]
  },
  "Maroko": {
    name: "Maroko",
    borders: ["Alžir", "Zapadna Sahara"]
  },
  "Zapadna Sahara": {
    name: "Zapadna Sahara",
    borders: ["Maroko", "Alžir", "Mauritanija"]
  },
  "Angola": {
    name: "Angola",
    borders: ["Demokratska Republika Kongo", "Republika Kongo", "Zambija", "Namibija"]
  },
  "Zambija": {
    name: "Zambija",
    borders: ["Demokratska Republika Kongo", "Tanzanija", "Malavi", "Mozambik", "Zimbabve", "Bocvana", "Namibija", "Angola"]
  },
  "Malavi": {
    name: "Malavi",
    borders: ["Tanzanija", "Mozambik", "Zambija"]
  },
  "Mozambik": {
    name: "Mozambik",
    borders: ["Tanzanija", "Malavi", "Zambija", "Zimbabve", "Južnoafrička Republika", "Svazilend"]
  },
  "Zimbabve": {
    name: "Zimbabve",
    borders: ["Zambija", "Mozambik", "Južnoafrička Republika", "Bocvana"]
  },
  "Bocvana": {
    name: "Bocvana",
    borders: ["Namibija", "Zambija", "Zimbabve", "Južnoafrička Republika"]
  },
  "Namibija": {
    name: "Namibija",
    borders: ["Angola", "Zambija", "Bocvana", "Južnoafrička Republika"]
  },
  "Južnoafrička Republika": {
    name: "Južnoafrička Republika",
    borders: ["Namibija", "Bocvana", "Zimbabve", "Mozambik", "Svazilend", "Lesoto"]
  },
  "Svazilend": {
    name: "Svazilend",
    borders: ["Mozambik", "Južnoafrička Republika"]
  },
  "Lesoto": {
    name: "Lesoto",
    borders: ["Južnoafrička Republika"]
  },
  "Kuvajt": {
    name: "Kuvajt",
    borders: ["Irak", "Saudijska Arabija"]
  },
  "Saudijska Arabija": {
    name: "Saudijska Arabija",
    borders: ["Jordan", "Irak", "Kuvajt", "Bahrein", "Katar", "Ujedinjeni Arapski Emirati", "Oman", "Jemen"]
  },
  "Bahrein": {
    name: "Bahrein",
    borders: ["Saudijska Arabija"]
  },
  "Katar": {
    name: "Katar",
    borders: ["Saudijska Arabija", "Ujedinjeni Arapski Emirati"]
  },
  "Ujedinjeni Arapski Emirati": {
    name: "Ujedinjeni Arapski Emirati",
    borders: ["Saudijska Arabija", "Oman", "Katar"]
  },
  "Oman": {
    name: "Oman",
    borders: ["Ujedinjeni Arapski Emirati", "Saudijska Arabija", "Jemen"]
  },
  "Jemen": {
    name: "Jemen",
    borders: ["Saudijska Arabija", "Oman"]
  }
};
