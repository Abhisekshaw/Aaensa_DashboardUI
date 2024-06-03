import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../utils/Loader";
import Chart from "chart.js/auto";
import {
  OptimizerList,
  clearOptimizerResponse,
} from "../../Slices/Enterprise/OptimizerSlice";

const UsageTrends = (Data) => {
  const dispatch = useDispatch();
  const { deviceData_response, deviceData_error, loading1 } = useSelector(
    (state) => state.reportSlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  const [selectedOption, setSelectedOption] = useState("Hourly");
  const [selectedOptimizerName, setSelectedOptimizerName] = useState(""); //this is Optimizer Name
  const [optimizerList, setOptimizerList] = useState([]);
  const [id, setId] = useState("");
  // Mapping object for options and their corresponding intervals in seconds
  const optionIntervals = {
    "": 0,
    Hourly: "1h",
    Day: "1day",
    Week: "1week",
    Month: "1month",
    Year: "1year",
  };

  // Effect to log the interval when the selected option changes
  let intervalInSeconds = 0;
  useEffect(() => {
    intervalInSeconds = optionIntervals[selectedOption];
  }, [selectedOption, optionIntervals]);

  // Array of options
  const options = Object.keys(optionIntervals);

  const chartRef = useRef(null);
  const labels = ["January", "February", "March", "April", "May", "June"];
  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Thermostat Cutoff(time)",
            backgroundColor: "purple",
            data: [10, 15, 20, 18, 12, 16],
            borderWidth: 1,
          },
          {
            label: "Device Cutoff(time)",
            backgroundColor: "brown",
            data: [90, 85, 85, 90, 70, 82],
            borderWidth: 1,
          },
          {
            label: "Total Runtime",
            backgroundColor: "#0694a2",
            data: [240, 240, 240, 250, 260, 240],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,

        scales: {
          y: {
            beginAtZero: true, // Ensures the y-axis starts at zero
          },
        },

        legend: {
          display: false,
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => myChart.destroy();
  }, []);

  // console.log(Data.Data.gateway_id, "usage");
  const GatewayId = Data.Data.gateway_id;

  // Optimizer

  const { optimizer_response } = useSelector((state) => state.optimizerSlice);

  const Optimizer = async () => {
    dispatch(OptimizerList({ GatewayId, header }));
  };

  const handleFormChange4 = (e) => {
    const { name, value } = e.target;
    // for Gateway id
    const selectedOptimizer = optimizerList.find(
      (item) => item.OptimizerID === value
    );

    setSelectedOptimizerName(selectedOptimizer.OptimizerID);
    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedOptimizer && selectedOptimizer._id) {
      setId(selectedOptimizer._id);
    }
  };

  // End Id's
  useEffect(() => {
    if (
      optimizer_response &&
      optimizer_response.AllEntStateLocationGatewayOptimizer
    ) {
      setOptimizerList(optimizer_response.AllEntStateLocationGatewayOptimizer);

      dispatch(clearOptimizerResponse());
    }
  }, [dispatch, optimizer_response]);

  return (
    <>
      {loading1 && <Loader />}
      <div role="tabpanel">
        <div className="flex  items-center">
          <div className="w-56 flex justify-between items-center ">
            <h4 className="classtitle mr-4">Interval</h4>
            <select
              className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {" "}
              <options></options>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div
            className="w-56 flex justify-between items-center"
            style={{ marginLeft: "2%" }}
          >
            <h4 className="classtitle mr-4">Optimizer</h4>
            <select
              className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
              name="optimizerId"
              // value=""
              onChange={handleFormChange4}
              onFocus={Optimizer}
            >
              {" "}
              <option></option>
              {optimizerList.map((item, index) => (
                <option key={index}>{item.OptimizerID}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="grid gap-6 mb-8 "
          style={{ marginTop: "1%", marginLeft: "2%", marginRight: "2%" }}
        >
          {/* <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 scrollable-container">
            <table className="w-full whitespace-no-wrap ">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">optmizer id</th>
                  <th className="px-4 py-3">Optimizer Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>

                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>

                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>

                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>

                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>

                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <Link className="hover:underline">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">NGCSE123456</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">Office</td>
                </tr>
                
              </tbody>
            </table>
          </div> */}

          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Month On Month Energy Savings
            </h4>

            <canvas ref={chartRef} id="myChart" style={{ maxHeight: "75%" }} />
          </div>
        </div>

        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <table className="w-full whitespace-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Thermostat Cutoff (hrs)</th>
                <th className="px-4 py-3">Device Cutoff (hrs)</th>
                <th className="px-4 py-3">Remaning Runtime(hrs)</th>
                <th className="px-4 py-3">Total Runtime(hrs)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">January</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">10</td>
                <td className="px-4 py-3 text-sm">90</td>
                <td className="px-4 py-3 text-sm">140</td>
                <td className="px-4 py-3 text-sm">240</td>
              </tr>
              <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">February</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">15</td>
                <td className="px-4 py-3 text-sm">85</td>
                <td className="px-4 py-3 text-sm">140</td>
                <td className="px-4 py-3 text-sm">240</td>
              </tr>
              <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">March</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">20</td>
                <td className="px-4 py-3 text-sm">85</td>
                <td className="px-4 py-3 text-sm">135</td>
                <td className="px-4 py-3 text-sm">240</td>
              </tr>
              <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">April</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">18</td>
                <td className="px-4 py-3 text-sm">90</td>
                <td className="px-4 py-3 text-sm">142</td>
                <td className="px-4 py-3 text-sm">250</td>
              </tr>
              <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">May</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">12</td>
                <td className="px-4 py-3 text-sm">70</td>
                <td className="px-4 py-3 text-sm">178</td>
                <td className="px-4 py-3 text-sm">260</td>
              </tr>
              <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">June</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">16</td>
                <td className="px-4 py-3 text-sm">82</td>
                <td className="px-4 py-3 text-sm">142</td>
                <td className="px-4 py-3 text-sm">240</td>
              </tr>
            </tbody>
          </table>
          <div className="block opacity-100" id="matadeta" role="tabpanel">
            <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span className="flex items-center col-span-3">
                {/* {`Page No.  ${page} `} */}
              </span>
              <span className="col-span-2"></span>
              {/* Pagination  */}

              <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul className="inline-flex items-center">
                    <li>
                      <button
                        className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                        style={{ marginRight: "10px" }}
                        aria-label="Previous"
                        onClick={(event) => {
                          // handlePrevClick(event);
                        }}
                      >
                        Prev
                      </button>
                    </li>
                    {/* {renderPaginationButtons()} */}
                    <li>
                      <button
                        className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                        aria-label="Next"
                        onClick={(event) => {
                          // handleNextClick(event);
                        }}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UsageTrends;