import { useState, CSSProperties } from 'react'
import './App.css'

import axios from 'axios'

// Payroll Component
const PayDisplay = (payData : any, delim: boolean, key : number)  => {
  // Styling for list elements
  const ListStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'left'
  }

  return (
    <div key={key} style={{  }}>
      <h2>{payData.first} {payData.last},</h2>
      <h3>Social Security Number: {payData.ssn}</h3>
      <ul style={{display: "flex", flexDirection: "column"}}>
        <li style={ListStyle}>Wage: <span>${payData.wage.toFixed(2)}</span></li>
        <li style={ListStyle}>Reg Hours: <span>{payData.hours.toFixed(2)}</span></li>
        <li style={ListStyle}>Reg Pay: <span>${payData.pay.toFixed(2)}</span></li>
        <li style={ListStyle}>OT Hours: <span>{payData.overtime}</span></li>
        <li style={ListStyle}>OT Pay: <span>${payData.overtime_pay.toFixed(2)}</span></li>
        <li style={ListStyle}>Taxes: <span>${payData.taxes.toFixed(2)}</span></li>
        <li style={ListStyle}>Insurance: <span>$12.00</span></li>
      </ul>
      <h3>Total Pay: $<span>{payData.total_pay.toFixed(2)}</span></h3>
      { delim && <div style={{ width: "100%", border: "2px white solid" }}></div> }
    </div>

  )
} 

function App() {

  const [isLoading, setIsLoading] = useState(false)
  const [warning, setWarning] = useState("")
  const [file, setFile] = useState<File>()
  const [payroll, setPayroll] = useState<any[]>()

  // Handle form on submit to send csv file to server
  const handleFormSubmit = async (e : React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault()
    if (isLoading) return

    console.log(file)

    if (!file) {
      setWarning("Please upload a valid .csv file")
      return;
    }

    // Send file as a binary in form data
    const formData = new FormData()
    formData.append("file", file)

    setIsLoading(true)

    const response = await axios.post("http://localhost:5000", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    setIsLoading(false)

    // Raise warning when server respond but has an error
    if (!response.data.ok) {
      setWarning(response.data.message)
    }

    // Update the payroll variable
    console.log(response.data.payroll)
    setPayroll(response.data.payroll)
  }


  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <label htmlFor="csv-file" style={{ fontSize: "30px", margin: "20px" }}>Upload file (.csv) to get payroll</label>
        <input type="file" id="csv-file" style={{ fontSize: "20px", margin: "10px" }} onChange={(e) => { setFile(e.target.files![0]); setWarning("") }}/>
        <div style={{ color: "red" }}>{warning}</div>
        <input type="submit" disabled={isLoading} value="Upload File" style={{ fontSize: "25px", margin: "30px" }} />
      </form>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        {payroll && payroll.map((entry, index) => PayDisplay(entry, index != payroll.length, index))}
      </div>
    </>
  )
}

export default App
