import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { MdDelete } from "react-icons/md";

import { selectActiveSession, setFiles } from "@/redux/slices";
import { useUploadFilesMutation } from "@/api/endpoints";

import uploadIcon from "../../../assets/dashboard/icons/uploadIcon.svg";

const CustomValuation = () => {
  const [uploadFile] = useUploadFilesMutation();

  const [allFiles, setAllFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeSession = useSelector(selectActiveSession);
  const isPrivateData =
    activeSession && activeSession.ticker === "PRIVATE_DATA";

  const onDrop = useCallback((acceptedFile) => {
    setAllFiles((prev) => [...prev, ...acceptedFile]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    rejectedFiles,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    // Allow more files to be uploaded
    maxFiles: 10,
    onDrop: onDrop,
  });

  const handleFileDelete = (e, index) => {
    e.preventDefault();
    setAllFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (allFiles.length < 2) {
      setError(
        "Please upload at least 2 files (Balance Sheet and Income Statement)",
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      allFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await uploadFile(formData).unwrap();
      const file_signatures = response?.file_signatures;

      if (file_signatures) {
        dispatch(setFiles(file_signatures));
      }

      navigate("/valuation/private/inputs");
    } catch (err) {
      console.error("Error uploading files:", err);
      let errorMessage = "Failed to process files";

      if (err?.response) {
        if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (err.response.status === 400) {
          errorMessage = `Bad request: ${err.response.data?.detail || "Unknown error"}`;
        } else {
          errorMessage = `Error (${err.response.status}): ${err.response.data?.detail || "Unknown error"}`;
        }
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-[#1D2022] w-full relative">
      <div className="flex flex-col p-6 w-[400px] bg-[#282828] mx-auto mt-8 rounded-xl">
        <h2 className="text-base font-medium text-white text-center">
          {isPrivateData ? "Upload Private Financial Statements" : "Upload"}
        </h2>
        <div
          {...getRootProps()}
          className={`${isDragAccept && "border-2 border-green-500"} ${
            isDragReject && "border-2 border-red-500"
          } ${allFiles.length !== 0 && " border-2 border-green-700"} ${
            rejectedFiles && "border-2 border-red-600"
          } bg-[#D0FCFD0D] flex flex-col items-center my-5 rounded-md py-6 px-3`}
        >
          <input {...getInputProps()} className="hidden" />
          <img
            src={uploadIcon}
            alt="upload-icon"
            draggable="false"
            className="w-20 "
          />
          <p className="mt-3 mb-4 text-white ">
            Drag & drop files or{" "}
            <span className="underline text-[#A16BFB]">Browse</span>
          </p>
          <p className="text-xs text-white font-light">
            Supported formats: PDF
          </p>
        </div>

        {allFiles.length !== 0 && (
          <h3 className="text-xs font-normal text-white mb-1">
            Choosen files:
          </h3>
        )}
        <ul className="flex flex-col gap-2 mt-2 mb-5">
          {allFiles.length !== 0 &&
            allFiles?.map((file, index) => (
              <li
                key={index}
                className="bg-white hover:bg-gray-100 p-2 rounded-md text-[#0F0F0F] text-xs font-normal flex items-center justify-between"
              >
                {file?.name}
                <span
                  onClick={(e) => handleFileDelete(e, index)}
                  className="text-red-600 cursor-pointer"
                >
                  <MdDelete size={20} />
                </span>
              </li>
            ))}
        </ul>
        <button
          disabled={allFiles.length < 2 || isLoading}
          onClick={handleUpload}
          className={`${
            allFiles.length < 2 || isLoading
              ? "bg-[#ccb2f7] cursor-not-allowed"
              : " bg-[#A16BFB] cursor-pointer"
          }  py-2 w-full rounded-sm font-medium text-sm text-white`}
        >
          {isLoading ? "PROCESSING..." : "UPLOAD FILES"}
        </button>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
      <ul className="flex gap-5 justify-center mt-8">
        {/* <li className="text-sm text-white font-medium py-1 px-6 rounded-full border border-[#40FED1]">
					SBA
				</li>
				<li className="text-sm text-white font-medium py-1 px-6 rounded-full border border-[#40FED1]">
					Annuity
				</li> */}
        <li className="text-sm text-white font-medium py-1 px-6 rounded-full border border-[#40FED1]">
          LBO
        </li>
        {/* <li className="text-sm text-white font-medium py-1 px-6 rounded-full border border-[#40FED1]">
					RLGL
				</li> */}
      </ul>

      {/* Only show Public button if not in private data mode */}
      {!isPrivateData && (
        <button
          onClick={() => navigate("/valuation")}
          className="absolute bottom-12 left-8 bg-[#A16BFB] rounded-full py-2 w-[280px] font-semibold text-sm text-[#F2F2F2] flex justify-center items-center"
        >
          Public
        </button>
      )}

      <button
        onClick={handleUpload}
        disabled={allFiles.length < 2 || isLoading}
        className={`${
          allFiles.length < 2 || isLoading
            ? "bg-[#ccb2f7] cursor-not-allowed"
            : "bg-[#A16BFB] cursor-pointer"
        } mt-20 mx-auto rounded-full py-2 w-[280px] font-semibold text-sm text-[#F2F2F2] flex justify-center items-center`}
      >
        {isLoading ? "Processing..." : "Create"}
      </button>

      <aside className="flex flex-col gap-5 absolute top-8 right-6 ">
        <span
          className={`${
            allFiles.length > 0 ? "bg-[#40FED1]" : "bg-none"
          } py-11 w-[180px] text-sm font-medium text-white text-center border border-[#40FED1] rounded-2xl`}
        >
          Income Statement
        </span>
        <span
          className={`${
            allFiles.length > 1 ? "bg-[#40FED1]" : "bg-none"
          } py-11 w-[180px] text-sm font-medium text-white text-center border border-[#40FED1] rounded-2xl`}
        >
          Balance Sheet
        </span>
      </aside>
    </div>
  );
};

export default CustomValuation;
