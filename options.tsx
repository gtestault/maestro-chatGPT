import Button from "antd/es/button"

import { ThemeProvider } from "~theme"

function IndexOption() {
  return (
    <ThemeProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16
        }}>
        <h1>
            No Options At This Time: Coming Soon
        </h1>
      </div>
    </ThemeProvider>
  )
}

export default IndexOption
