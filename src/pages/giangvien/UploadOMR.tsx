import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import api from "../../services/api";

interface ExamItem {
  id: number;
  ten_ky_thi: string;
  cau_hinh?: {
    hinh_thuc_thi?: "online" | "omr";
    so_ma_de?: number;
    tong_so_cau?: number;
    ma_de_data?: { ma_de?: string }[];
  } | null;
}

export default function UploadOMR() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mssvOverride, setMssvOverride] = useState("");
  const [maDeOverride, setMaDeOverride] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadOmrExams = async () => {
      try {
        const res = await api.get<{ exams: ExamItem[] }>("/api/exams");
        const omrExams = (res.data.exams || []).filter(
          (exam) => exam.cau_hinh?.hinh_thuc_thi === "omr"
        );
        setExams(omrExams);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Không tải được danh sách kỳ thi OMR");
      }
    };

    loadOmrExams();
  }, []);

  const selectedExam = exams.find((item) => item.id === selectedExamId) || null;
  const validExamCodes = (Array.isArray(selectedExam?.cau_hinh?.ma_de_data) ? selectedExam.cau_hinh.ma_de_data : [])
    .map((item) => item.ma_de?.toString().trim())
    .filter((item): item is string => Boolean(item));

  const triggerDownload = async (url: string, fallbackMessage: string) => {
    try {
      const response = await api.get(url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(response.data);
      const disposition = response.headers?.["content-disposition"] || "";
      const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i);
      const decodedFileName = fileNameMatch?.[1] ? decodeURIComponent(fileNameMatch[1]) : "";
      const fallbackName = url.includes("download-sheet")
        ? "phieu-omr.pdf"
        : url.includes("download-exam")
          ? "de-omr.pdf"
          : "download.bin";
      const fileName = decodedFileName || fallbackName;

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      setError(err?.response?.data?.message || fallbackMessage);
    }
  };

  const uploadOmr = async () => {
    if (!selectedExamId) {
      setError("Bạn chưa chọn kỳ thi OMR");
      return;
    }

    if (!selectedFile) {
      setError("Bạn chưa chọn ảnh phiếu OMR");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("omr_image", selectedFile);
      if (mssvOverride.trim()) {
        formData.append("mssv_override", mssvOverride.trim());
      }
      if (maDeOverride.trim()) {
        formData.append("ma_de_override", maDeOverride.trim());
      }

      const res = await api.post(`/api/exams/${selectedExamId}/omr/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data?.message || "Upload ảnh OMR thành công. Đợi Python quét...");
      setSelectedFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload ảnh OMR thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Upload ảnh OMR</h2>
            <button
              className="text-sm text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/giangvien/dashboard")}
            >
              {"<"} Quay lại Dashboard
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Quy trình:</strong> Tải ảnh phiếu OMR dã quét → Python module
              quét dữ liệu (MSSV, mã đề, đáp án) → Kết quả tự động cập nhật vào
              Chấm bài
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kỳ thi OMR
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                value={selectedExamId ?? ""}
                onChange={(e) => {
                  const nextExamId = Number(e.target.value) || null;
                  setSelectedExamId(nextExamId);
                  setMessage("");
                  setError("");
                  setSelectedFile(null);
                  setMssvOverride("");
                  setMaDeOverride("");
                }}
              >
                <option value="">-- Chọn kỳ thi --</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    #{exam.id} - {exam.ten_ky_thi} ({exam.cau_hinh?.tong_so_cau || "?"} câu)
                  </option>
                ))}
              </select>
            </div>

            {selectedExam && (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h3 className="font-semibold text-slate-800 mb-3">Kỳ thi đã chọn</h3>
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Tên:</strong> {selectedExam.ten_ky_thi}
                </p>
                <p className="text-sm text-slate-700 mb-3">
                  <strong>Tổng câu:</strong> {selectedExam.cau_hinh?.tong_so_cau || "?"} |{" "}
                  <strong>Mã đề hợp lệ:</strong>{" "}
                  {validExamCodes.length > 0 ? validExamCodes.join(", ") : "Chưa có"}
                </p>
                {validExamCodes.length === 0 && (
                  <p className="text-xs text-amber-700 mb-3">
                    Kỳ thi này chưa có danh sách mã đề rõ ràng. Hãy tạo/sinh đề OMR trước khi upload.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-sm inline-flex items-center gap-2"
                    onClick={() =>
                      triggerDownload(
                        `/api/exams/${selectedExam.id}/omr/download-exam`,
                        "Không thể tải đề OMR"
                      )
                    }
                  >
                    <Download size={16} />
                    Tải đề (Word)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-sm inline-flex items-center gap-2"
                    onClick={() =>
                      triggerDownload(
                        `/api/exams/${selectedExam.id}/omr/download-sheet`,
                        "Không thể tải phiếu OMR"
                      )
                    }
                  >
                    <Download size={16} />
                    Tải phiếu (PDF)
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ảnh phiếu OMR đã quét
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  className="w-full invisible h-0"
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="text-slate-600">
                    {selectedFile ? (
                      <>
                        <p className="font-semibold text-slate-800">✓ {selectedFile.name}</p>
                        <p className="text-sm text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-800 mb-1">Chọn hoặc kéo thả ảnh</p>
                        <p className="text-sm text-slate-500">PNG, JPG, GIF (tối đa 10MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  MSSV Override (tùy chọn)
                </label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  placeholder="Ví dụ: 00001"
                  value={mssvOverride}
                  onChange={(e) => setMssvOverride(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mã đề Override (tùy chọn)
                </label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  placeholder="Ví dụ: 001"
                  value={maDeOverride}
                  onChange={(e) => setMaDeOverride(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3 text-emerald-700 text-sm">
                {message}
              </div>
            )}

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-3 rounded-lg font-semibold"
              onClick={uploadOmr}
              disabled={isLoading || !selectedFile || !selectedExamId}
            >
              {isLoading ? "Đang upload..." : "Upload ảnh OMR"}
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <p className="text-yellow-800 font-semibold mb-1">⏳ Lưu ý:</p>
              <p className="text-yellow-700">
                Sau khi upload, Python module sẽ quét tự động. Kết quả sẽ xuất hiện trong mục
                <strong> Chấm bài</strong> sau vài giây.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
