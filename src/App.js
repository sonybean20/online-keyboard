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
      'ㅏ' : 'ㅚ',
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
    
    // from alphabet to korean characters
    for (let i = 0; str[i]; i++) {
      if (alphabetToKorean[str[i].toLowerCase()] === undefined) {
        parsed += str[i];
      } else if (alphabetToKorean[str[i]] !== undefined) {
        parsed += alphabetToKorean[str[i]];
      } else {
        parsed += alphabetToKorean[str[i].toLowerCase()];
      }
    }
    console.log("parsed: " + parsed);

    // combine initial, medial, final jamo
    let combined = '';
    for (let i = 0; parsed[i]; i++) {
      let initial, medial, final;
      if (initialJamo[parsed[i]] === undefined ||
          i+1 >= parsed.length || 
          !medialJamo.hasOwnProperty(parsed[i+1])) {
        combined += parsed[i];
        continue;
      } else {
        initial = initialJamo[parsed[i]];
      }

      if (i+1 >= parsed.length) break;

      i++;
      if (i+1 < parsed.length &&
                medialComboJamo.hasOwnProperty(parsed[i]) && 
                medialComboJamo[parsed[i]].hasOwnProperty(parsed[i+1])) { // combination
        medial = medialJamo[medialComboJamo[parsed[i]][parsed[i+1]]];
        i++;
      } else {
        medial = medialJamo[parsed[i]];
      }
      
      i++;
      if (i == parsed.length ||
          finalJamo[parsed[i]] === undefined ||
          (i+1 < parsed.length && medialJamo[parsed[i+1]] !== undefined)) { // initialJamo of next set
        final = finalJamo[''];
        i--;
      } else if (i+1 < parsed.length &&
                finalComboJamo.hasOwnProperty(parsed[i]) && 
                finalComboJamo[parsed[i]].hasOwnProperty(parsed[i+1]) && // combination
                (i+2 >= parsed.length || medialJamo[parsed[i+2]] === undefined)) { // not initialJamo of next set
        final = finalJamo[finalComboJamo[parsed[i]][parsed[i+1]]];
        i++;
      } else {
        final = finalJamo[parsed[i]];
      }

      console.log(String.fromCharCode(initial * 588 + medial * 28 + final + 44032));
      combined += String.fromCharCode(initial * 588 + medial * 28 + final + 44032);
    }

    console.log('combined: ' + combined);

    return combined;
  }

  function handleTextChange(e) {
    e.preventDefault();
    console.log(parse(e.target.value));
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
