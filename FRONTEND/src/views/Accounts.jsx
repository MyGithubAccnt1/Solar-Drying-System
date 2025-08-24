import { useState, useEffect } from "react";
import axios from "axios";
import TableSkeleton from "../component/TableSkeleton";
import Table from "../component/Table";
import Pagination from "../utils/Pagination";
import Search from "../component/Search";
import Modal from "../component/Modal";
import Button from "../component/Button";
import Loading from "../component/Loading";

function Accounts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const tableHeadings = [
    "First Name",
    "Middle Initial",
    "Last Name",
    "Email",
    "Role",
  ];

  const tableDataCell = [
    "first_name",
    "middle_initial",
    "last_name",
    "email",
    "role",
  ];

  const fieldsFilter = [
    {
      label: "Role",
      type: "select",
      name: "role",
      option: [
        { value: "all", phrase: "All" },
        { value: "owner", phrase: "Owner" },
        { value: "farmer", phrase: "Farmer" },
      ],
    },
  ];

  const handleSubmitFilter = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const Myalert = `
      Role: ${data.role}`;
    alert(Myalert);
    setFilter(data.role);
    setLoading(false);
    setModalFilter(false);
  };

  const fieldsAdd = [
    {
      label: "First Name",
      type: "text",
      placeholder: "ex. First Name",
      required: true,
      name: "first_name",
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "ex. Last Name",
      required: true,
      name: "last_name",
    },
    {
      label: "Password",
      type: "password",
      minLength: 6,
      maxLength: 16,
      placeholder: "Enter 8-16 characters",
      required: true,
      name: "password",
    },
    {
      label: "Role",
      type: "select",
      name: "role",
      option: [
        { value: "farmer", phrase: "Farmer" },
        { value: "owner", phrase: "Solar-Dryer Owner" },
      ],
    },
    {
      label: "Email",
      type: "email",
      placeholder: "Enter a valid email address",
      required: true,
      name: "email",
    },
  ];

  const handleSubmitAdd = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const Myalert = `
      First Name: ${data.first_name}\n
      Last Name: ${data.last_name}\n
      Password: ${data.password}\n
      Role: ${data.role}\n
      Email: ${data.email}`;
    alert(Myalert);
    setData((prevData) => [...prevData, data]);
    setLoading(false);
    setModalAdd(false);
  };

  const Endpoint = "";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      const offset = (currentPage - 1) * limit;
      try {
        const res = await axios.get(Endpoint, {
          params: {
            offset,
            limit,
          },
        });

        const { Results } = res.data;
        setData(
          Array.isArray(Results)
            ? Results.map((data) => {
                return {
                  first_name: data.first_name,
                  middle_initial: data.middle_initial,
                  last_name: data.last_name,
                  email: data.email,
                  role: data.role,
                };
              })
            : []
        );
        throw new Error("Simulated error for testing purposes.");
      } catch (error) {
        console.log(error);
        // setIsError(true);
        function FakeFallbackData() {
          return Array.from({ length: 4 }, (_, i) => ({
            first_name: `First Name ${i + 1}`,
            middle_initial: `Middle Initial ${i + 1}`,
            last_name: `Last Name ${i + 1}`,
            email: `Email ${i + 1}`,
            role: i % 2 === 0 ? "Owner" : "Farmer",
          }));
        }
        setData(FakeFallbackData());
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [limit, currentPage]);

  const FilteredData = data.filter((info) => {
    const filterByFilters =
      filter && filter !== "all"
        ? info.role.toLowerCase().includes(filter.toLowerCase())
        : true;

    const filterBySearch = search
      ? Object.entries(info)
          .filter(([key]) => key !== "role")
          .some(([, value]) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      : true;
    return filterByFilters && filterBySearch;
  });

  const totalPages = Math.max(1, Math.ceil(FilteredData.length / limit));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * limit;

  if (isError)
    return (
      <div className="absolute top-0 left-0 w-full h-[calc(100dvh-56px)] text-5xl flex justify-center items-center font-bold py-5">
        Error while fetching the data
      </div>
    );
  return (
    <>
      {loading && <Loading />}
      {modalFilter && (
        <Modal
          setModal={setModalFilter}
          handleSubmit={handleSubmitFilter}
          fields={fieldsFilter}
          title={"Filters"}
          button_name={"Apply Role"}
        />
      )}
      {modalAdd && (
        <Modal
          setModal={setModalAdd}
          handleSubmit={handleSubmitAdd}
          fields={fieldsAdd}
          title={"Registration"}
          button_name={"Register"}
        />
      )}
      <div
        className={`w-full lg:bg-[rgba(0,0,0,0.1)] lg:backdrop-blur-[6px] rounded-lg lg:p-5 ${
          modalFilter || modalAdd ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        <Search setSearch={setSearch} setModal={setModalFilter} />
        <div className="w-full text-right mt-5">
          <Button
            onClick={() => setModalAdd(true)}
            className={"bg-green-600 hover:bg-green-700 text-white"}
          >
            Create Account
          </Button>
        </div>
        <div className="w-full lg:bg-gray-300 rounded-lg lg:p-5 my-5">
          <div className="overflow-auto max-h-[400px]">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <Table
                  data={FilteredData.slice(startIndex, startIndex + limit)}
                  startIndex={startIndex}
                  tableHeadings={tableHeadings}
                  tableDataCell={tableDataCell}
                />
                {FilteredData?.length === 0 && (
                  <>
                    <div className="hidden lg:flex justify-center items-center font-bold py-5">
                      No Accounts Found.
                    </div>

                    <div className="rounded-md flex flex-col">
                      <div className="bg-[rgb(138,183,45)] p-2 flex justify-end rounded-t-md">
                        <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] font-bold rounded-full bg-white">
                          0
                        </div>
                      </div>
                      <div className="lg:hidden p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] rounded-b-md text-center font-bold">
                        No Accounts Found.
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentPageSafe={currentPageSafe}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

export default Accounts;
