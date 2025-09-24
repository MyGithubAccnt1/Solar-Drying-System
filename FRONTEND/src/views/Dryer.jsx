import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillStar } from "react-icons/ai";
import { CgArrowUp, CgArrowDown } from "react-icons/cg";
import Button from "../component/Button";
import Modal from "../component/Modal";

export function DynamicMap({ location }) {
  let Location =
    String(location).includes("Sablayan") ||
    String(location).includes("Occidental Mindoro")
      ? ""
      : location + ", Sablayan, Occidental Mindoro";
  const encodedLocation = encodeURIComponent(Location);
  const mapSrc = `https://maps.google.com/maps?q=${encodedLocation}&output=embed`;

  return (
    <div>
      <span>Location: </span>
      <b>{Location}</b>
      <iframe
        src={mapSrc}
        className="border-0 w-full h-full"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default function Dryer() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("id");
  const [selectedDryerId, setSelectedDryerId] = useState(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const token = localStorage.getItem("token");   
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API}/dryers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setData(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
        setTimeout(() => {
          navigate("/home/create-reservation");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const ratings = [
    {
      user: "User0001",
      rating: 5,
      comment:
        "As someone who values quality, I wholeheartedly recommend this.",
    },
    {
      user: "User0002",
      rating: 4,
      comment: "Using their tools, we streamlined our operations.",
    },
  ];

  const fieldsAdd = [
    {
      label: "Crop Type",
      type: "text",
      placeholder: "ex. Rice",
      required: true,
      name: "crop_type",
    },
    {
      label: "Quantity (Cavans)",
      type: "number",
      min: 1,
      placeholder: "ex. 50",
      required: true,
      name: "quantity",
    },
    {
      label: "Payment Type",
      type: "select",
      name: "payment",
      options: [{ value: "gcash" }, { value: "cash" }],
    },
  ];

  const handleSubmitAdd = async (dryerId, ownerId, formData) => {
    if (!farmerId) return alert("You must be logged in!");

    const { crop_type, quantity, payment } = formData;

    if (!crop_type || !quantity || quantity <= 0) {
      return alert("Invalid crop type or quantity.");
    }

    try {
      setLoading(true);

      const check = await axios.get(
        `${import.meta.env.VITE_API}/reservations`,
        { params: { farmer_id: farmerId, dryer_id: dryerId } }
      );

      if (check.data.exists) {
        alert("You have already reserved this dryer.");
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_API}/reservations`, {
        farmer_id: farmerId,
        dryer_id: dryerId,
        owner_id: ownerId,
        status: "pending",
        crop_type: formData.crop_type,
        quantity: formData.quantity,
        payment: formData.payment,
      });

      alert("Reservation created successfully!");
      console.log(res.data);
      setModalAdd(false);
    } catch (error) {
      console.error(
        "Reservation error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    handleSubmitAdd(selectedDryerId, selectedOwnerId, formData);
  };
  return (
    <>
      {loading && <Loading />}
      <ToastContainer position="top-center" autoClose={3000} />
      {modalAdd && (
        <Modal
          setModal={setModalAdd}
          handleSubmit={handleAddFormSubmit}
          fields={fieldsAdd}
          title={"Reservation"}
          button_name={"Reserve"}
        />
      )}
      <div
        className={`w-full h-[calc(100dvh-170px)] ${
          modal ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        {data.image_url ? (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 relative">
            <img
              src={data.image_url}
              className="object-contain h-full"
              onError={() => setData((prev) => ({ ...prev, image_url: "" }))}
            />
          </div>
        ) : (
          <>
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 relative">
              <div className="absolute z-1 w-100 h-0.5 bg-gray-100 rotate-45" />
              <div className="absolute z-1 w-100 h-0.5 bg-gray-100 -rotate-45" />
              <b className="z-2 text-sm font-bold">NO IMAGE AVAILABLE</b>
            </div>
          </>
        )}
        <div className="bg-gray-100 p-5 text-sm capitalize space-y-1 flex flex-col">
          <Button
            className={
              "w-full md:w-1/2 lg:w-1/4 md:ms-auto rounded-full! bg-blue-400 hover:bg-blue-500 text-white"
            }
            onClick={() => setModalAdd(true)}
          >
            Reserve
          </Button>
          <div>
            <span>Dryer: </span>
            <b>{data.dryer_name}</b>
          </div>
          <div>
            <span>Maximum Capacity: </span>
            <b>{data.capacity}</b>
          </div>
          <div>
            <span>Available Capacity: </span> 
            <b>{data.available_capacity}</b>
          </div>
          <div>
            <span>Created: </span>
            <b>{new Date(data.created_at).toLocaleString()}</b>
          </div>
          <div>
            <span>Rate: </span>
            <b>PHP{data.rate}</b>
          </div>
          <DynamicMap location={data.location} />
          <div className="mt-3">
            <div className="flex gap-3">
              <div className="flex gap-1 items-center">
                <b>Ratings: </b>
                <b>
                  {data.rating_overall && data.rating_count
                    ? data.rating_overall / data.rating_count
                    : "4.5"}
                </b>
                {parseFloat(data.ratings ?? "5.0") % 1 >= 0.5 ||
                parseFloat(data.ratings ?? "5.0") % 1 === 0.0 ? (
                  <CgArrowUp />
                ) : (
                  <CgArrowDown />
                )}
                (
                {data.rating_overall && data.rating_count
                  ? data.rating_overall / data.rating_count
                  : "9 / 2"}
                )
              </div>
              <div className="flex grow items-center gap-5">
                {Array.from(
                  {
                    length: Math.round(
                      parseFloat(
                        data.rating_overall && data.rating_count
                          ? data.rating_overall / data.rating_count
                          : "4.5"
                      )
                    ),
                  },
                  (_, i) => i
                ).map((_, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-center"
                  >
                    <AiFillStar className="absolute text-[15px]" />
                    <AiFillStar className="absolute text-[12px] text-green-500" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {ratings.map((data, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded p-5 flex flex-col"
                >
                  <div className="flex gap-3">
                    <div className="flex gap-1 items-center">
                      <div className="hover:text-green-500 transition-all duration-300 cursor-pointer">
                        {data.user}
                      </div>
                      <b className="text-gray-400">|</b>
                    </div>
                    <div className="flex grow items-center gap-5">
                      {Array.from(
                        {
                          length: Math.round(parseFloat(data.rating ?? "5.0")),
                        },
                        (_, i) => i
                      ).map((_, index) => (
                        <div
                          key={index}
                          className="relative flex items-center justify-center"
                        >
                          <AiFillStar className="absolute text-[15px] text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <i className="font-bold">"{data.comment}"</i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
