import React, { useState } from "react";
import resultList from "../utils/mockData";


const HierarchicalTable = () => {
  const [salesData, setSalesData] = useState(resultList);


  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {salesData.map((category) => (
          <React.Fragment key={category.id}>
            <tr>
              <td>{category.label}</td>
              <td>{category.value.toFixed(2)}</td>
              <td>
                <input type="number" id={`input-${category.id}`} />
              </td>
              <td>
                <button>
                  %
                </button>
              </td>
              <td>
                <button>
                  Button2
                </button>
              </td>
              <td>{category.variance ? `${category.variance}%` : "0%"}</td>
            </tr>
            {category.children &&
              category.children.map((child) => (
                <tr key={child.id}>
                  <td>-- {child.label}</td>
                  <td>{child.value.toFixed(2)}</td>
                  <td>
                    <input type="number" id={`input-${child.id}`} />
                  </td>
                  <td>
                    <button>
                      %
                    </button>
                  </td>
                  <td>
                    <button>
                      Button2
                    </button>
                  </td>
                  <td>{child.variance ? `${child.variance}%` : "0%"}</td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default HierarchicalTable;
