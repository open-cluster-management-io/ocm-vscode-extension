import { useState, useEffect } from 'react';
import { ConnectedContext } from '../../../src/data/builder'
import { Title } from '@patternfly/react-core';

export default function ShowSelectedContext() {
    let [selectedContext, setSelectedContext] = useState<ConnectedContext>();

	useEffect(() => {
        window.addEventListener("message", event => {
			if ('selectedContext' in event.data.msg) {
				setSelectedContext(JSON.parse(event.data.msg.selectedContext));
			}
		});
    });

	return (
        <section>
			{ selectedContext &&
				<>
					<Title headingLevel='h1' size='2xl' >{ selectedContext.name }</Title>
					<br/>
					<br/>
					<p><b>Cluster Name:</b> { selectedContext.cluster.name }</p>
					<p><b>User:</b> { selectedContext.user.name }</p>			
				</>
			}
		</section>
    );
}
