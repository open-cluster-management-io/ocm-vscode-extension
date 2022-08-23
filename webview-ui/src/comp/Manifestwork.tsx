// show manifest work per managedcluster resource on the hubcluster 
/* 
- iterate on all the managedclsuter for hub and check out for manifestwork in the namespace equil to cluster name ( oc get manifest work -n $MANAGESCLUSTER resource name )
- than pull all manfidest work  */ 
<<<<<<< HEAD
import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';


function ShowManifestWork() {
    const [manifestWork, setManifestWork] = useState([]);
    useEffect(() => {       
        window.addEventListener("message", event => {
            const appliedManifestWorksList = JSON.parse(event.data.manifestWork) 
            setManifestWork(appliedManifestWorksList) 
            console.log(manifestWork.length)                
         } );          
    },[])
}
 export default ShowManifestWork
=======
export {}
>>>>>>> b475067 (Added More btn functionality)
