import React from "react"
import {Alert, Divider, Modal} from "antd";
import {useStorage} from "@plasmohq/storage/hook";
import type {Role} from "~types";
import {Button} from "antd";
import {validateRoles} from "~utils/validation";

type ApplyRoleModalProps = {
    isModalOpen: boolean
    onOk: () => void
    onCancel: () => void
}
const HOST_ID = "engage-csui"
export default function ApplyRoleModal({isModalOpen, onOk, onCancel}: ApplyRoleModalProps) {
    const [roles, setRoles] = useStorage<Role[]>("roles")
    const [error, setError] = React.useState<string | null>(null)
    const handleExportJson = () => {
        // download json
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roles))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "roles.json")
        document.body.appendChild(downloadAnchorNode) // required for firefox
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }
    const handleImportJson = () => {
        // upload json
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0]
            if (!file) {
                return
            }
            const text = await file.text()
            try {
                const json = JSON.parse(text)
                validateRoles(json)
                setRoles(json)
            } catch (e) {
                console.error(e)
                setError(`Invalid JSON: ${e.message}`)
            }
        }
        input.click()
    }

    return (
        <Modal
            title="Prompt collection"
            open={isModalOpen}
            onOk={onOk}
            onCancel={onCancel}
            // @ts-ignore
            getContainer={() => document.getElementById(HOST_ID).shadowRoot}
        >
            <div className="maestro-roles-editor-content">
                <div className="maestro-modal-import-buttons">
                    <Button onClick={handleExportJson}>Export JSON</Button>
                    <Button onClick={handleImportJson}>Import JSON</Button>
                </div>
                {error && <Alert message={error} type="error" showIcon/>}
                <Alert showIcon message="prompt editor is in development"/>
            </div>
        </Modal>
    )
}
