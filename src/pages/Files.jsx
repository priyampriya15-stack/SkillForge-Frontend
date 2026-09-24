
import { useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { uploadFiles } from "../Services/fileService";

const Files = () => {

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // ===============================
  // SELECT FILES
  // ===============================

  const handleFileChange = (event) => {

    const files = Array.from(event.target.files);

    if (files.length > 5) {
      setMessage("You can upload maximum 5 files");
      return;
    }

    const invalidFile = files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setMessage(
        `${invalidFile.name} is larger than 5MB`
      );
      return;
    }

    setSelectedFiles(files);
    setMessage("");
  };


  // ===============================
  // UPLOAD FILES
  // ===============================

  const handleUpload = async () => {

    if (selectedFiles.length === 0) {
      setMessage("Please select at least one file");
      return;
    }

    try {

      setLoading(true);
      setMessage("");

      const data = await uploadFiles(selectedFiles);

      console.log("UPLOAD RESPONSE:", data);

      if (data.files) {

        setUploadedFiles((previousFiles) => [
          ...previousFiles,
          ...data.files,
        ]);

      }

      setMessage(
        data.message || "Files uploaded successfully"
      );

      setSelectedFiles([]);

    } catch (error) {

      console.error("Upload Error:", error);

      setMessage(
        error.message || "File upload failed"
      );

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // REMOVE SELECTED FILE
  // ===============================

  const removeFile = (index) => {

    setSelectedFiles((previousFiles) =>
      previousFiles.filter((_, i) => i !== index)
    );

  };


  return (

    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-3xl">


        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            File Sharing
          </h1>

          <p className="mt-2 text-slate-400">
            Upload and share project files securely.
          </p>

        </div>


        {/* ================= UPLOAD CARD ================= */}

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">


          {/* Upload Heading */}

          <div className="mb-6 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">

              <Upload
                size={30}
                className="text-indigo-400"
              />

            </div>

            <h2 className="text-xl font-semibold">
              Upload Files
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Maximum 5 files, 5MB each
            </p>

          </div>


          {/* ================= SELECT FILE ================= */}

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 p-8 transition hover:border-indigo-500 hover:bg-slate-800/50">

            <Upload
              size={28}
              className="mb-3 text-slate-400"
            />

            <span className="text-sm font-medium">
              Click to select files
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG, WEBP, PDF, DOC, DOCX
            </span>

            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
            />

          </label>


          {/* ================= SELECTED FILES ================= */}

          {selectedFiles.length > 0 && (

            <div className="mt-6">

              <h3 className="mb-3 text-sm font-semibold text-slate-300">
                Selected Files
              </h3>

              <div className="space-y-3">

                {selectedFiles.map((file, index) => (

                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-slate-800 p-3"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <FileText
                        size={20}
                        className="shrink-0 text-indigo-400"
                      />

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium">
                          {file.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >

                      <X size={18} />

                    </button>

                  </div>

                ))}

              </div>


              {/* ================= UPLOAD BUTTON ================= */}

              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Upload size={18} />

                {loading
                  ? "Uploading..."
                  : "Upload Files"}

              </button>

            </div>

          )}


          {/* ================= MESSAGE ================= */}

          {message && (

            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-slate-800 p-3 text-center text-sm text-slate-300">

              <CheckCircle
                size={18}
                className="text-green-400"
              />

              {message}

            </div>

          )}


          {/* ================= UPLOADED FILES ================= */}

          {uploadedFiles.length > 0 && (

            <div className="mt-8">

              <h2 className="mb-4 text-lg font-semibold">
                Uploaded Files
              </h2>


              <div className="space-y-3">

                {uploadedFiles.map((file, index) => (

                  <div
                    key={`${file.filename}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4"
                  >

                    {/* ================= FILE INFO ================= */}

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">

                        <FileText
                          size={20}
                          className="text-indigo-400"
                        />

                      </div>


                      <div className="min-w-0">

                        <p className="truncate font-medium">
                          {file.originalName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>

                    </div>


                    {/* ================= BUTTONS ================= */}

                    <div className="ml-4 flex shrink-0 items-center gap-2">


                      {/* ================= VIEW ================= */}

                      <a
                        href={`http://localhost:5000/api/files/view/${encodeURIComponent(file.filename)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium transition hover:bg-indigo-500"
                      >
                        View
                      </a>


                      {/* ================= DOWNLOAD ================= */}

                      <a
                        href={`http://localhost:5000/${file.path.replaceAll("\\", "/")}`}
                        download={file.originalName}
                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium transition hover:bg-slate-600"
                      >
                        Download
                      </a>


                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );
};


// =================================================
// DEFAULT EXPORT
// =================================================

export default Files;

