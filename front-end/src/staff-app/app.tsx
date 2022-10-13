import React from "react"
import { Routes, Route } from "react-router-dom"
import "shared/helpers/load-icons"
import { Header } from "staff-app/components/header/header.component"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"
import { DailyCareContextProvider } from "./contexts/daily-care-context"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="daily-care"
          element={
            <DailyCareContextProvider>
              <HomeBoardPage />
            </DailyCareContextProvider>
          }
        />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="*" element={<div>No Match</div>} />
      </Routes>
    </>
  )
}

export default App
