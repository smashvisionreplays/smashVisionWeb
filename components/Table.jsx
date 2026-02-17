/*
This component is a simple table component that takes two props: columns and data.
you can use this component to display data in a table format by jsut passing the columns and then the data.

This is how the props should be, where livesColumns is columns and livesData is passed as data prop.

const livesColumns = ["Court", "State", "Link", "Notes"];
const livesData = [
  { Court: "Court 1", State: "Live", Link: "http://example.com/live/1", Notes: "Ongoing match" },
  { Court: "Court 2", State: "Offline", Link: "-", Notes: "No live feed available" },
  { Court: "Court 3", State: "Live", Link: "http://example.com/live/3", Notes: "Tournament Finals" },
  { Court: "Court 4", State: "Paused", Link: "http://example.com/live/4", Notes: "Technical Issue" },
  { Court: "Court 5", State: "Offline", Link: "-", Notes: "Scheduled maintenance" },
];
*/
const Table = ({ columns, data }) => {
    return (
      // Block 
      <div className="block sm:absolute "> 
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full backdrop-blur-sm text-sm max-sm:text-xs text-left rtl:text-right text-gray-400">
          <thead className="text-xs text-white-700 uppercase rounded-xl bg-white/10 p-3 text-gray-400">
            <tr>
              {columns.map((column, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="odd:bg-gray-500/5 even:bg-gray-700/50 border-b border-gray-600/50"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-white"
                  >
                    {row[column]}
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
  