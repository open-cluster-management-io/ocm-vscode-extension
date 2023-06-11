import React from 'react';
import { Label, LabelGroup, Title } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

type LabelProps = {
    labels: Object[] 
}

export const OcmLabels: React.FC<LabelProps> = (Props:LabelProps) => {
    return(
        <>
        <Title headingLevel='h4' size='md' style={{ marginTop: '30px' }}>Labels:</Title>
        <LabelGroup>
        {Object.entries(Props.labels).map(([key, value]) => {          
            return <Label icon={<InfoCircleIcon />} color="blue">{key}:{value.toString()}</Label>
        }) 
        }
      </LabelGroup>
      </>
    )

}