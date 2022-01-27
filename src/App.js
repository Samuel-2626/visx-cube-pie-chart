import { useState } from 'react'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { Text } from '@visx/text'

import cubejs from "@cubejs-client/core";

import { QueryRenderer } from "@cubejs-client/react";


const cubejsApi = cubejs(
  'CUBEJS_TOKEN',
  { apiUrl: 'API URL' }
);

function App() {

  let [active, setActive] = useState(null)

  const width = 400
const half = width / 2 


   return (
     <QueryRenderer
       query={{
         measures: ["Orders.count"],
         timeDimensions: [
           {
             dimension: "Orders.createdAt",
             dateRange: ["2019-01-01", "2020-01-01"],
             granularity: "month"
           }
         ]
       }}
       cubejsApi={cubejsApi}
       render={({ resultSet }) => {
         if (!resultSet) {
           return "Loading...";
         }

console.log(resultSet)

 let orders = resultSet.loadResponse.results[0].data


 const color = ["yellow", "orange", "green", "black", "red", "purple", "tomato"]

 console.log(active);
         

         return (

          <svg width={width} height={width}>
            <Group top={half} left={half}>
              <Pie data={orders} pieValue={(data) => data["Orders.count"]} outerRadius={half} innerRadius={half - 20}
               padAngle={0.01}>
                {pie => {
                  return pie.arcs.map(arc => {
                    return <g key={arc.data["Orders.createdAt"]} 
                    onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
                      <path d={pie.path(arc)} fill={color[~~(Math.random() * color.length)]}></path>
                    </g>
                  })
                }}
              </Pie>
              {active ? 
              <>
              <Text textAnchor="middle" dy={-20} fontSize={40}>
                {active["Orders.count"]} 
              </Text>
              <Text textAnchor="middle" dy={20}>
              {active["Orders.createdAt"]} 
              </Text>
              </>
              : 
              <>
              <Text textAnchor="middle" dy={-20} fontSize={40}>
                {orders.reduce((acc, order)=> acc + parseInt(order["Orders.count"]), 0)} 
              </Text>
              <Text textAnchor="middle" dy={20}>
              total orders
              </Text>
              </>}
              
            </Group>
          </svg>

         );
       }}
     />
   );
 }


export default App;
