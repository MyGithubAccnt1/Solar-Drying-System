import Button from "./Button";
import { RiCloseLargeLine } from "react-icons/ri";

function Modal({ setModal, handleSubmit, title, button_name, fields, datas }) {
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="absolute z-1 top-0 left-0 flex items-start justify-center h-full w-full backdrop-blur-[6px]"
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="w-[320px] bg-gray-300 gap-5 rounded-lg p-5 flex flex-col justify-between items-start my-auto"
        >
          <div className="w-full flex justify-between items-center">
            <h1 className="font-bold text-2xl text-[rgba(0,100,0,255)]">
              {title}
            </h1>
            <div
              onClick={() => setModal(false)}
              className="p-3 cursor-pointer rounded-full hover:bg-[rgba(0,0,0,0.2)] transition-all duration-300"
            >
              <RiCloseLargeLine />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            {fields?.map((field, index) => (
              <div key={index} className="w-full flex flex-col gap-1">
                <label className="text-[rgba(0,100,0,255)] font-bold text-md">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <div className="bg-gray-200 w-full rounded-md p-2">
                    <select
                      name={field.name}
                      className="outline-0 w-full text-[rgba(0,100,0,255)]"
                      defaultValue={field.defaultValue}
                    >
                      {field.option.map((option, index) => (
                        <option
                          key={index}
                          className="bg-gray-200"
                          value={option.value}
                        >
                          {option.phrase}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    className="bg-gray-200 w-full rounded-md p-2 outline-0"
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    name={field.name}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    defaultValue={field.defaultValue}
                    step={field.step}
                  />
                )}
              </div>
            ))}

            {datas?.map((data, index) => (
              <div key={index} className="w-full flex flex-col gap-3">
                {data.crop_type && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        1
                      </div>
                      Crop Type
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.crop_type}
                    </div>
                  </div>
                )}
                {data.dryer_name && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        1
                      </div>
                      Dryer Name
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.dryer_name}
                    </div>
                  </div>
                )}
                {data.quantity && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        2
                      </div>
                      Quantity
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.quantity} (Cavans)
                    </div>
                  </div>
                )}
                {data.location && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        2
                      </div>
                      Location
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.location} (Sablayan)
                    </div>
                  </div>
                )}
                {data.payment && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        3
                      </div>
                      Payment Type
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.payment}
                    </div>
                  </div>
                )}
                {data.capacity && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        3
                      </div>
                      Capacity
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.capacity} (Cavans)
                    </div>
                  </div>
                )}
                {data.capacity && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        4
                      </div>
                      Available Capacity
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.capacity} (Cavans)
                    </div>
                  </div>
                )}
                {data.status && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        5
                      </div>
                      Status
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      <div className="bg-gray-200 w-full rounded-md p-2">
                        <select
                          name="status"
                          className="outline-0 w-full text-[rgba(0,100,0,255)]"
                          defaultValue={data.status}
                        >
                          <option className="bg-gray-200" value="pending">
                            Pending
                          </option>
                          <option className="bg-gray-200" value="approved">
                            Approved
                          </option>
                          <option className="bg-gray-200" value="denied">
                            Denied
                          </option>
                          <option className="bg-gray-200" value="completed">
                            Completed
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {data.rate && (
                  <div className="flex flex-col">
                    <div className="bg-[rgb(138,183,45)] p-2 flex gap-2 font-bold rounded-t-md text-white">
                      <div className="w-6 h-6 flex justify-center items-center text-[rgb(138,183,45)] rounded-full bg-white">
                        5
                      </div>
                      Rate
                    </div>
                    <div className="p-3 bg-[rgba(255,255,255,0.9)] backdrop-filter-[6px] border border-[rgb(138,183,45)] text-sm rounded-b-md relative capitalize">
                      {data.rate} (PHP)
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full flex gap-3 justify-end items-center">
            <Button
              type={"button"}
              className={"hover:bg-[rgba(0,0,0,0.2)] text-black"}
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
            <Button
              type={"submit"}
              className={"bg-green-600 hover:bg-green-700 text-white"}
            >
              {button_name}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Modal;
