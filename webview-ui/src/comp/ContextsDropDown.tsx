import { VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ContextDropDownList() {
    const [contextsDropDown, setContextDropDown] = useState([]);

    useEffect(() => {
        window.addEventListener("message", event =>
			setContextDropDown(JSON.parse(event.data.contexts).map((c: any) => c.context.name)));
    })

    return (
        <>
        {contextsDropDown.map(option =>  {
            return <VSCodeOption label={option} value={option}> {option} </VSCodeOption>
            }
          )
        }
        </>
    );
}

export default ContextDropDownList
