import DashboardLayout from "../../layout/DashboardLayout";
import { Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentPracticeStatistics } from "../../services/practiceService";

export default function LichSuBaiBai() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    loadSubmissionHistory();
  }, []);

  const loadSubmissionHistory = async () => {
    try {
      setLoading(true);
      setError("");
      // Assuming we get the student ID from auth context/localStorage
      const studentId = localStorage.getItem("userId");
      if (!studentId) {
        setError("Không tìm thấy thông tin sinh viên");
        return;
      }

      const response = await getStudentPracticeStatistics(parseInt(studentId));
      if (response.success) {
        setSubmissions(response.data);
      } else {
        setError(response.error || "Failed to load submission history");
      }
    } catch (err) {
      setError("Error loading submission history: " + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="SINH VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Lịch sử làm bài
        </h1>
        <p className="text-slate-600">
          Xem lịch sử làm bài luyện tập của bạn
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {submissions && submissions.length > 0 ? (
            submissions.map((submission, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-lg mb-2">
                      {submission.ten_bai}
                    </h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                          Thời gian bắt đầu:{" "}
                          {new Date(
                            submission.thoi_gian_bat_dau
                          ).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>
                          Thời gian nộp:{" "}
                          {submission.thoi_gian_nop
                            ? new Date(
                                submission.thoi_gian_nop
                              ).toLocaleString("vi-VN")
                            : "Chưa nộp"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold mb-2">
                      <span
                        className={`${
                          submission.tong_diem >= 7
                            ? "text-green-600"
                            : submission.tong_diem >= 5
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {submission.tong_diem ? submission.tong_diem.toFixed(2) : "N/A"}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.trang_thai === "da_nop" ||
                        submission.trang_thai === "da_cham"
                          ? "bg-blue-100 text-blue-800"
                          : submission.trang_thai === "dang_lam"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {submission.trang_thai === "da_nop"
                        ? "Đã nộp"
                        : submission.trang_thai === "da_cham"
                        ? "Đã chấm"
                        : "Đang làm"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">
                Bạn chưa làm bài luyện tập nào
              </p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
