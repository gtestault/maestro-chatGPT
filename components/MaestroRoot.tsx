import React, {useEffect, useState} from "react"
import {Button, Card, Select, Space, Spin} from "antd";
import ApplyRoleModal from "~components/ApplyRoleModal";
import {useStorage} from "@plasmohq/storage/hook"
import type {Role, Variable} from "~types";
import RoleVariablesEditor from "~components/RoleVariablesEditor";
import format from "string-template"

type MaestroRootProps = {}
const HOST_ID = "engage-csui"
export default function MaestroRoot(props: MaestroRootProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [variables, setVariables] = useState<{[key: string]: string}>({});
    useEffect(() => {
        // set the #engage-csui to flex self align end
        const injectedView = document.querySelector('#engage-csui')
        if (injectedView) {
            injectedView.setAttribute("style", "display: flex; align-self: flex-end;")
        }
    })
    const [roles] = useStorage<Role[]>("roles")
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
                onChange={(value) => {setSelectedRole(roles.find(role => role.name === value) ?? null)}}
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
            <ApplyRoleModal isModalOpen={isModalOpen} onOk={handleModalCancel} onCancel={handleModalCancel}/>
            <Card className="maestro-root-card"
                  size="small"
                  title="maestro prompts"
                  extra={<Button onClick={() => {setIsModalOpen(true)}} type="link">Manage Prompts</Button>}
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
