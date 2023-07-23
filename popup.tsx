import Button from "antd/es/button"

import { ThemeProvider } from "~theme"

function IndexPopup() {
  return (
    <ThemeProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16
        }}>
        <h1>
            You do not need to do anything here.
        </h1>
          <p>maestro will open automatically on chat.openai.com</p>
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup
