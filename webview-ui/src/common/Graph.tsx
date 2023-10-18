import React,  { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { kubeImage } from './common';

export type KubeResource =  {
    group: string //  "apps"
    kind:  string // "Deployment"
    name:  string // "hello-world-deployment"
    namespace:  string // "default"
    resource:  string // "deployments"
    version:  string // "v1"
    icon?: string
    node?: Node 
}

interface ResourceObject {
  [key: string]: string; // Assuming all fields are of string type
}

const resourceTranslationMap:ResourceObject = {
  deployment: 'deploy',
  service: 'svc',
  pod: 'po',
  replicationcontroller: 'rc',
  namespace: 'ns',
  job: 'job',
  daemonset: 'ds',
  statefulset: 'sts',
  persistentvolume: 'pv',
  persistentvolumeclaim: 'pvc',
  configmap: 'cm',
  secret: 'secret',
  ingress: 'ing',
  serviceaccount: 'sa',  
  cronjob: 'cronjob',
  endpoint: 'ep',
  limitrange: 'limits',
  node: 'node',
  storageclass: 'sc',
  customresourcedefinition: 'crd',
  horizontalpodautoscaler: 'hpa',
  networkpolicy: 'netpol',
  role: 'role',
  rolebinding: 'rb',
  clusterrole: 'c-role',
  clusterrolebinding: 'crb',
  // Add more translations as needed
};

export type Node = {
    name: string,
    namespace: string, 
    children:KubeResource[] 
}

interface GraphProps {
  data: Node// Adjust the type based on your nested JSON structure
  images: kubeImage[]
}

export const  Graph: React.FC<GraphProps> = ({ data ,images }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let new_data : Node = { 
      name: data.name,
      namespace: data.namespace,     
      children: data.children.map(mf => { 
            images.forEach( (image: kubeImage)  => {
                          if (resourceTranslationMap[mf.kind.toLowerCase()] === image.name.toLowerCase()) {
                                mf.icon = image.uri 
                                return mf
                          }
                          else if  (resourceTranslationMap[mf.kind.toLowerCase().slice(0, -1)] === image.name.toLowerCase()) {
                            mf.icon = image.uri 
                            return mf
                          }
                            return mf   
                        })    
              return mf
              }) 
    }


    // Set up the D3 graph 

    const svg = d3.select(svgRef.current);

    // Create a D3 tree layout
    const tree = d3.tree().size([400, 180]);

    // Convert the nested JSON object to a hierarchical structure
    const root:any = d3.hierarchy(new_data);
    // Assign positions to the nodes
    tree(root);

    // Nodes
    const nodes = d3.select(`svg g.nodes-${data.name}`)
    .selectAll('circle.node')
    .data(root.descendants())
    .join('g')
    .classed('node', true)   
    .attr('transform', function(d: any) { return `translate(${d.x},${d.y})`; });

    nodes.append('circle')
    .attr('r', 4);
  
    nodes.append('image')
    .attr('xlink:href', function(d: any) { return d.data.icon; })
    .attr('x', -20)
    .attr('y', -12)
    .attr('width', 40)
    .attr('height', 40);

    //add text to node 
    
  
    nodes
      .append('text')   
      .attr('dy', '3.3em') // Adjust the positioning of the text
      .attr('text-anchor', 'middle') // Center the text horizontally
      .text((d: any) => `${d.data.name}`);

    // Links
    d3.select(`svg g.links-${data.name}`)
    .selectAll('line.link')
    .data(root.links())
    .join('line')
    .classed('link', true)
    .attr('x1', function(d: any) {return d.source.x;})
    .attr('y1', function(d: any) {return d.source.y;})
    .attr('x2', function(d: any) {return d.target.x;})
    .attr('y2', function(d: any) {return d.target.y;});

    // Clean up on unmount
    return () => {
        svg.selectAll(`[id=${data.name}]`).remove();
    };
  });

  if (svgRef.current == null) {
      return (
        <svg id={data.name} ref={svgRef} width={400} height={220}>       
            <g transform="translate(5, 5)">
            <g className={`links-${data.name}`}></g>
            <g className={`nodes-${data.name}`}></g>
            </g>
      </svg>
      );
    }
    else { 
      return <></>
    }
}

export default Graph;
