import {StyleProvider} from "@ant-design/cssinjs"
import Button from "antd/es/button"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {PlasmoCSConfig, PlasmoGetOverlayAnchor, PlasmoGetShadowHostId} from "plasmo"
import MaestroRoot from "~components/MaestroRoot";
import styleText from "data-text:./style/style.css"

import {ThemeProvider} from "~theme"

export const config: PlasmoCSConfig = {
    matches: ["https://chat.openai.com/*"]
}

const HOST_ID = "engage-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID
export const getInlineAnchor: PlasmoGetOverlayAnchor = async () =>
    document.querySelector(`[role="presentation"]`)

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = `${antdResetCssText}\n${styleText}`
    return style
}

const EngageOverlay = () => (
    <ThemeProvider>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
            <MaestroRoot/>
        </StyleProvider>
    </ThemeProvider>
)

export default EngageOverlay
