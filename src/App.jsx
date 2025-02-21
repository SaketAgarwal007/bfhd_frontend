"use client"

import { useState } from "react"
import Select from "react-select"
import axios from "axios"
import "./styles.css"

export default function App() {
  const [jsonInput, setJsonInput] = useState("")
  const [responseData, setResponseData] = useState(null)
  const [error, setError] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ]

  const validateAndParseJSON = (input) => {
    try {
      const parsed = JSON.parse(input)
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Invalid JSON! Ensure format: { "data": ["A", "1", "B"] }')
      }
      return parsed
    } catch (err) {
      throw new Error("Invalid JSON format. Enter a valid JSON object.")
    }
  }

  const handleSubmit = async () => {
    try {
      setError("")
      setIsLoading(true)
      setResponseData(null) // Reset previous response

      const parsedData = validateAndParseJSON(jsonInput)

      const response = await axios.post("https://bfhd-backend.onrender.com/bfhl", parsedData, {
        headers: { "Content-Type": "application/json" },
      })

      setResponseData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const formatResponse = (key, value) => {
    return Array.isArray(value) ? value.join(", ") : value
  }

  return (
    <div className="app-container">
      <div className="content-card">
        <h1 className="title">Bajaj Finserv Health Dev Challenge</h1>
        <div className="input-container">
          <div className="input-label">API Input</div>
          <textarea
            placeholder='Enter JSON (e.g. { "data": ["M", "1", "334", "4", "B"] })'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="json-input"
            spellCheck="false"
          />
          <button onClick={handleSubmit} className="submit-button" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {responseData && (
          <div className="response-container">
            <div className="filter-label">Multi Filter</div>
            <Select
              options={options}
              isMulti
              onChange={setSelectedOptions}
              className="filter-select"
              classNamePrefix="filter"
              placeholder="Select filters"
            />

            {selectedOptions.length > 0 && (
              <div className="response-section">
                <div className="response-title">Filtered Response</div>
                {selectedOptions.map((opt) => (
                  <div key={opt.value} className="response-item">
                    {opt.label}: {formatResponse(opt.value, responseData[opt.value])}
                  </div>
                ))}
                <div className="separator" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
