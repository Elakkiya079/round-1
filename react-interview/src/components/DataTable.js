import React, { useState } from "react";
import resultList from "../utils/mockData";

const calculateVariance = (original, updated) => {
  return ((updated - original) / original) * 100;
};

const applyPercentageIncrease = (category, percentage,findVal) => {
  let newValue = category.value * (1 + percentage / 100);
  const variance = calculateVariance(category.value, newValue);
  
  return { ...category, value: newValue, variance: variance.toFixed(2) };
};



const updateDirectValue = (item, newValue) => {
  const variance = calculateVariance(item.value, newValue);
  return { ...item, value: newValue, variance: variance.toFixed(2) };
};

const updateSubtotal = (category, newTotal) => {
  const originalTotal = category.value;
  const proportionMap = category.children.map(child => ({
    id: child.id,
    proportion: child.value / originalTotal,
  }));
  
  return {
    ...category,
    value: newTotal,
    variance: calculateVariance(originalTotal, newTotal).toFixed(2),
    children: category.children.map(child => {
      const newChildValue = newTotal * proportionMap.find(p => p.id === child.id).proportion;
      return { ...child, value: newChildValue, variance: calculateVariance(child.value, newChildValue).toFixed(2) };
    })
  };
};

const HierarchicalTable = () => {
  const [salesData, setSalesData] = useState(resultList);

  const updateValue = (id, type, inputValue) => {
    const newData = salesData.map(category => {
      if (category.id === id) {
        if (type === "percent") {
          return applyPercentageIncrease(category, inputValue,"parent");
        } else if (type === "value") {
          return updateDirectValue(category, inputValue);
        } else if (type === "subtotal") {
          return updateSubtotal(category, inputValue);
        }
      } else if (category.children) {
        return {
          ...category,
          children: category.children.map(child => {
            if (child.id === id) {
              if (type === "percent") {
                return applyPercentageIncrease(child, inputValue,"child");
              } else {
                return updateDirectValue(child, inputValue);
              }
            }
            return child;
          })
        };
      }
      return category;
    });
    setSalesData(newData);
  };

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
                <button onClick={() => updateValue(category.id, "percent", parseFloat(document.getElementById(`input-${category.id}`).value || 0))}>
                  %
                </button>
              </td>
              <td>
                <button onClick={() => updateValue(category.id, "value", parseFloat(document.getElementById(`input-${category.id}`).value || 0))}>
                  Whole
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
                    <button onClick={() => updateValue(child.id, "percent", parseFloat(document.getElementById(`input-${child.id}`).value || 0))}>
                      %
                    </button>
                  </td>
                  <td>
                    <button onClick={() => updateValue(child.id, "value", parseFloat(document.getElementById(`input-${child.id}`).value || 0))}>
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
