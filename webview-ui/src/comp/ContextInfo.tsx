import { useState, useEffect } from 'react';

function ShowContextInfo() {
    const [contextInfo = {name: "", cluster: "", user: ""}, setContextInfo] = useState();
    useEffect(() => {
        window.addEventListener("message", event => {
			if ('contextInfo' in event.data) {
				setContextInfo(event.data.contextInfo);
			}
		});
    },[])

	return (
        <section>
			{
				<>
					<h1>{ contextInfo.name }</h1>
					<p><b>Cluster:</b> <br/>{ contextInfo.cluster }</p>
					<p><b>User:</b> <br/>{ contextInfo.user }</p>
				</>
			}
		</section>
    )
}

export default ShowContextInfo
