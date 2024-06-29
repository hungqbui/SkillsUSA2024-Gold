import { useState } from 'react'
import './App.css'

import axios from 'axios'

function App() {

  // State variable declaration
  const [diceFace, setDiceFace] = useState(0)
  const [rolledValue, setRolledValue] = useState(0)
  const [hasInput, setHasInput] = useState(false)
  const [warning, setWarning] = useState("")

  /**
   *  Asynchronous function to prompt to the user and send to the server for logging
   * 
   */
  const rollDice = async () => {

    // Set the state variable rolledValue to a random value between 0 and diceFace
    const finalValue = Math.floor(Math.random() * diceFace + 1)
    setRolledValue(finalValue)

    const params = {
      "got": finalValue
    } 

    // Send the rolled value to the server
    await axios.get("http://localhost:5000", {
      params: params
    })
  }

  /**
   *  Update the number of dice faces
   * 
   *  params:
   *  faces: string => number of faces that is inputed
    */ 
  const diceUpdate = (faces : string) => {
    const numFaces = parseInt(faces);

    // Validation
    if (!numFaces || !Number.isInteger(numFaces) || numFaces <= 0) {
      setWarning("Please enter a valid number of faces (a positive integer)")
      return;
    }

    setDiceFace(numFaces);
    setWarning("");
  }


  /**
   * Confirm the creation of the diceFace-face dice
   */
  const rollable = () => {

    if (diceFace > 0) {
      setHasInput(true);
    }
  }

  return (
    <>
      {
        !hasInput ?
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={{ fontSize: "20px" }} htmlFor="dice-input">Enter the number of faces for the dice:</label>
          <input type="text" id="dice-input" style={{ margin: "20px", width: "200px", height: "100px", textAlign: "center", fontSize: "30px" }}  onChange={((e) => diceUpdate(e.target.value))} />
          <button onClick={() => rollable()}>Submit</button>

          <p style={{color: "red"}}>{warning}</p>
        </div>
        : 
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "30px" }}>{rolledValue}</p>
          <div>
            <button style={{ margin: "10px" }} onClick={() => rollDice()}>Roll {diceFace}-face dice</button>
            <button onClick={() => {setHasInput(false); setDiceFace(0)}}>Create a new dice</button>
          </div>
        </div>
      }
    </>
  )
}

export default App
