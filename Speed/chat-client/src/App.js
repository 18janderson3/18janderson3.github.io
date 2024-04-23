import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, useDroppable, useDraggable } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import io from 'socket.io-client';
import './style/dark.css'
import './App.css';

//import {Droppable} from './Droppable';
//import {Draggable} from './Draggable';

//ace imports
import ace_clubs from './media/ace_of_clubs.png';
import ace_diamonds from './media/ace_of_diamonds.png';
import ace_hearts from './media/ace_of_hearts.png';
import ace_spades from './media/ace_of_spades.png';
//2 imports
import clubs_2 from './media/2_of_clubs.png';
import diamonds_2 from './media/2_of_diamonds.png';
import hearts_2 from './media/2_of_hearts.png';
import spades_2 from './media/2_of_spades.png';
//3 imports
import clubs_3 from './media/3_of_clubs.png';
import diamonds_3 from './media/3_of_diamonds.png';
import hearts_3 from './media/3_of_hearts.png';
import spades_3 from './media/3_of_spades.png';
//4 imports
import clubs_4 from './media/4_of_clubs.png';
import diamonds_4 from './media/4_of_diamonds.png';
import hearts_4 from './media/4_of_hearts.png';
import spades_4 from './media/4_of_spades.png';
//5 imports
import clubs_5 from './media/5_of_clubs.png';
import diamonds_5 from './media/5_of_diamonds.png';
import hearts_5 from './media/5_of_hearts.png';
import spades_5 from './media/5_of_spades.png';
//6 imports
import clubs_6 from './media/6_of_clubs.png';
import diamonds_6 from './media/6_of_diamonds.png';
import hearts_6 from './media/6_of_hearts.png';
import spades_6 from './media/6_of_spades.png';
//7 imports
import clubs_7 from './media/7_of_clubs.png';
import diamonds_7 from './media/7_of_diamonds.png';
import hearts_7 from './media/7_of_hearts.png';
import spades_7 from './media/7_of_spades.png';
//8 imports
import clubs_8 from './media/8_of_clubs.png';
import diamonds_8 from './media/8_of_diamonds.png';
import hearts_8 from './media/8_of_hearts.png';
import spades_8 from './media/8_of_spades.png';
//9 imports
import clubs_9 from './media/9_of_clubs.png';
import diamonds_9 from './media/9_of_diamonds.png';
import hearts_9 from './media/9_of_hearts.png';
import spades_9 from './media/9_of_spades.png';
//10 imports
import clubs_10 from './media/10_of_clubs.png';
import diamonds_10 from './media/10_of_diamonds.png';
import hearts_10 from './media/10_of_hearts.png';
import spades_10 from './media/10_of_spades.png';
//jack imports
import jack_clubs from './media/jack_of_clubs.png'
import jack_diamonds from './media/jack_of_diamonds.png'
import jack_hearts from './media/jack_of_hearts.png'
import jack_spades from './media/jack_of_spades.png'
//queen imports
import queen_clubs from './media/queen_of_clubs.png'
import queen_diamonds from './media/queen_of_diamonds.png'
import queen_hearts from './media/queen_of_hearts.png'
import queen_spades from './media/queen_of_spades.png'
//king imports
import king_clubs from './media/king_of_clubs.png'
import king_diamonds from './media/king_of_diamonds.png'
import king_hearts from './media/king_of_hearts.png'
import king_spades from './media/king_of_spades.png'
//back import
import card_back from './media/card_back.png';



const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});
//creating a randomly generated id for the players  
const u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
const guid = [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');

function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.result}</td>
    <td>{props.record.cardsLeft}</td>
    <td>{props.record.dateTimeFormat}</td>
  </tr>
 );

const App = () => {

  const [isDropped, setIsDropped] = useState(false);
  const [parent, setParent] = useState(null);

  const [draggableMarkup, setDraggableMarkup] = useState((
    <Draggable><img src={card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} /></Draggable>
  ));

  
  

  //deck of cards
  const [deck, setDeck] = useState([
    //Aces's
    { number: 1, card: ace_clubs },
    { number: 1, card: ace_diamonds },
    { number: 1, card: ace_hearts },
    { number: 1, card: ace_spades },
    //2's
    { number: 2, card: clubs_2 },
    { number: 2, card: diamonds_2 },
    { number: 2, card: hearts_2 },
    { number: 2, card: spades_2 },
    //3's
    { number: 3, card: clubs_3 },
    { number: 3, card: diamonds_3 },
    { number: 3, card: hearts_3 },
    { number: 3, card: spades_3 },
    //4's
    { number: 4, card: clubs_4 },
    { number: 4, card: diamonds_4 },
    { number: 4, card: hearts_4 },
    { number: 4, card: spades_4 },
    //5's
    { number: 5, card: clubs_5 },
    { number: 5, card: diamonds_5 },
    { number: 5, card: hearts_5 },
    { number: 5, card: spades_5 },
    //6's
    { number: 6, card: clubs_6 },
    { number: 6, card: diamonds_6 },
    { number: 6, card: hearts_6 },
    { number: 6, card: spades_6 },
    //7's
    { number: 7, card: clubs_7 },
    { number: 7, card: diamonds_7 },
    { number: 7, card: hearts_7 },
    { number: 7, card: spades_7 },
    //8's
    { number: 8, card: clubs_8 },
    { number: 8, card: diamonds_8 },
    { number: 8, card: hearts_8 },
    { number: 8, card: spades_8 },
    //9's
    { number: 9, card: clubs_9 },
    { number: 9, card: diamonds_9 },
    { number: 9, card: hearts_9 },
    { number: 9, card: spades_9 },
    //10's
    { number: 10, card: clubs_10 },
    { number: 10, card: diamonds_10 },
    { number: 10, card: hearts_10 },
    { number: 10, card: spades_10 },
    //jacks
    { number: 11, card: jack_clubs },
    { number: 11, card: jack_diamonds },
    { number: 11, card: jack_hearts },
    { number: 11, card: jack_spades },
    //queens
    { number: 12, card: queen_clubs },
    { number: 12, card: queen_diamonds },
    { number: 12, card: queen_hearts },
    { number: 12, card: queen_spades },
    //kings
    { number: 13, card: king_clubs },
    { number: 13, card: king_diamonds },
    { number: 13, card: king_hearts },
    { number: 13, card: king_spades },

  ]);

  //will be set to true once a player has depleted their stack of cards to 0
  const [gameState, setGamestate] = useState(0);
  const [message, setMessage] = useState('Press to start game');

  //deck for player 1
  const [playerDeck1, setDeck1] = useState([{ number: 0, card: card_back}]);

  //deck for player 2
  const [playerDeck2, setDeck2] = useState([{ number: 0, card: card_back}]);

  //will grab the name of the user
  const [userName, setUserName]= useState("");

  const [winner, setWinner] = useState(true);

  //the eight piles of cards 
  const [pile1, setPile1] = useState({stack: [], canPlay: false});
  const [pile2, setPile2] = useState({stack: [], canPlay: false});
  const [pile3, setPile3] = useState({stack: [], canPlay: false});
  const [pile4, setPile4] = useState({stack: [], canPlay: false});
  const [pile5, setPile5] = useState({stack: [], canPlay: false});
  const [pile6, setPile6] = useState({stack: [], canPlay: false});
  const [pile7, setPile7] = useState({stack: [], canPlay: false});
  const [pile8, setPile8] = useState({stack: [], canPlay: false});

  //checks to see if a pile is empty indicating a winner
  function checkWinner() {
    if (playerDeck1.length === 0) {
      setMessage("You Win!");
      setGamestate(2);
    }
    else if (playerDeck2.length === 0) {
      setMessage("You Lose!");
      setGamestate(2);
    }
  }

  //random deck code
  function shuffle(array) {

    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    //how to splice
    let valuesFirst = array.splice(26, 52);
    let valuesSecond = array.splice(0, 26)

    //setting the decks
    return {first: valuesFirst, second: valuesSecond};

  }

  

  //show that that the deck populate
  useEffect(() => {
    console.log("this is deck1");
    console.log(playerDeck1); // This will log the updated value of deck 1
    console.log("this is deck2");
    console.log(playerDeck2);
    setDraggableMarkup((
      <Draggable><img src={playerDeck1[0] ? playerDeck1[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} /></Draggable>
    ));
    checkWinner();
  }, [playerDeck1, playerDeck2]);

  //will check to see if there is not a match on the table 
  function checkPickUpCards(m){
    //long if statement checking all combinations of matches
    if (
      m.p1.canPlay ||
      m.p2.canPlay ||
      m.p3.canPlay ||
      m.p4.canPlay ||
      m.p5.canPlay ||
      m.p6.canPlay ||
      m.p7.canPlay ||
      m.p8.canPlay
    ){
      return false;
    }
    else {
      return true;
    }
  }


  useEffect(() => {
    //when the cardstate is recieved, update the cards
    socket.on('cardstate', (message) => {
      //if this was my move, check to see if cards need pickup
      if(message.id == guid){
        if(checkPickUpCards(message)){
          socket.emit('sendPickup', message);
        } else {
          setPile1(message.p1);
          setPile2(message.p2);
          setPile3(message.p3);
          setPile4(message.p4);
          setPile5(message.p5);
          setPile6(message.p6);
          setPile7(message.p7);
          setPile8(message.p8);
          setDeck1(message.d1);
          setDeck2(message.d2);
        }
      } else {
        if(!checkPickUpCards(message)){
          setPile1(message.p8);
          setPile2(message.p7);
          setPile3(message.p6);
          setPile4(message.p5);
          setPile5(message.p4);
          setPile6(message.p3);
          setPile7(message.p2);
          setPile8(message.p1);
          setDeck2(message.d1);
          setDeck1(message.d2);
        }
      }      
    }); 

    socket.on('pickup', (m) => {
      let p1d;
      let p2d;
      if(m.id == guid){
        //1-4
        const pickuppile1 = shuffle([...m.p1.stack, ...m.p2.stack, ...m.p3.stack, ...m.p4.stack]);
        p1d = [...m.d1, ...pickuppile1.first, ...pickuppile1.second];
        const pickuppile2 = shuffle([...m.p5.stack, ...m.p6.stack, ...m.p7.stack, ...m.p8.stack]);
        p2d = [...m.d2, ...pickuppile2.first, ...pickuppile2.second];
        deal(m.id, p1d, p2d);
      }
    });

    socket.on('start', (message) => {
      setGamestate(1);
      if(message.id == guid){
        deal(message.id, message.first, message.second);
      }
    });
  },[]);



  function playPile1() {
    if(pile1.canPlay){
      const card = playerDeck1[0];
      playCard({p1: {stack: [card, ...pile1.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile2() {
    if(pile2.canPlay){
      const card = playerDeck1[0];
      playCard({p2: {stack: [card, ...pile2.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile3() {
    if(pile3.canPlay){
      const card = playerDeck1[0];
      playCard({p3: {stack: [card, ...pile3.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile4() {
    if(pile4.canPlay){
      const card = playerDeck1[0];
      playCard({p4: {stack: [card, ...pile4.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile5() {
    if(pile5.canPlay){
      const card = playerDeck1[0];
      playCard({p5: {stack: [card, ...pile5.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile6() {
    if(pile6.canPlay){
      const card = playerDeck1[0];
      playCard({p6: {stack: [card, ...pile6.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile7() {
    if(pile7.canPlay){
      const card = playerDeck1[0];
      playCard({p7: {stack: [card, ...pile7.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }
  function playPile8() {
    if(pile8.canPlay){
      const card = playerDeck1[0];
      playCard({p8: {stack: [card, ...pile8.stack], canPlay: false}, d1: playerDeck1.slice(1)});
    }
  }

  const startGame = () => {
    const decks = shuffle(deck);
    socket.emit('sendStart', {id: guid, ...decks});
  }

  function deal(player1, p1d, p2d){
    if(player1 == guid){
      let state = {
        id: player1,
        p1: {stack: [p1d[0]], canPlay: false},
        p2: {stack: [p1d[1]], canPlay: false},
        p3: {stack: [p1d[2]], canPlay: false},
        p4: {stack: [p1d[3]], canPlay: false},
        p5: {stack: [p2d[0]], canPlay: false},
        p6: {stack: [p2d[1]], canPlay: false},
        p7: {stack: [p2d[2]], canPlay: false},
        p8: {stack: [p2d[3]], canPlay: false},
        d1: p1d.slice(4),
        d2: p2d.slice(4),
      };

      state = {...state, p1: {...state.p1 , canPlay: hasMatch(state.p1, state)}};
      state = {...state, p2: {...state.p2 , canPlay: hasMatch(state.p2, state)}};
      state = {...state, p3: {...state.p3 , canPlay: hasMatch(state.p3, state)}};
      state = {...state, p4: {...state.p4 , canPlay: hasMatch(state.p4, state)}};
      state = {...state, p5: {...state.p5 , canPlay: hasMatch(state.p5, state)}};
      state = {...state, p6: {...state.p6 , canPlay: hasMatch(state.p6, state)}};
      state = {...state, p7: {...state.p7 , canPlay: hasMatch(state.p7, state)}};
      state = {...state, p8: {...state.p8 , canPlay: hasMatch(state.p8, state)}};
      
      socket.emit('sendCardState', {...state});
    }
  }
  //when a card is placed, emit the new state of the cards
  //newpile = {px: [ newcard, ...pilex]}
  const playCard = (newpile) => {
    //get current gamestate
    const cardstate = {
      id: guid,
      p1: pile1,
      p2: pile2,
      p3: pile3,
      p4: pile4,
      p5: pile5,
      p6: pile6,
      p7: pile7,
      p8: pile8,
      d1: playerDeck1,
      d2: playerDeck2,
    }
    let newstate = {...cardstate, ...newpile};
    if(!newstate.p1.canPlay){
      newstate = {...newstate, p1: {...newstate.p1 , canPlay: hasMatch(newstate.p1, newstate)}};
    }
    if(!newstate.p2.canPlay){
      newstate = {...newstate, p2: {...newstate.p2 , canPlay: hasMatch(newstate.p2, newstate)}};
    }
    if(!newstate.p3.canPlay){
      newstate = {...newstate, p3: {...newstate.p3 , canPlay: hasMatch(newstate.p3, newstate)}};
    }
    if(!newstate.p4.canPlay){
      newstate = {...newstate, p4: {...newstate.p4 , canPlay: hasMatch(newstate.p4, newstate)}};
    }
    if(!newstate.p5.canPlay){
      newstate = {...newstate, p5: {...newstate.p5 , canPlay: hasMatch(newstate.p5, newstate)}};
    }
    if(!newstate.p6.canPlay){
      newstate = {...newstate, p6: {...newstate.p6 , canPlay: hasMatch(newstate.p6, newstate)}};
    }
    if(!newstate.p7.canPlay){
      newstate = {...newstate, p7: {...newstate.p7 , canPlay: hasMatch(newstate.p7, newstate)}};
    }
    if(!newstate.p8.canPlay){
      newstate = {...newstate, p8: {...newstate.p8 , canPlay: hasMatch(newstate.p8, newstate)}};
    }
    //send cardstate with the new change
    socket.emit('sendCardState', newstate);
  };


  function hasMatch(card, state){
    let count = 0;
    const topcards = [
      state.p1.stack[0], 
      state.p2.stack[0], 
      state.p3.stack[0], 
      state.p4.stack[0], 
      state.p5.stack[0], 
      state.p6.stack[0], 
      state.p7.stack[0], 
      state.p8.stack[0], 
    ];
    for(let i = 0; i < topcards.length; i++){
      if(card.stack[0].number == topcards[i].number){
        count++;
      }
    }
    return count > 1;
  }

  //function that will handle getting the names of the user and whether they won or not and if they won, how many  
  async function endGame (e) {
    e.preventDefault();
    //grab the date
    const currentDateTime = new Date();

    //indicate to the use to enter their name
    setMessage("Please enter your name");

    //if field is left blank, dont allow the user to continue and tell them it is blank
    if(userName === ""){
      setMessage("need to input a name");
    }
    else{
      console.log(userName);
      //means the player won and gameWon is true and input the cardsLeft as playerCard2.length and then the date time
      if(playerDeck1.length === 0){

        //since all logic for the front end exists on the same page, this is just incase values don't reset properly when doing another game 
        setWinner(true);
        //do the past call here
        await fetch(`http://localhost:5000/userName/${userName}/${winner}/${playerDeck2.length}/${currentDateTime}`, {
               //need the method
              method: "POST",
              //need to say the content type and the application type
              headers: {
                "Content-Type": "application/json",
              },
             
            });
            //clearing name incase of new game
            setUserName("");
            setGamestate(3);
       
      }
      //means the opponent won and gameWon needs to be set to false and then cardsLeft as playerCard1.length and then date time
      else{
        setWinner(false);
        //do the post call here
        await fetch(`http://localhost:5000/userName/${userName}/${winner}/${playerDeck1.length}/${currentDateTime}`, {
               //need the method
              method: "POST",
              //need to say the content type and the application type
              headers: {
                "Content-Type": "application/json",
              },
            });
            //clearing name incase of new game
            setUserName("");
            setGamestate(3);
      }
      getRecords();
    }

  }

  

  const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/HighScores/${userName}`);
      if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
     let r = await response.json();
     console.log(r);
     setRecords(r);
   }

 function recordList() {
  return records.map((record) => {
    return (
      <Record
        record={record}
        key={record._id}
      />
    );
  });
}
   // <button onClick={startGame}>Start</button>
  if(gameState === 0){
    return (
      <>
        <div>
          <h3>{message}</h3>
          
          <button onClick={startGame}>Start</button>
          
        </div>
      </>
    )
  }

  if(gameState === 1){
  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div className='container'>
          <img src={card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />
          <h1>{playerDeck2.length}</h1>
        </div>
        <div className='container'>
          <Droppable key={8} id={8} >
          {<img src={pile8.stack[0] ? pile8.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
          <Droppable key={7} id={7} >
          {<img src={pile7.stack[0] ? pile7.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
          <Droppable key={6} id={6} >
          {<img src={pile6.stack[0] ? pile6.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
          <Droppable key={5} id={5} >
          {<img src={pile5.stack[0] ? pile5.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
        </div>
        <div className='container'>
          <Droppable key={4} id={4} >
          {<img src={pile4.stack[0] ? pile4.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
          <Droppable key={3} id={3} >
          {<img src={pile3.stack[0] ? pile3.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
          <Droppable key={2} id={2} >
          {<img src={pile2.stack[0] ? pile2.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
          <Droppable key={1} id={1} >
          {<img src={pile1.stack[0] ? pile1.stack[0].card : card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />}
          </Droppable>
        </div>
        <div className='container'>
          {draggableMarkup}
          <img src={card_back} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} />
          <h1>{playerDeck1.length}</h1>
        </div>
      </div>
      </DndContext>
      
    </>
  );

  }

  if(gameState === 2){
    return (
      <>
        <div>
          <h3>{message}</h3>
          <label htmlFor="name">Name: </label>
            <input
            type="text"
            className="form-control"
            id="name"
            value={userName.name}
            onChange={(e) => setUserName( e.target.value)}
            />
          <button onClick={endGame}>HighScores</button>
        </div>
      </>
    )
  }
  //{params.length}
  if(gameState === 3){
    return (
      <div>
        <h3> Game History </h3>
        <table style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Result</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
        </table>
      </div>
    );
  }

  

 

  function handleDragEnd(event) {
    const {over} = event;
    //console.log(over);

    if (event.over) {
      //setIsDropped(true);
      //console.log(draggableMarkup);
      
      //console.log(draggableMarkup);

      if (over.id === 1) {
        playPile1();
      }
      else if (over.id === 2) {
        playPile2();
      }
      else if (over.id === 3) {
        playPile3();
      }
      else if (over.id === 4) {
        playPile4();
      }
      else if (over.id === 5) {
        playPile5();
      }
      else if (over.id === 6) {
        playPile6();
      }
      else if (over.id === 7) {
        playPile7();
      }
      else if (over.id === 8) {
        playPile8();
      }

      setDraggableMarkup((
        <Draggable><img src={playerDeck1[0].card} className='card-img' alt="Card Image" style={{ maxWidth: '100px' }} /></Draggable>
      ));
    }

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
    
  }
}


export default App;