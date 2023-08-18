import {StyleProvider} from "@ant-design/cssinjs"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {PlasmoCSConfig, PlasmoGetOverlayAnchor, PlasmoGetShadowHostId} from "plasmo"
import MaestroRoot from "~components/MaestroRoot";
import styleText from "data-text:./style/style.css"

import {ThemeProvider} from "~theme"
import MinimizedSwitcher from "~components/MinimizedSwitcher";
import {useEffect, useState} from "react";

export const config: PlasmoCSConfig = {
    matches: ["https://chat.openai.com/*"]
}

const HOST_ID = "engage-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID
export const getInlineAnchor: PlasmoGetOverlayAnchor = async () =>
    document.querySelector(`textarea#prompt-textarea`).parentNode.parentNode as Element

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = `${antdResetCssText}\n${styleText}`
    return style
}

const EngageOverlay = () => {
    const [isRootMinimized, setIsRootMinimized] = useState(true)
    useEffect(() => {
        // set the #engage-csui to flex self align end
        const injectedView = document.querySelector('#engage-csui')
        if (injectedView) {
            injectedView.setAttribute("style", "display: flex; align-self: end; margin-bottom: 4px;")
        }
    }, [])
    const handleMinimizerClick = () => {
        setIsRootMinimized(false)
    }
    const handleRootCollapse = () => {
        setIsRootMinimized(true)
    }
    return (
        <ThemeProvider>
            <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
                <MinimizedSwitcher isMinimized={isRootMinimized} onClick={handleMinimizerClick}>
                    <MaestroRoot onCollapse={handleRootCollapse}/>
                </MinimizedSwitcher>
            </StyleProvider>
        </ThemeProvider>
    )
}

export default EngageOverlay
