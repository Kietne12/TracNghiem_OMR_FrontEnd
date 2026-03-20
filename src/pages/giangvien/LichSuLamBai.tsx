import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
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
  };
  submissions: SubmissionItem[];
}

export default function LichSuLamBai() {
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canLoadClasses = semester !== "" && academicYear.trim() !== "";

  const filteredSubmissions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return submissions.filter((item) => {
      const bySearch =
        !keyword ||
        item.studentName.toLowerCase().includes(keyword) ||
        item.studentId.toLowerCase().includes(keyword);

      const byStatus =
        statusFilter === "all" ||
        (statusFilter === "graded" && item.score !== null) ||
        (statusFilter === "pending" && item.score === null);

      return bySearch && byStatus;
    });
  }, [search, submissions, statusFilter]);

  const fetchClasses = async () => {
    if (!canLoadClasses) {
      setClasses([]);
      setSelectedClassId(null);
      setExams([]);
      setSelectedExamId(null);
      setSubmissions([]);
      return;
    }

    setLoading(true);
    setErrorMessage("");

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
        setSubmissions([]);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Không tải được danh sách lớp");
      setClasses([]);
      setExams([]);
      setSelectedClassId(null);
      setSelectedExamId(null);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamsByClass = async (classId: number | null) => {
    if (!classId) {
      setExams([]);
      setSelectedExamId(null);
      setSubmissions([]);
      return;
    }

    try {
      const res = await api.get<{ exams: ExamItem[] }>("/api/exams", {
        params: { lop_id: classId },
      });

      const fetchedExams = res.data.exams || [];
      setExams(fetchedExams);
      setSelectedExamId(null);
      setSubmissions([]);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Không tải được danh sách kỳ thi");
      setExams([]);
      setSelectedExamId(null);
      setSubmissions([]);
    }
  };

  const fetchSubmissionHistory = async (examId: number | null) => {
    if (!examId) {
      setSubmissions([]);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.get<GradingResponse>(`/api/exams/${examId}/grading-results`);
      setSubmissions(res.data.submissions || []);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Không tải được lịch sử làm bài");
      setSubmissions([]);
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
      setSubmissions([]);
      return;
    }

    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester, academicYear]);

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          Lịch sử làm bài
        </h1>
        <p className="text-slate-600">Dữ liệu lấy trực tiếp từ cơ sở dữ liệu các bài làm đã nộp</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">{errorMessage}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              await fetchSubmissionHistory(examId);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc MSSV"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
        >
          <option value="all">Tất cả</option>
          <option value="graded">Đã chấm</option>
          <option value="pending">Chờ chấm</option>
        </select>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : (
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
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">{item.studentId}</td>
                    <td className="px-4 py-3">{item.studentName}</td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {item.score === null ? "-" : item.score.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.correctAnswers}/{item.totalQuestions}
                    </td>
                    <td className="px-4 py-3 text-center">{item.totalTime} phút</td>
                    <td className="px-4 py-3">{new Date(item.submitTime).toLocaleString("vi-VN")}</td>
                    <td className="px-4 py-3 text-center">
                      {item.score === null ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Chờ chấm</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Đã chấm</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      Không có lịch sử làm bài phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
