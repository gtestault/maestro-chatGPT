import React from "react"
import logo from "data-base64:~assets/icon.png"

type MinimizedSwitcherProps = {
    isMinimized: boolean
    onClick: () => void
    children: React.ReactNode
}
export default function MinimizedSwitcher({isMinimized, onClick, children}: MinimizedSwitcherProps) {
    if (isMinimized) {
        return (
            <img
                onClick={onClick}
                className="maestro-logo"
                alt="maestro-logo"
                width="50px"
                src={logo}/>
        )
    }
    return (
        children
    )
}
