// src/components/Table.jsx
import React from "react";

const Table = ({
  data,
  columns,
  tableContainerClassName,
  tableClassName,
  tableHeadClassName,
  tableRowClassName,
  tableCellClassName,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md mb-6 ${
        tableContainerClassName || ""
      }`}
    >
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-gray-200 ${
            tableClassName || ""
          }`}
        >
          <thead className={tableHeadClassName || "bg-gray-200 text-black"}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={tableRowClassName || ""}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      tableCellClassName || "text-gray-500"
                    }`}
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
