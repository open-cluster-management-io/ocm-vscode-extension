import React, { useState } from 'react';
import { GalleryItem, Card, CardHeader, Title, CardBody, CodeBlock, CodeBlockCode, Accordion, AccordionItem, AccordionToggle, AccordionContent } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, IRow, ICell, ISortBy } from '@patternfly/react-table';


type GalleryComponentProps = {
    id: string
    title: string;
    subtitle?: string;
    rows: (IRow | string[])[]
    cells?: (ICell | string)[] 
    code?: string; 
    sort?: ISortBy;
    children?: React.ReactNode; 
    
};

const DefaultConditionColumns: Object[] = [     
    {title:"Last Transition Time" , }, 
    {title: "Message" ,  },
    {title: "Reason" },
    {title:"Status"   }
]

const GalleryTableComponent: React.FC<GalleryComponentProps> = ({id, title, subtitle='', rows , cells = DefaultConditionColumns , sort = {index: 1, direction:"asc"}, code, children }) => {
            const [expanded, setExpanded] =  useState('');  
            
            const onToggle = (id: string) => {
                        if (id === expanded) {
                        setExpanded('');
                        } else {
                        setExpanded(id);
                        }
                    };
            return (
                <GalleryItem>
                <Card>
                    <CardHeader>
                        <Title headingLevel="h2" size="md">{title}</Title>
                        <br/>
                        <Title headingLevel="h2" size="md">{subtitle}</Title> 
                                        
                    </CardHeader>
                    <CardBody>
                    {children}   
                    {code ? <CodeBlock> 
                                <CodeBlockCode>{code}</CodeBlockCode>
                            </CodeBlock> 
                            : null 
                    }
                                <Accordion> 
                                    <AccordionItem>
                                        <AccordionToggle  onClick={() => {
                                                                            onToggle(`cond-table-${id}`);
                                                                        }}
                                                                        isExpanded={expanded === `cond-table-${id}`}
                                                                        id={`cond-table-${id}`}>
                                            Condition table 
                                        </AccordionToggle>
                                        <AccordionContent id={`cond-${id}`} isHidden={expanded !== `cond-table-${id}`}>
                                            <Table gridBreakPoint="grid-md" rows={rows} cells={cells} sortBy={sort}>
                                                <TableHeader />
                                                <TableBody className="managed-clusters-table" />
                                            </Table>
                        </AccordionContent>   
                    </AccordionItem>
                    </Accordion> 
                                    
                    </CardBody>
                </Card>
                </GalleryItem>
            );
            };

export const ConditionTableComponent: React.FC<GalleryComponentProps> = ({ id='', title, subtitle='', rows, cells = DefaultConditionColumns , sort = {index: 1, direction:"asc"} }) => {
    return (
        <>
        <Title headingLevel="h2" size="md" style={{ marginTop: '40px' }}>{title}</Title>
        <Title headingLevel="h2" size="md">{subtitle}</Title>
        <Table gridBreakPoint= 'grid-md'  rows={rows} cells={cells} sortBy={sort} >
        <TableHeader/>
        <TableBody />   
        </Table>
        </>
    );
};

export default GalleryTableComponent;