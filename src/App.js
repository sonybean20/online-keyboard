import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const alphabetToKorean = {
    'q' : 'ㅂ',
    'Q' : 'ㅃ',
    'w' : 'ㅈ',
    'W' : 'ㅉ',
    'e' : 'ㄷ',
    'E' : 'ㄸ',
    'r' : 'ㄱ',
    'R' : 'ㄲ',
    't' : 'ㅅ',
    'T' : 'ㅆ',
    'y' : 'ㅛ',
    'u' : 'ㅕ',
    'i' : 'ㅑ',
    'o' : 'ㅐ',
    'O' : 'ㅒ',
    'p' : 'ㅔ',
    'P' : 'ㅖ',
    'a' : 'ㅁ',
    's' : 'ㄴ',
    'd' : 'ㅇ',
    'f' : 'ㄹ',
    'g' : 'ㅎ',
    'h' : 'ㅗ',
    'j' : 'ㅓ',
    'k' : 'ㅏ',
    'l' : 'ㅣ',
    'z' : 'ㅋ',
    'x' : 'ㅌ',
    'c' : 'ㅊ',
    'v' : 'ㅍ',
    'b' : 'ㅠ',
    'n' : 'ㅜ',
    'm' : 'ㅡ',
  };

  const initialJamo = toDictionary('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split(''));
  const medialJamo = toDictionary('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split(''));
  const finalJamo = toDictionary([''].concat('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.split('')));

  const medialComboJamo = {
    'ㅗ' : { 
      'ㅏ' : 'ㅘ',
      'ㅐ' : 'ㅙ',
      'ㅣ' : 'ㅚ'
    },
    'ㅜ' : {
      'ㅓ' : 'ㅝ',
      'ㅔ' : 'ㅞ',
      'ㅣ' : 'ㅟ'
    },
    'ㅡ' : {
      'ㅣ' : 'ㅢ'
    }
  };
  const finalComboJamo = {
    'ㄱ' : {
      'ㅅ' : 'ㄳ'
    },
    'ㄴ' : {
      'ㅈ' : 'ㄵ',
      'ㅎ' : 'ㄶ'
    },
    'ㄹ' : {
      'ㄱ' : 'ㄺ',
      'ㅁ' : 'ㄻ',
      'ㅂ' : 'ㄼ',
      'ㅅ' : 'ㄽ',
      'ㅌ' : 'ㄾ',
      'ㅍ' : 'ㄿ',
      'ㅎ' : 'ㅀ'
    },
    'ㅂ' : {
      'ㅅ' : 'ㅄ'
    }
  };

  function toDictionary(arr) {
    let d = {};
    for (let i = 0; i < arr.length; i++) {
      d[arr[i]] = i;
    }
    return d;
  }

  function parse(str) {
    let parsed = '';
    
    // from alphabet to korean characters, ex) 'dkssud' -> 'ㅇㅏㄴㄴㅕㅇ'
    for (let i = 0; str[i]; i++) {
      if (alphabetToKorean[str[i].toLowerCase()] === undefined) {
        parsed += str[i];
      } else if (alphabetToKorean[str[i]] !== undefined) {
        parsed += alphabetToKorean[str[i]];
      } else {
        parsed += alphabetToKorean[str[i].toLowerCase()];
      }
    }

    // combine initial, medial, final jamo, ex) 'ㅇㅏㄴㄴㅕㅇ' -> '안녕'
    let combined = '';
    for (let i = 0; parsed[i]; i++) {
      let initial, medial, final;

      // handle initial 
      if (i+1 < parsed.length &&
        medialComboJamo.hasOwnProperty(parsed[i]) && 
        medialComboJamo[parsed[i]].hasOwnProperty(parsed[i+1])) { // begin with medial combo jamo, ex) ㅟ
          combined += medialComboJamo[parsed[i]][parsed[i+1]];
          i++;
          continue;
      } else if (initialJamo[parsed[i]] === undefined ||        // medial single, ex) ㅜ
                  i+1 >= parsed.length || 
                  !medialJamo.hasOwnProperty(parsed[i+1])) {    // or ending in single initial jamo, ex) ㅁ
        combined += parsed[i];
        continue;
      } else {                                                  // ex) ㅁ of 만
        initial = initialJamo[parsed[i]];
      }

      if (i+1 >= parsed.length) break;
      i++;

      // handle medial
      if (i+1 < parsed.length &&
                medialComboJamo.hasOwnProperty(parsed[i]) && 
                medialComboJamo[parsed[i]].hasOwnProperty(parsed[i+1])) { // combination medial jamo, ex) ㅟ of 윙
        medial = medialJamo[medialComboJamo[parsed[i]][parsed[i+1]]];
        i++;
      } else {                                                            // single medial jamo, ex) ㅏ of 안
        medial = medialJamo[parsed[i]];
      }
      
      i++;

      // handle final 
      if (i == parsed.length ||
          finalJamo[parsed[i]] === undefined ||
          (i+1 < parsed.length && medialJamo[parsed[i+1]] !== undefined)) {       // initialJamo of next set, ex) reached ㄴ of 가나
        final = finalJamo['']; // save for next set, ex) 간ㅏ (X), 가나 (O)
        i--;
      } else if (i+1 < parsed.length &&
                finalComboJamo.hasOwnProperty(parsed[i]) && 
                finalComboJamo[parsed[i]].hasOwnProperty(parsed[i+1]) &&           // combination final jamo, ex) ㄶ of 않
                (i+2 >= parsed.length || medialJamo[parsed[i+2]] === undefined)) { // not initialJamo of next set, ex) 낝ㅣㅇ (X), 난징 (O)
        final = finalJamo[finalComboJamo[parsed[i]][parsed[i+1]]];
        i++;
      } else {                                                                     // single final jamo, ex) ㄴ of 안
        final = finalJamo[parsed[i]];
      }

      // calculation source 1: https://web.archive.org/web/20190512031142/http://www.programminginkorean.com/programming/hangul-in-unicode/composing-syllables-in-unicode/
      // source 2: http://gernot-katzers-spice-pages.com/var/korean_hangul_unicode.html
      combined += String.fromCharCode(initial * 588 + medial * 28 + final + 44032);
    }

    return combined;
  }

  function handleTextChange(e) {
    e.preventDefault();
    document.getElementById('output').value = parse(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Online Korean Keyboard</h1>
      </header>
      <div>
        <textarea id="input" className="txt" onChange={handleTextChange}></textarea>
      </div>
      <div>      
        <textarea id="output" className="txt"></textarea>
      </div>
    </div>
  );
}

export default App;
