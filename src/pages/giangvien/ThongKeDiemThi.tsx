import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, BarChart3 } from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import api from "../../services/api";

interface ClassItem {
  id: number;
  ten_lop: string;
}

interface ExamItem {
  id: number;
  ten_ky_thi: string;
}

interface SubmissionItem {
  id: number;
  studentId: string;
  studentName: string;
  submitTime: string;
  score: number | null;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  status: string;
}

interface GradingResponse {
  exam: {
    id: number;
    name: string;
    totalQuestions: number;
  };
  stats: {
    submissions: number;
    graded: number;
    pending: number;
  };
  submissions: SubmissionItem[];
}

const scoreBuckets = [
  { label: "8.0-10.0", min: 8, max: 10 },
  { label: "7.0-7.9", min: 7, max: 7.99 },
  { label: "6.0-6.9", min: 6, max: 6.99 },
  { label: "5.0-5.9", min: 5, max: 5.99 },
  { label: "< 5.0", min: -1, max: 4.99 },
];

export default function ThongKeDiemThi() {
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const [gradingData, setGradingData] = useState<GradingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canLoadClasses = semester !== "" && academicYear.trim() !== "";

  const scoredSubmissions = useMemo(
    () => (gradingData?.submissions || []).filter((item) => item.score !== null),
    [gradingData]
  );

  const summary = useMemo(() => {
    const scores = scoredSubmissions.map((item) => Number(item.score));
    const totalStudents = gradingData?.stats.submissions || 0;
    const averageScore =
      scores.length > 0
        ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2))
        : 0;
    const passCount = scores.filter((score) => score >= 5).length;
    const failCount = scores.filter((score) => score < 5).length;

    const distribution = scoreBuckets.map((bucket) => ({
      label: bucket.label,
      count: scores.filter((score) => score >= bucket.min && score <= bucket.max).length,
    }));

    return {
      totalStudents,
      averageScore,
      passCount,
      failCount,
      highest: scores.length > 0 ? Math.max(...scores) : 0,
      lowest: scores.length > 0 ? Math.min(...scores) : 0,
      distribution,
    };
  }, [gradingData, scoredSubmissions]);

  const fetchClasses = async () => {
    if (!canLoadClasses) {
      setClasses([]);
      setSelectedClassId(null);
      setExams([]);
      setSelectedExamId(null);
      setGradingData(null);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setGradingData(null);

    try {
      const res = await api.get<{ classes: ClassItem[] }>("/api/exams/classes", {
        params: {
          semester,
          academicYear,
        },
      });

      const fetched = res.data.classes || [];
      setClasses(fetched);

      const keepClassId =
        selectedClassId && fetched.some((item) => item.id === selectedClassId)
          ? selectedClassId
          : null;

      setSelectedClassId(keepClassId);
      if (keepClassId) {
        await fetchExamsByClass(keepClassId);
      } else {
        setExams([]);
        setSelectedExamId(null);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Không tải được danh sách lớp");
      setClasses([]);
      setExams([]);
      setSelectedClassId(null);
      setSelectedExamId(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamsByClass = async (classId: number | null) => {
    if (!classId) {
      setExams([]);
      setSelectedExamId(null);
      setGradingData(null);
      return;
    }

    try {
      const res = await api.get<{ exams: ExamItem[] }>("/api/exams", {
        params: { lop_id: classId },
      });

      const fetchedExams = res.data.exams || [];
      setExams(fetchedExams);
      setSelectedExamId(null);
      setGradingData(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Không tải được danh sách kỳ thi");
      setExams([]);
      setSelectedExamId(null);
      setGradingData(null);
    }
  };

  const fetchGradingData = async (examId: number | null) => {
    if (!examId) {
      setGradingData(null);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.get<GradingResponse>(`/api/exams/${examId}/grading-results`);
      setGradingData(res.data);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Không tải được thống kê điểm thi");
      setGradingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canLoadClasses) {
      setClasses([]);
      setSelectedClassId(null);
      setExams([]);
      setSelectedExamId(null);
      setGradingData(null);
      return;
    }

    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester, academicYear]);

  const exportCsv = () => {
    if (!gradingData) return;

    const csvRows = [
      ["Thống kê điểm thi", gradingData.exam.name],
      ["Tổng lượt nộp", summary.totalStudents],
      ["Điểm trung bình", summary.averageScore],
      ["Số đạt", summary.passCount],
      ["Số chưa đạt", summary.failCount],
      [],
      ["MSSV", "Họ tên", "Điểm", "Câu đúng", "Tổng câu", "Thời gian làm (phút)", "Thời điểm nộp"],
      ...scoredSubmissions.map((item) => [
        item.studentId,
        item.studentName,
        item.score,
        item.correctAnswers,
        item.totalQuestions,
        item.totalTime,
        item.submitTime,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `thong-ke-${gradingData.exam.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      <div className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Thống kê điểm thi
          </h1>
          <p className="text-slate-600">Dữ liệu lấy trực tiếp từ cơ sở dữ liệu kỳ thi đã nộp bài</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={!gradingData}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
        >
          <Download size={18} /> Xuất CSV
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">{errorMessage}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kỳ học</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">Chọn kỳ học</option>
            <option value="1">Kỳ 1</option>
            <option value="2">Kỳ 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Năm học</label>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">Chọn năm học</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Lớp</label>
          <select
            value={selectedClassId ?? ""}
            onChange={async (e) => {
              const classId = Number(e.target.value) || null;
              setSelectedClassId(classId);
              await fetchExamsByClass(classId);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            disabled={!canLoadClasses || classes.length === 0}
          >
            {!canLoadClasses ? (
              <option value="">Chọn kỳ và năm học trước</option>
            ) : classes.length === 0 ? (
              <option value="">Không có lớp</option>
            ) : (
              <>
                <option value="">Chọn lớp</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ten_lop}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kỳ thi</label>
          <select
            value={selectedExamId ?? ""}
            onChange={async (e) => {
              const examId = Number(e.target.value) || null;
              setSelectedExamId(examId);
              await fetchGradingData(examId);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            disabled={!selectedClassId || exams.length === 0}
          >
            {!selectedClassId ? (
              <option value="">Chọn lớp trước</option>
            ) : exams.length === 0 ? (
              <option value="">Không có kỳ thi</option>
            ) : (
              <>
                <option value="">Chọn kỳ thi</option>
                {exams.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ten_ky_thi}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : !gradingData ? (
        <div className="py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
          Chưa có dữ liệu thống kê
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-2">Tổng lượt nộp</p>
              <p className="text-3xl font-bold text-slate-800">{summary.totalStudents}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-2">Điểm trung bình</p>
              <p className="text-3xl font-bold text-indigo-600">{summary.averageScore}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-2">Đạt (≥5)</p>
              <p className="text-3xl font-bold text-emerald-600">{summary.passCount}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-2">Chưa đạt (&lt;5)</p>
              <p className="text-3xl font-bold text-rose-600">{summary.failCount}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-2">Khoảng điểm</p>
              <p className="text-sm text-slate-700">Cao nhất: {summary.highest.toFixed(2)}</p>
              <p className="text-sm text-slate-700">Thấp nhất: {summary.lowest.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-600" />
              Phân bố điểm
            </h3>
            <div className="space-y-3">
              {summary.distribution.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500"
                      style={{
                        width:
                          summary.totalStudents > 0
                            ? `${(item.count / summary.totalStudents) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left">MSSV</th>
                    <th className="px-4 py-3 text-left">Họ tên</th>
                    <th className="px-4 py-3 text-center">Điểm</th>
                    <th className="px-4 py-3 text-center">Câu đúng</th>
                    <th className="px-4 py-3 text-center">Thời gian làm</th>
                    <th className="px-4 py-3 text-left">Thời điểm nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {scoredSubmissions.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">{item.studentId}</td>
                      <td className="px-4 py-3">{item.studentName}</td>
                      <td className="px-4 py-3 text-center font-semibold">{item.score?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        {item.correctAnswers}/{item.totalQuestions}
                      </td>
                      <td className="px-4 py-3 text-center">{item.totalTime} phút</td>
                      <td className="px-4 py-3">{new Date(item.submitTime).toLocaleString("vi-VN")}</td>
                    </tr>
                  ))}
                  {scoredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                        Chưa có bài làm nào đã chấm điểm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
