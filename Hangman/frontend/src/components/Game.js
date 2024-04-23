import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Hangman_0 from '../media/Hangman_0.png'
import Hangman_1 from '../media/Hangman_1.png'
import Hangman_2 from '../media/Hangman_2.png'
import Hangman_3 from '../media/Hangman_3.png'
import Hangman_4 from '../media/Hangman_4.png'
import Hangman_5 from '../media/Hangman_5.png'
import Hangman_6 from '../media/Hangman_6.png'

const Game = () => {
  const params = useParams();
  const [form, setForm] = useState({
    guess: "",
  });
  //set this to take an array

  //getting information from last page
  const account = useLocation();
  const length = account.state.length;

  const [lettersGuessed, setLettersGuessed] = useState([]);

   const [count, setCount] = useState(0);

   const [chosenWord, setChosenWord] = useState("");

  //filling the array with _ to start it off
  const [theWord, setTheWord] = useState(new Array(length).fill("_"));

  const [score, setScore] = useState(0);
  const hangmanFrames = [Hangman_0, Hangman_1, Hangman_2, Hangman_3, Hangman_4, Hangman_5, Hangman_6];
  const [currentFrame, setCurrentFrame] = useState(0);

  const nextFrame = () => {
    const nextFrame = (currentFrame + 1) % hangmanFrames.length;
    setCurrentFrame(nextFrame);
  };

  async function getChosenWord() {
    // When a post request is sent to the create url, we'll add a new record to the database.
    const response = await fetch(`http://localhost:5000/word/${params.id.toString()}`);
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const s = await response.json();
    setChosenWord(s.word);

  }

  function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
  }
  // This function will handle the submission.
  async function makeGuess(e) {

    // Ensure guess is valid
    let regex = /^[a-zA-Z]+$/;  // Regex for only letters
    if (form.guess === "" || lettersGuessed.includes(form.guess) || form.guess.length > 1 || !regex.test(form.guess)){
      return;
    }

    e.preventDefault();

  
  
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newGuess = { ...form };
    const response = await fetch(`http://localhost:5000/guess/${params.id.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGuess),
    })
        .catch(error => {
            window.alert(error);
            return;
        });
    const result = await response.json();
    
    let newword = theWord;
    //they guessed the letter correctly
    if(result.indexes[0] !== -1){
      for(let i = 0; i < result.indexes.length; i++){
        newword[result.indexes[i]] = form.guess;
      }
    }
    //they did not guess the letter correctly
    else{
      setCount(count + 1);
      setLettersGuessed([...lettersGuessed, form.guess]);
      nextFrame();
    }

    setTheWord(newword);
    setScore(score + 1);
    setForm({ guess: "" });

  }

  const navigate = useNavigate();
  async function deleteUser(){
    const response = await fetch(`http://localhost:5000/${params.id.toString()}`, {
      method: "DELETE",
    })
        .catch(error => {
            window.alert(error);
            return;
        });
    navigate("/");
  }


  const Msg = () => {

    let isComplete = true;
    for(let i = 0; i < length; i++){
      if (theWord[i] === "_"){
        isComplete = false;
      }
    }
    if(count === 6){
      getChosenWord();
      return(
        <div>
        <h3>You Lose!</h3>
        <h3>Your word was: {chosenWord}</h3>
        <button className="btn btn-link" onClick={deleteUser}>Play Again?</button>
      </div>
      );
    }
    if(!isComplete){
      return(
        <div className="form-group">
          <input
          type="button"
          value="Guess"
          className="btn btn-primary"
          onClick={makeGuess}
          />
        </div>
      );
    } 
    else{
      getChosenWord();
      return(
        <div>
          <h3>You win! Final score: {score}</h3>
          <h3>Your word was: {chosenWord}</h3>
          <Link className="btn btn-link" to={`/leaderboard/${length}`}>See Leaderboard</Link>
        </div>
      );
    } 
  }

  const Word = () => {
    return (
      <ul>
        {theWord.map((item, index) => (
          <ol id="element" key={index}>{item}</ol>
        ))}
      </ul>
    );
  };

  const Letters = () => {
    return (
      <ul>
        {lettersGuessed.map((item, index) => (
          <ol id="element" key={index}>{item}</ol>
        ))}
      </ul>
    );
  };

 return (
  <>
  <div>
  <h3>Start Guessing</h3>
  <div className="form-group">
      <label htmlFor="name">Letter: </label>
      <input
      type="text"
      className="form-control"
      id="number"
      value={form.guess}
      onChange={(e) => updateForm({ guess: e.target.value.toUpperCase() })}
      />
  </div>
    <Msg/>
    <img src={hangmanFrames[currentFrame]} alt="Hangman Image" />
  </div>

  <Word/>

  <Letters/>
  </>
  
 );
};
export default Game;