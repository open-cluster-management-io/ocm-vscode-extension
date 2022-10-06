import { VSCodeBadge} from  "@vscode/webview-ui-toolkit/react";
import React from "react";

type Props = {activeApps:string, errorApps:string}


class AppsStatus extends React.Component<Props> {
    render() {
        return (       
            <div> 
            <p>Active Apps <VSCodeBadge>{this.props.activeApps}</VSCodeBadge>  </p>               
            <p>Error Apps  <VSCodeBadge>{this.props.errorApps}</VSCodeBadge> </p> 
            </div> 
        );
    }
}
export default AppsStatus;
