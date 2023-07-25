import React from "react"
import {Alert, Divider, Modal} from "antd";
import {useStorage} from "@plasmohq/storage/hook";
import type {PromptTemplate} from "~types";
import {Button} from "antd";
import {validateRoles} from "~utils/validation";
import PromptLibraryViewer from "~components/PromptLibraryViewer";
import PromptTemplateEditor from "~components/PromptTemplateEditor";
import type {PromptTemplateWithOldName} from "~components/PromptTemplateEditor";

type PromptLibraryModalProps = {
    isModalOpen: boolean
    onCancel: () => void
}

type NewPromptTemplate = undefined
const HOST_ID = "engage-csui"
export default function PromptLibraryModal({isModalOpen, onCancel}: PromptLibraryModalProps) {
    const [roles, setRoles] = useStorage<PromptTemplate[]>("roles")
    const [editorActive, setEditorActive] = React.useState<boolean>(false)
    const [editorActivePromptTemplate, setEditorActivePromptTemplate] = React.useState<PromptTemplate | undefined>(undefined)
    const [error, setError] = React.useState<string | null>(null)
    const [importSuccess, setImportSuccess] = React.useState<string | null>(null)
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
            setImportSuccess(file.name)
            setError(null)
        }
        input.click()
    }
    const handleDeletePromptTemplate = (promptTemplate: PromptTemplate) => {
        setRoles(roles => roles.filter(role => role.name !== promptTemplate.name))
    }
    const handleEditPromptTemplate = (promptTemplate: PromptTemplate) => {
        setEditorActive(true)
        setEditorActivePromptTemplate(promptTemplate)
    }
    const handleSavePromptTemplate = (promptTemplate: PromptTemplateWithOldName) => {
        // Create new prompt template if it doesn't exist, but only if old name is undefined, otherwise we're editing
        // an existing prompt template
        if (!promptTemplate.oldName) {
            setRoles(roles => [...roles, promptTemplate])
        } else {
            setRoles(roles => roles.map(role => role.name === promptTemplate.oldName ? promptTemplate : role))
        }
        setEditorActive(false)
    }
    const handleCreateNewTemplate = () => {
        setEditorActive(true)
        setEditorActivePromptTemplate(undefined)
    }

    const renderEditor = () => {
        if (editorActive) {
            return (
                <PromptTemplateEditor onAbort={() => setEditorActive(null)}
                                      promptTemplate={editorActivePromptTemplate}
                                      onConfirm={handleSavePromptTemplate}/>
            )
        }
    }
    const renderViewer = () => {
        if (!editorActive) {
            return (
                <>
                    <Button onClick={handleCreateNewTemplate} type="primary"
                            className="maestro-library-create-new-template-btn">Create New Template</Button>
                    <PromptLibraryViewer onDeletePromptTemplate={handleDeletePromptTemplate}
                                         onEditPromptTemplate={handleEditPromptTemplate}
                                         promptTemplates={roles}/>
                </>
            )
        }
    }

    return (
        <Modal
            title="Prompt collection"
            open={isModalOpen}
            onCancel={onCancel}
            footer={null}
            // @ts-ignore
            getContainer={() => document.getElementById(HOST_ID).shadowRoot}
        >
            <div className="maestro-library-card-content">
                <div className="maestro-modal-import-buttons">
                    <Button onClick={handleExportJson}>Export JSON</Button>
                    <Button onClick={handleImportJson}>Import JSON</Button>
                </div>
                {error && <Alert message={error} type="error" showIcon/>}
                {importSuccess &&
                    <Alert message={`Imported prompt templates from ${importSuccess}`} type="success" showIcon/>}
                <div>
                    <Divider orientation="left">Editor</Divider>
                    {renderEditor()}
                    {renderViewer()}
                </div>
            </div>
        </Modal>
    )
}
