import React from "react"
import type {PromptTemplate} from "~types";
import {Divider, Input} from 'antd';

const {TextArea} = Input;

type RoleVariablesEditorProps = {
    role: PromptTemplate | null
    onVariableChange: (variableName: string, value: string) => void
}
export default function RoleVariablesEditor({role, onVariableChange}: RoleVariablesEditorProps) {
    if (!role) {
        return null
    }
    if (!role.variables) {
        return null
    }
    const handleVariableChange = (variable) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(variable)
        onVariableChange(variable, e.target.value)
    }
    return (
        <>
            <Divider plain>Parameters</Divider>
            <div className="role-variables-editor-list">
                {role.variables.map(variable => (
                    <div className="role-variables-editor-list-item">
                        <TextArea
                            rows={1}
                            onChange={handleVariableChange(variable.name)}
                            placeholder={variable.name}
                            value={variable.value}/>
                    </div>
                ))}
            </div>
        </>
    )
}
