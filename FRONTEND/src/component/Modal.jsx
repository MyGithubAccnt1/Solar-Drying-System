import { useState } from "react";
import Button from "./Button";
import { RiCloseLargeLine } from "react-icons/ri";

function Modal({ setModal, handleSubmit, title, button_name, fields }) {
  const [address, setAddress] = useState("");
  const [previewUrls, setPreviewUrls] = useState({});
  const [mainImage, setMainImage] = useState("");  

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
          .then((res) => res.json())
          .then((data) => {
            const reversed = [...data.localityInfo.administrative].reverse();
            const address = reversed
              .map((level) => level.name.replace(/\s\(\w+?\)/, ""))
              .join(", ");
            setAddress(`${address}`);
          })
          .catch((err) =>
            console.log("Failed to get address. ", err.response?.data?.message)
          );
      },
      (err) => {
        console.log(
          "Permission denied or location error. ",
          err.response?.data?.message
        );
      }
    );
  };

  return (
    <div
      onClick={() => setModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 md:p-10 space-y-6"
      >
        <div className="flex justify-between items-center border-b pb-3">
          <h1 className="text-2xl font-bold text-green-700">{title}</h1>
          <button
            type="button"
            onClick={() => setModal(false)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <RiCloseLargeLine size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields?.map((field, index) => (
            <div
              key={index}
              className={`col-span-1 ${field.colspan === 2 ? "md:col-span-2" : ""}`}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>

              {field.name === "image_url" ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    name={field.name}
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const localPreview = URL.createObjectURL(file);
                      setPreviewUrls((prev) => ({
                        ...prev,
                        [field.name]: localPreview,
                      }));
                      setMainImage(localPreview);  

                      const formData = new FormData();
                      formData.append("file", file);

                      try {
                        const res = await fetch(`${import.meta.env.VITE_API}/upload`, {
                          method: "POST",
                          body: formData,
                        });
                        const data = await res.json();
                        if (data.url) {
                          setPreviewUrls((prev) => ({
                            ...prev,
                            [field.name]: data.url,
                          }));
                          setMainImage(data.url);  
                        }
                      } catch (err) {
                        console.error("Image upload failed:", err);
                      }
                    }}
                  />
                </div>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white text-sm focus:ring-2 focus:ring-green-500"
                  defaultValue={field.defaultValue || ""}
                >
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value} className="capitalize">
                      {option.value}
                    </option>
                  ))}
                </select>
              ) : field.name === "address" ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500"
                    type={field.type}
                    required={field.required}
                    name={field.name}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <span
                    onClick={handleLocation}
                    className="text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
                  >
                    Use Current Location
                  </span>
                </div>
              ) : (
                <input
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500"
                  type={field.type}
                  required={field.required}
                  name={field.name}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  defaultValue={field.defaultValue || ""}
                  step={field.step}
                />
              )}
            </div>
          ))}
        </div>

        {mainImage && (
          <div className="flex justify-center border rounded-lg p-4 bg-gray-50">
              <img
                src={
                  mainImage.startsWith("http") || mainImage.startsWith("blob:")
                    ? mainImage
                    : `${import.meta.env.VITE_API.replace("/api", "")}${mainImage}`
                }
                alt="Preview"
                className="max-h-[400px] w-auto object-contain rounded-lg shadow-md"
              />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => setModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {button_name}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
