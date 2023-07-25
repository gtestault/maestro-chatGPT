import React from "react"
import {List, Popconfirm} from "antd";
import type {PromptTemplate} from "~types";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {Button} from "antd";

type PromptLibraryViewerProps = {
    promptTemplates: PromptTemplate[]
    onDeletePromptTemplate: (promptTemplate: PromptTemplate) => void
    onEditPromptTemplate: (promptTemplate: PromptTemplate) => void
}
const HOST_ID = "engage-csui"
export default function PromptLibraryViewer({promptTemplates, onDeletePromptTemplate, onEditPromptTemplate}: PromptLibraryViewerProps) {
    // test for a lot of roles for overflow
    const actions = (template) => [
            <Button icon={<EditOutlined/>} onClick={() => onEditPromptTemplate(template)}/>,
        (
            <Popconfirm title={`Are you sure you want to delete this prompt template?`}
                        onConfirm={() => onDeletePromptTemplate(template)}
                        okText="Yes"
                        // @ts-ignore
                        getPopupContainer={() => document.getElementById(HOST_ID).shadowRoot}
                        cancelText="No">
            <Button icon={<DeleteOutlined/>}/>
            </Popconfirm>
        )
    ]

    return (
        <div className="maestro-library-list">
            <List dataSource={promptTemplates}
                  renderItem={template => (
                      <List.Item actions={actions(template)}>
                          <List.Item.Meta

                              title={template.name}
                              description={template.description}/>
                      </List.Item>
                  )}
            />
        </div>
    )
}
