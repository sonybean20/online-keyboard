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
    'O' : 'ㅔ',
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

  // const medialComboJamo = {};

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
      if (initialJamo[parsed[i]] === undefined) {
        combined += parsed[i];
        continue;
      } else {
        initial = initialJamo[parsed[i]];
      }

      i++;
      if (medialJamo[parsed[i]] === undefined) {
        combined += parsed[i];
        continue;
      } else {
        medial = medialJamo[parsed[i]];
      }
    }
    
    let initial = initialJamo[parsed[0]];
    let medial = medialJamo[parsed[1]];
    let final = finalJamo[parsed[2]];
    console.log(initial * 588 + medial * 28 + final + 44032);

    return parsed;
  }

  function handleTextChange(e) {
    e.preventDefault();
    console.log(e.target.value);
    e.target.value = parse(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Online Korean Keyboard</h1>
      </header>
      <div>
        <textarea id="text" onChange={handleTextChange}></textarea>
      </div>
    </div>
  );
}

export default App;
