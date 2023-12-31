import React, {useState} from "react"
import {Button, Card, Select, Space, Spin} from "antd";
import PromptLibraryModal from "~components/PromptLibraryModal";
import {useStorage} from "@plasmohq/storage/hook"
import type {PromptTemplate} from "~types";
import RoleVariablesEditor from "~components/RoleVariablesEditor";
import format from "string-template"
import {CloseOutlined} from "@ant-design/icons";

type MaestroRootProps = {
    onCollapse: () => void
}
const HOST_ID = "engage-csui"
export default function MaestroRoot(props: MaestroRootProps) {
    const [selectedRole, setSelectedRole] = useState<PromptTemplate | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [variables, setVariables] = useState<{ [key: string]: string }>({});
    const [roles] = useStorage<PromptTemplate[]>("roles")
    const applyRole = () => {
        // set text to hello world
        const promptText = (document.querySelector("textarea#prompt-textarea") as HTMLTextAreaElement)
        promptText.value = format(selectedRole?.content ?? '', variables)
        promptText.style.height = "auto";
        promptText.style.height = promptText.scrollHeight + "px";
        // Create and dispatch the event to enable send button
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        promptText.dispatchEvent(event);
    }
    const handleVariableChange = (variableName: string, value: string) => {
        setVariables(variables => ({
            ...variables,
            [variableName]: value
        }))
    }
    const handleModalOk = () => {
        setIsModalOpen(false)
    }
    const handleModalCancel = () => {
        setIsModalOpen(false)
    }
    const renderRoleSelect = () => {
        if (!roles) {
            return <Spin/>
        }
        return (
            <Select
                showSearch
                style={{width: 200}}
                placeholder="Search to Select"
                // @ts-ignore
                getPopupContainer={() => document.getElementById(HOST_ID).shadowRoot}
                dropdownStyle={{zIndex: 2147483647}}
                optionFilterProp="children"
                onChange={(value) => {
                    setSelectedRole(roles.find(role => role.name === value) ?? null)
                }}
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={roles.map(role => ({
                    label: role.name,
                    value: role.name,
                }))}
            />
        )
    }
    return (
        <>
            <PromptLibraryModal isModalOpen={isModalOpen} onCancel={handleModalCancel}/>
            <Card className="maestro-root-card"
                  size="small"
                  title="maestro"
                  extra={
                      <>
                          <Button onClick={() => {
                              setIsModalOpen(true)
                          }} type="link">Manage Prompts</Button>
                          <Button icon={<CloseOutlined/>} style={{border: "none"}} onClick={props.onCollapse}/>
                      </>
                  }
                  style={{width: 300}}>
                <Space size="middle">
                    {renderRoleSelect()}
                    <Button type="primary" onClick={applyRole}>Apply</Button>
                </Space>
                <RoleVariablesEditor onVariableChange={handleVariableChange} role={selectedRole}/>
            </Card>
        </>
    )
}
