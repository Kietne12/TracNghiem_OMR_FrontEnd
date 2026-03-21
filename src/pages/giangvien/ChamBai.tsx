import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Download, Eye, Filter, Search, X } from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import api from "../../services/api";

interface ClassItem {
  id: number;
  ten_lop: string;
  hoc_ky?: string | null;
  nam_hoc?: string | null;
}

interface ExamItem {
  id: number;
  ten_ky_thi: string;
  cau_hinh?: {
    hinh_thuc_thi?: "online" | "omr";
  } | null;
}

interface StudentResult {
  id: number;
  studentId: string;
  studentName: string;
  submitTime: string;
  score: number | null;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  status: "Đã chấm" | "Chờ chấm";
  detail_url?: string;
}

interface SubmissionAnswerDetail {
  questionNumber: number;
  questionId: number;
  questionContent: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean;
}

interface SubmissionDetailResponse {
  exam: {
    id: number;
    name: string;
  };
  submission: {
    id: number;
    studentId: string;
    studentName: string;
    score: number | null;
    submitTime: string;
    totalQuestions: number;
    correctAnswers: number;
  };
  answers: SubmissionAnswerDetail[];
}

interface GradingStats {
  submissions: number;
  graded: number;
  pending: number;
}

interface GradingExamInfo {
  id: number;
  name: string;
  hinh_thuc_thi?: "online" | "omr";
  totalQuestions: number;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

export default function ChamBai() {
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedYear, setSelectedYear] = useState("2025-2026");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [currentExamId, setCurrentExamId] = useState<number | null>(null);

  const [examInfo, setExamInfo] = useState<GradingExamInfo | null>(null);
  const [stats, setStats] = useState<GradingStats>({ submissions: 0, graded: 0, pending: 0 });
  const [submissions, setSubmissions] = useState<StudentResult[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [error, setError] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailData, setDetailData] = useState<SubmissionDetailResponse | null>(null);

  const academicYears = ["2025-2026", "2024-2025", "2023-2024"];

  const fetchGradingResults = async (examId: number | null) => {
    if (!examId) {
      setExamInfo(null);
      setStats({ submissions: 0, graded: 0, pending: 0 });
      setSubmissions([]);
      return;
    }

    setIsLoadingResults(true);
    setError("");

    try {
      const res = await api.get<{
        exam: GradingExamInfo;
        stats: GradingStats;
        submissions: StudentResult[];
      }>(`/api/exams/${examId}/grading-results`);

      setExamInfo(res.data.exam);
      setStats(res.data.stats || { submissions: 0, graded: 0, pending: 0 });
      setSubmissions(res.data.submissions || []);
    } catch (err: any) {
      setExamInfo(null);
      setStats({ submissions: 0, graded: 0, pending: 0 });
      setSubmissions([]);
      setError(err?.response?.data?.message || "Không tải được dữ liệu chấm bài");
    } finally {
      setIsLoadingResults(false);
    }
  };

  const fetchExamsByClass = async (classId: number | null) => {
    if (!classId) {
      setExams([]);
      setCurrentExamId(null);
      await fetchGradingResults(null);
      return;
    }

    setIsLoadingExams(true);
    setError("");

    try {
      const res = await api.get<{ exams: ExamItem[] }>("/api/exams", {
        params: { lop_id: classId },
      });

      const fetchedExams = res.data.exams || [];
      setExams(fetchedExams);

      const keptExamId = fetchedExams.some((item) => item.id === currentExamId)
        ? currentExamId
        : fetchedExams[0]?.id || null;

      setCurrentExamId(keptExamId);
      await fetchGradingResults(keptExamId);
    } catch (err: any) {
      setExams([]);
      setCurrentExamId(null);
      await fetchGradingResults(null);
      setError(err?.response?.data?.message || "Không tải được danh sách kỳ thi");
    } finally {
      setIsLoadingExams(false);
    }
  };

  const fetchClasses = async () => {
    setIsLoadingClasses(true);
    setError("");

    try {
      const res = await api.get<{ classes: ClassItem[] }>("/api/exams/classes", {
        params: {
          semester: selectedSemester,
          academicYear: selectedYear,
        },
      });

      const fetchedClasses = res.data.classes || [];
      setClasses(fetchedClasses);

      const keptClassId = fetchedClasses.some((item) => item.id === selectedClassId)
        ? selectedClassId
        : fetchedClasses[0]?.id || null;

      setSelectedClassId(keptClassId);
      await fetchExamsByClass(keptClassId);
    } catch (err: any) {
      setClasses([]);
      setSelectedClassId(null);
      setExams([]);
      setCurrentExamId(null);
      await fetchGradingResults(null);
      setError(err?.response?.data?.message || "Không tải được danh sách lớp");
    } finally {
      setIsLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSubmissions = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return submissions;

    return submissions.filter((sub) => {
      return (
        sub.studentName.toLowerCase().includes(keyword) ||
        sub.studentId.toLowerCase().includes(keyword)
      );
    });
  }, [searchQuery, submissions]);

  const handleExportExcel = () => {
    const csvContent = [
      ["Mã sinh viên", "Họ tên", "Thời gian nộp", "Số câu đúng", "Điểm", "Trạng thái"],
      ...filteredSubmissions.map((sub) => [
        sub.studentId,
        sub.studentName,
        formatDateTime(sub.submitTime),
        `${sub.correctAnswers}/${sub.totalQuestions}`,
        sub.score ?? "-",
        sub.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `${examInfo?.name || "ket_qua"}_ket_qua.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openSubmissionDetail = async (submission: StudentResult) => {
    if (!currentExamId) return;

    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setDetailError("");
    setDetailData(null);

    try {
      const detailUrl =
        submission.detail_url || `/api/exams/${currentExamId}/grading-results/${submission.id}`;

      const res = await api.get<SubmissionDetailResponse>(detailUrl);
      setDetailData(res.data);
    } catch (err: any) {
      setDetailError(err?.response?.data?.message || "Không tải được chi tiết bài làm");
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Chấm bài và xem kết quả
        </h1>
        <p className="text-slate-600">Dữ liệu online và OMR được đồng bộ trên cùng một màn hình.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Kỳ học
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="1">Kỳ 1</option>
            <option value="2">Kỳ 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Năm học
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
          >
            {academicYears.map((year) => (
              <option key={year} value={year}>
                Năm học {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={fetchClasses}
            disabled={isLoadingClasses}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2 rounded-lg"
          >
            {isLoadingClasses ? "Đang lọc..." : "Lọc lớp"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          <Filter size={16} className="inline mr-2" />
          Chọn lớp
        </label>
        <select
          value={selectedClassId ?? ""}
          onChange={async (e) => {
            const nextClassId = Number(e.target.value) || null;
            setSelectedClassId(nextClassId);
            await fetchExamsByClass(nextClassId);
          }}
          className="w-full md:w-96 px-4 py-2 border border-slate-300 rounded-lg"
        >
          <option value="">-- Chọn lớp --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.ten_lop} (Kỳ {cls.hoc_ky || "-"} - {cls.nam_hoc || "-"})
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 rounded-lg p-3 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Chọn kỳ thi</h3>

          {isLoadingExams && <p className="text-sm text-indigo-600">Đang tải kỳ thi...</p>}

          {!isLoadingExams && exams.length === 0 && (
            <p className="text-sm text-slate-500">Lớp này chưa có kỳ thi.</p>
          )}

          <div className="space-y-2">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={async () => {
                  setCurrentExamId(exam.id);
                  await fetchGradingResults(exam.id);
                }}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  currentExamId === exam.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-slate-800 text-sm mb-1">{exam.ten_ky_thi}</p>
                <p className="text-xs text-slate-600 uppercase">{exam.cau_hinh?.hinh_thuc_thi || "online"}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <p className="text-slate-600 text-sm mb-1">Tổng nộp</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.submissions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <p className="text-slate-600 text-sm mb-1">Đã chấm</p>
              <p className="text-3xl font-bold text-green-600">{stats.graded}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <p className="text-slate-600 text-sm mb-1">Chờ chấm</p>
              <p className="text-3xl font-bold text-red-600">{stats.pending}</p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6 flex justify-end">
            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              disabled={!examInfo}
            >
              <Download size={20} />
              Xuất Excel
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Mã SV</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Họ tên</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Thời gian nộp</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Câu đúng</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Điểm</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingResults && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-indigo-600">
                        Đang tải dữ liệu chấm bài...
                      </td>
                    </tr>
                  )}

                  {!isLoadingResults && filteredSubmissions.length > 0 &&
                    filteredSubmissions.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{sub.studentId}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{sub.studentName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            {formatDateTime(sub.submitTime)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-semibold text-slate-700">
                          {sub.correctAnswers}/{sub.totalQuestions}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          {sub.score !== null ? (
                            <span className="font-bold text-lg text-indigo-600">{sub.score}</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          {sub.status === "Đã chấm" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircle size={14} />
                              Đã chấm
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              <Clock size={14} />
                              Chờ chấm
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <button
                            type="button"
                            onClick={() => openSubmissionDetail(sub)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                            disabled={sub.status !== "Đã chấm"}
                          >
                            <Eye size={14} />
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}

                  {!isLoadingResults && filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        {examInfo
                          ? "Không có bài nộp phù hợp với điều kiện tìm kiếm"
                          : "Chọn kỳ thi để xem kết quả"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Chi tiết bài làm</h3>
                {detailData && (
                  <p className="text-sm text-slate-600 mt-1">
                    {detailData.submission.studentId} - {detailData.submission.studentName} | Điểm: {detailData.submission.score ?? "-"} | Đúng: {detailData.submission.correctAnswers}/{detailData.submission.totalQuestions}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
              {isDetailLoading && (
                <p className="text-indigo-600">Đang tải chi tiết bài làm...</p>
              )}

              {!isDetailLoading && detailError && (
                <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-red-700 text-sm">
                  {detailError}
                </div>
              )}

              {!isDetailLoading && !detailError && detailData && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700">Câu</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700">Nội dung</th>
                        <th className="px-3 py-2 text-center text-sm font-semibold text-slate-700">Chọn</th>
                        <th className="px-3 py-2 text-center text-sm font-semibold text-slate-700">Đúng</th>
                        <th className="px-3 py-2 text-center text-sm font-semibold text-slate-700">Kết quả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.answers.map((item) => (
                        <tr key={`${item.questionId}-${item.questionNumber}`} className="border-b border-slate-100 align-top">
                          <td className="px-3 py-3 text-sm font-semibold text-slate-700">{item.questionNumber}</td>
                          <td className="px-3 py-3 text-sm text-slate-700">
                            <p className="mb-2">{item.questionContent || "-"}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs text-slate-500">
                              <p>A. {item.options.A}</p>
                              <p>B. {item.options.B}</p>
                              <p>C. {item.options.C}</p>
                              <p>D. {item.options.D}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center text-sm font-semibold text-indigo-700">{item.selectedAnswer || "-"}</td>
                          <td className="px-3 py-3 text-center text-sm font-semibold text-emerald-700">{item.correctAnswer || "-"}</td>
                          <td className="px-3 py-3 text-center text-sm">
                            {item.isCorrect ? (
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Đúng</span>
                            ) : (
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Sai</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
