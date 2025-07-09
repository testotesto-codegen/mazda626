import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {
  selectActiveSessionData,
  updateActiveSessionData,
} from "@/redux/slices";

const TableOfContents = ({ data }) => {
  const dispatch = useDispatch();

  const selectedFiling =
    useSelector((state) =>
      selectActiveSessionData(state, "filing.selectedFiling"),
    ) || undefined;

  const handleClick = (filling) => {
    if (!filling || filling.length != 1) return;
    if (selectedFiling && selectedFiling === filling[0]) return;
    dispatch(
      updateActiveSessionData({
        dataPath: "filing.selectedFiling",
        value: filling[0],
      }),
    );
  };

  return (
    <div className="p-4 rounded shadow">
      <div className="flex items-center justify-center mb-4">
        <h1 className="font-bold text-3xl">Related Documents</h1>
      </div>

      <ul>
        {Object.entries(data)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .slice(0, 4)
          .map(([year, quarters]) => (
            <li key={year} className="mb-2">
              <div className="font-bold text-lg text-gray-500">{year}</div>
              <ul className="ml-4">
                {Object.entries(quarters).map(([quarter, filings]) => (
                  <li key={quarter}>
                    <ul>
                      {Object.entries(filings).map(([fillingType, filling]) => (
                        <li key={fillingType}>
                          <div
                            className={`text-gray-200 cursor-pointer hover:text-white transition-colors ${selectedFiling.accession_number === filling[0].accession_number ? " font-bold" : ""}`}
                            onClick={() => handleClick(filling)}
                          >
                            {quarter} - {fillingType}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

TableOfContents.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TableOfContents;
