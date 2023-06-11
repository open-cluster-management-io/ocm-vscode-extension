import { useEffect, useState } from "react";
import { PageHeader } from '@patternfly/react-core';

export default function OcmHeader(){
    let [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        window.addEventListener("message", event => {
			if (event.data.images) {
                for (const img of event.data.images) {
                    if (img.name === "ocmLogo") {
                        setImageUrl(img.uri);
                        break; // Exit the loop once the object is found
                    }
                }
			}        
        });
    });

    const LogoImg =  <img src={imageUrl} alt="OCM Logo" />   
    return (
        <PageHeader className="logo" logo={LogoImg} />
    );
    
}
