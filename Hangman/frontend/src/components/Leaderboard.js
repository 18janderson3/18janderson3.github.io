import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
const Record = (props) => (
 <tr>
   <td>{props.record.name}</td>
   <td>{props.record.word}</td>
   <td>{props.record.guesses}</td>
 </tr>
);
export default function Leaderboard() {
  const params = useParams();
  const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/HighScores/${params.length}`);
      if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
     let r = await response.json();
     console.log(r);
     r.sort((a, b) => a.guesses - b.guesses);
     console.log(r);
     r = r.slice(0,10);
     setRecords(r);
   }
    getRecords();
    return;
 }, [records.length]);
  // This method will delete a record
  // This method will map out the records on the table
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
  // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>{params.length} Character High Scores</h3>
     <table style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Word</th>
           <th>Guesses</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
     <Link className="btn btn-link" to={`/`}>Start new game</Link>
   </div>
 );
}