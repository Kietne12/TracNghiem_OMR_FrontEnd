import { useEffect, useMemo, useState } from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";
import DashboardLayout from "../../layout/DashboardLayout";

type ExamType = "online" | "omr";
type GenerationMode = "auto" | "manual";

interface ClassItem {
  id: number;
  ten_lop: string;
  si_so?: number;
  hoc_ky?: string | null;
  nam_hoc?: string | null;
}

interface ClassesResponse {
  classes: ClassItem[];
}

interface QuestionApi {
  id: number;
  noi_dung: string;
  do_kho: number;
  chuong: number;
}

interface ExamConfigApi {
  hoc_ky?: string | null;
  nam_hoc?: string | null;
  tong_so_cau?: number;
  hinh_thuc_thi?: ExamType;
  cach_tao_de?: GenerationMode;
  tron_cau_hoi?: boolean;
  tron_dap_an?: boolean;
  so_ma_de?: number;
  so_cau_de?: number;
  so_cau_trung_binh?: number;
  so_cau_kho?: number;
  ds_chuong?: number[];
  ds_cau_hoi_chon?: number[];
}

interface ExamApi {
  id: number;
  ten_ky_thi: string;
  lop_id: number;
  thoi_gian_lam_bai: number;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  trang_thai?: string;
  tong_so_cau?: number;
  cau_hinh?: ExamConfigApi | null;
}

interface CreateConfig {
  semester: string;
  academicYear: string;
  classId: number | null;
  className: string;
  examName: string;
  durationMinutes: number;
  totalQuestions: number;
  startAt: string;
  examType: ExamType;
  generationMode: GenerationMode;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  examCodeCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  selectedChapters: number[];
  manualQuestionIds: number[];
}

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
};

const toNumberArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
};

const toDatetimeLocal = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
};

const createDefaultConfig = (
  semester: string,
  academicYear: string,
  classId: number | null,
  className: string
): CreateConfig => ({
  semester,
  academicYear,
  classId,
  className,
  examName: "",
  durationMinutes: 60,
  totalQuestions: 30,
  startAt: "",
  examType: "online",
  generationMode: "auto",
  shuffleQuestions: true,
  shuffleAnswers: true,
  examCodeCount: 1,
  easyCount: 10,
  mediumCount: 10,
  hardCount: 10,
  selectedChapters: [],
  manualQuestionIds: [],
});

export default function TaoKyThi() {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2025-2026");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [exams, setExams] = useState<ExamApi[]>([]);

  const [questionBank, setQuestionBank] = useState<QuestionApi[]>([]);
  const [questionSearch, setQuestionSearch] = useState("");

  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingExamId, setDeletingExamId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamApi | null>(null);
  const [form, setForm] = useState<CreateConfig>(createDefaultConfig("1", "2025-2026", null, ""));

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) || null,
    [classes, selectedClassId]
  );

  const chapterOptions = useMemo(() => {
    const chapterMap = new Map<number, number>();
    questionBank.forEach((q) => {
      chapterMap.set(q.chuong, (chapterMap.get(q.chuong) || 0) + 1);
    });

    return [...chapterMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([chapter, count]) => ({ chapter, count }));
  }, [questionBank]);

  const difficultyStats = useMemo(
    () => ({
      easy: questionBank.filter((q) => q.do_kho === 1).length,
      medium: questionBank.filter((q) => q.do_kho === 2).length,
      hard: questionBank.filter((q) => q.do_kho === 3).length,
    }),
    [questionBank]
  );

  const filteredManualQuestions = useMemo(() => {
    const keyword = questionSearch.trim().toLowerCase();
    if (!keyword) return questionBank;
    return questionBank.filter((q) => q.noi_dung.toLowerCase().includes(keyword));
  }, [questionBank, questionSearch]);

  const fetchClasses = async () => {
    setIsLoadingClasses(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await api.get<ClassesResponse>("/api/exams/classes", {
        params: {
          semester,
          academicYear,
        },
      });

      const fetchedClasses = res.data.classes || [];
      setClasses(fetchedClasses);

      if (fetchedClasses.length === 0) {
        setSelectedClassId(null);
        setExams([]);
        return;
      }

      const keptClassId = fetchedClasses.some((item) => item.id === selectedClassId)
        ? selectedClassId
        : fetchedClasses[0].id;

      setSelectedClassId(keptClassId);
      await fetchExamsByClass(keptClassId);
    } catch (err: any) {
      setClasses([]);
      setSelectedClassId(null);
      setExams([]);
      setErrorMessage(err?.response?.data?.message || "Không tải được danh sách lớp");
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchExamsByClass = async (classId: number | null) => {
    if (!classId) {
      setExams([]);
      return;
    }

    setIsLoadingExams(true);
    setErrorMessage("");

    try {
      const res = await api.get<{ exams: ExamApi[] }>("/api/exams", {
        params: { lop_id: classId },
      });
      setExams(res.data.exams || []);
    } catch (err: any) {
      setExams([]);
      setErrorMessage(err?.response?.data?.message || "Không tải được danh sách kỳ thi");
    } finally {
      setIsLoadingExams(false);
    }
  };

  const ensureQuestionBankLoaded = async () => {
    if (questionBank.length > 0) return;

    setIsLoadingQuestions(true);
    try {
      const res = await api.get<{ questions: QuestionApi[] }>("/api/question-bank");
      setQuestionBank(res.data.questions || []);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapExamToForm = (exam: ExamApi, className: string): CreateConfig => {
    const config = exam.cau_hinh || {};

    return {
      semester: config.hoc_ky || semester,
      academicYear: config.nam_hoc || academicYear,
      classId: exam.lop_id,
      className,
      examName: exam.ten_ky_thi || "",
      durationMinutes: toPositiveInt(exam.thoi_gian_lam_bai, 60),
      totalQuestions: toPositiveInt(config.tong_so_cau ?? exam.tong_so_cau, 30),
      startAt: toDatetimeLocal(exam.thoi_gian_bat_dau),
      examType: config.hinh_thuc_thi === "omr" ? "omr" : "online",
      generationMode: config.cach_tao_de === "manual" ? "manual" : "auto",
      shuffleQuestions: Boolean(config.tron_cau_hoi),
      shuffleAnswers: Boolean(config.tron_dap_an),
      examCodeCount: Math.max(1, toPositiveInt(config.so_ma_de, 1)),
      easyCount: toPositiveInt(config.so_cau_de, 0),
      mediumCount: toPositiveInt(config.so_cau_trung_binh, 0),
      hardCount: toPositiveInt(config.so_cau_kho, 0),
      selectedChapters: toNumberArray(config.ds_chuong),
      manualQuestionIds: toNumberArray(config.ds_cau_hoi_chon),
    };
  };

  const openCreateModal = async () => {
    if (!selectedClass) return;

    setErrorMessage("");
    setSuccessMessage("");
    setQuestionSearch("");

    try {
      await ensureQuestionBankLoaded();
      setEditingExam(null);
      setForm(createDefaultConfig(semester, academicYear, selectedClass.id, selectedClass.ten_lop));
      setIsModalOpen(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Không tải được ngân hàng câu hỏi");
    }
  };

  const openEditModal = async (exam: ExamApi) => {
    if (!selectedClass) return;

    setErrorMessage("");
    setSuccessMessage("");
    setQuestionSearch("");

    try {
      await ensureQuestionBankLoaded();
      setEditingExam(exam);
      setForm(mapExamToForm(exam, selectedClass.ten_lop));
      setIsModalOpen(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Không tải được ngân hàng câu hỏi");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
  };

  const toggleChapter = (chapter: number) => {
    setForm((prev) => {
      if (prev.selectedChapters.includes(chapter)) {
        return {
          ...prev,
          selectedChapters: prev.selectedChapters.filter((ch) => ch !== chapter),
        };
      }

      return {
        ...prev,
        selectedChapters: [...prev.selectedChapters, chapter],
      };
    });
  };

  const toggleManualQuestion = (questionId: number) => {
    setForm((prev) => {
      if (prev.manualQuestionIds.includes(questionId)) {
        return {
          ...prev,
          manualQuestionIds: prev.manualQuestionIds.filter((id) => id !== questionId),
        };
      }

      return {
        ...prev,
        manualQuestionIds: [...prev.manualQuestionIds, questionId],
      };
    });
  };

  const validateForm = () => {
    if (!form.classId) return "Bạn chưa chọn lớp";
    if (!form.examName.trim()) return "Bạn chưa nhập tên kỳ thi";
    if (form.durationMinutes <= 0) return "Thời gian làm bài phải lớn hơn 0";
    if (form.totalQuestions <= 0) return "Tổng số câu hỏi phải lớn hơn 0";
    if (form.examCodeCount <= 0) return "Số mã đề phải lớn hơn 0";

    if (form.generationMode === "manual") {
      if (form.manualQuestionIds.length !== form.totalQuestions) {
        return "Số câu hỏi chọn thủ công phải bằng tổng số câu";
      }
    } else {
      const totalByDifficulty = form.easyCount + form.mediumCount + form.hardCount;
      if (totalByDifficulty > form.totalQuestions) {
        return "Tổng số câu dễ/trung bình/khó không được vượt quá tổng số câu";
      }
    }

    return "";
  };

  const buildPayload = () => {
    const startAt = form.startAt ? new Date(form.startAt) : new Date();
    const endAt = new Date(startAt.getTime() + form.durationMinutes * 60000);

    return {
      ten_ky_thi: form.examName.trim(),
      mon_hoc_id: 1,
      lop_id: form.classId,
      thoi_gian_lam_bai: form.durationMinutes,
      thoi_gian_bat_dau: startAt.toISOString(),
      thoi_gian_ket_thuc: endAt.toISOString(),
      hoc_ky: form.semester,
      nam_hoc: form.academicYear,
      cau_hinh: {
        hoc_ky: form.semester,
        nam_hoc: form.academicYear,
        tong_so_cau: form.totalQuestions,
        hinh_thuc_thi: form.examType,
        cach_tao_de: form.generationMode,
        tron_cau_hoi: form.shuffleQuestions,
        tron_dap_an: form.shuffleAnswers,
        so_ma_de: form.examCodeCount,
        so_cau_de: form.easyCount,
        so_cau_trung_binh: form.mediumCount,
        so_cau_kho: form.hardCount,
        ds_chuong: form.selectedChapters,
        ds_cau_hoi_chon: form.manualQuestionIds,
      },
    };
  };

  const handleSaveExam = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload = buildPayload();

      if (editingExam) {
        await api.put(`/api/exams/${editingExam.id}/config`, payload);
        setSuccessMessage("Đã cập nhật kỳ thi thành công");
      } else {
        await api.post("/api/exams", payload);
        setSuccessMessage("Đã tạo kỳ thi thành công");
      }

      closeModal();
      await fetchExamsByClass(selectedClassId);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Lỗi khi lưu kỳ thi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExam = async (exam: ExamApi) => {
    const confirmed = window.confirm(`Bạn chắc chắn muốn xóa kỳ thi "${exam.ten_ky_thi}"?`);
    if (!confirmed) return;

    setDeletingExamId(exam.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.delete(`/api/exams/${exam.id}`);
      setSuccessMessage("Đã xóa kỳ thi thành công");
      await fetchExamsByClass(selectedClassId);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Không thể xóa kỳ thi");
    } finally {
      setDeletingExamId(null);
    }
  };

  const triggerDownload = async (url: string, fallbackMessage: string) => {
    setErrorMessage("");
    setSuccessMessage("");

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
      setSuccessMessage("Đã tải file OMR thành công");
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || fallbackMessage);
    }
  };

  const handleDownloadOmrExam = async (exam: ExamApi) => {
    await triggerDownload(`/api/exams/${exam.id}/omr/download-exam`, "Không thể tải đề OMR");
  };

  const handleDownloadOmrSheet = async (exam: ExamApi) => {
    await triggerDownload(`/api/exams/${exam.id}/omr/download-sheet`, "Không thể tải phiếu OMR");
  };

  return (
    <DashboardLayout role={"GI\u1ea2NG VI\u00caN"}>
      <div className="relative min-h-[calc(100vh-180px)] px-4 py-5">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
              <div className="w-full lg:w-56">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Học kỳ</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="1">Kỳ 1</option>
                  <option value="2">Kỳ 2</option>
                </select>
              </div>

              <div className="w-full lg:w-64">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Năm học</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>

              <button
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2 rounded-lg"
                onClick={fetchClasses}
                disabled={isLoadingClasses}
              >
                {isLoadingClasses ? "Đang lọc..." : "Lọc lớp"}
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Lớp theo bộ lọc</h2>

            {classes.length === 0 && (
              <div className="border border-amber-200 bg-amber-50 text-amber-800 rounded-lg p-4">
                Không có lớp nào theo bộ lọc học kỳ/năm học hiện tại.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {classes.map((cls) => {
                const active = cls.id === selectedClassId;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    className={`text-left border rounded-lg p-4 transition ${
                      active
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      fetchExamsByClass(cls.id);
                    }}
                  >
                    <h3 className="font-semibold text-slate-800">{cls.ten_lop}</h3>
                    <p className="text-sm text-slate-600 mt-1">Sĩ số: {cls.si_so ?? 0}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Kỳ {cls.hoc_ky || "-"} | Năm học {cls.nam_hoc || "-"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedClass
                    ? `Kỳ thi đã tạo - ${selectedClass.ten_lop}`
                    : "Kỳ thi đã tạo"}
                </h2>
                <p className="text-sm text-slate-500">
                  Chọn lớp bên trên để xem danh sách kỳ thi đã tạo và thao tác chỉnh sửa/xóa.
                </p>
              </div>

              <button
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-lg"
                onClick={openCreateModal}
                disabled={!selectedClass}
              >
                Tạo kỳ thi mới
              </button>
            </div>

            {isLoadingExams && <p className="text-indigo-600">Đang tải danh sách kỳ thi...</p>}

            {!isLoadingExams && selectedClass && exams.length === 0 && (
              <div className="border border-slate-200 bg-slate-50 rounded-lg p-4 text-slate-600">
                Lớp này chưa có kỳ thi nào.
              </div>
            )}

            <div className="space-y-3">
              {!isLoadingExams && exams.map((exam) => (
                <div key={exam.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{exam.ten_ky_thi}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Bắt đầu: {formatDateTime(exam.thoi_gian_bat_dau)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Kết thúc: {formatDateTime(exam.thoi_gian_ket_thuc)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Thời gian làm bài: {exam.thoi_gian_lam_bai || 0} phút | Tổng số câu: {exam.cau_hinh?.tong_so_cau || exam.tong_so_cau || "-"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Hình thức: {(exam.cau_hinh?.hinh_thuc_thi || "online").toUpperCase()} | Sinh đề: {(exam.cau_hinh?.cach_tao_de || "auto").toUpperCase()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {exam.cau_hinh?.hinh_thuc_thi === "omr" && (
                        <>
                          <button
                            className="px-3 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm inline-flex items-center gap-1"
                            onClick={() => handleDownloadOmrExam(exam)}
                            title="Tải đề OMR"
                          >
                            <Download size={16} />
                            Tải đề
                          </button>
                          <button
                            className="px-3 py-2 border border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 text-sm inline-flex items-center gap-1"
                            onClick={() => handleDownloadOmrSheet(exam)}
                            title="Tải phiếu OMR"
                          >
                            <Download size={16} />
                            Tải phiếu
                          </button>
                        </>
                      )}

                      <button
                        className="p-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50"
                        onClick={() => openEditModal(exam)}
                        title="Chỉnh sửa"
                        aria-label="Chỉnh sửa"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="p-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-60"
                        onClick={() => handleDeleteExam(exam)}
                        disabled={deletingExamId === exam.id}
                        title="Xóa"
                        aria-label="Xóa"
                      >
                        <Trash2 size={18} className={deletingExamId === exam.id ? "animate-pulse" : ""} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-red-700">{errorMessage}</div>
          )}

          {successMessage && (
            <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3 text-emerald-700">{successMessage}</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-40 flex items-start justify-center bg-slate-900/25 p-4 overflow-y-auto">
          <div className="w-full max-w-6xl my-6 max-h-[92vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingExam ? "Chỉnh sửa kỳ thi" : "Tạo kỳ thi mới"}
              </h2>
              <button className="text-slate-500 hover:text-slate-800" onClick={closeModal}>Đóng</button>
            </div>

            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Lớp</label>
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-100" value={form.className} readOnly />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tên kỳ thi</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.examName}
                    onChange={(e) => setForm({ ...form, examName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Thời gian làm bài (phút)</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    type="number"
                    min={1}
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tổng số câu hỏi</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    type="number"
                    min={1}
                    value={form.totalQuestions}
                    onChange={(e) => setForm({ ...form, totalQuestions: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Thời gian bắt đầu</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hình thức thi</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.examType}
                    onChange={(e) => setForm({ ...form, examType: e.target.value as ExamType })}
                  >
                    <option value="online">Trắc nghiệm Online</option>
                    <option value="omr">Trắc nghiệm OMR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Số mã đề</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    type="number"
                    min={1}
                    value={form.examCodeCount}
                    onChange={(e) => setForm({ ...form, examCodeCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cách sinh đề</label>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={form.generationMode === "auto"}
                          onChange={() => setForm({ ...form, generationMode: "auto" })}
                        />
                        Tự động theo chương + độ khó
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={form.generationMode === "manual"}
                          onChange={() => setForm({ ...form, generationMode: "manual" })}
                        />
                        Chọn thủ công từng câu hỏi
                      </label>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Tùy chọn trộn đề</h3>
                    <label className="flex items-center gap-2 mb-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.shuffleQuestions}
                        onChange={(e) => setForm({ ...form, shuffleQuestions: e.target.checked })}
                      />
                      Trộn vị trí câu hỏi
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.shuffleAnswers}
                        onChange={(e) => setForm({ ...form, shuffleAnswers: e.target.checked })}
                      />
                      Trộn vị trí đáp án A/B/C/D
                    </label>
                  </div>

                  {form.generationMode === "auto" && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Chọn chương cần ra đề</label>
                        <div className="flex flex-wrap gap-2">
                          {chapterOptions.map((item) => (
                            <button
                              key={item.chapter}
                              type="button"
                              onClick={() => toggleChapter(item.chapter)}
                              className={`px-3 py-1.5 rounded-full border text-sm ${
                                form.selectedChapters.includes(item.chapter)
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                  : "border-slate-300 text-slate-700"
                              }`}
                            >
                              Chương {item.chapter} ({item.count})
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Số câu dễ</label>
                          <input
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            type="number"
                            min={0}
                            value={form.easyCount}
                            onChange={(e) => setForm({ ...form, easyCount: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Số câu trung bình</label>
                          <input
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            type="number"
                            min={0}
                            value={form.mediumCount}
                            onChange={(e) => setForm({ ...form, mediumCount: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Số câu khó</label>
                          <input
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            type="number"
                            min={0}
                            value={form.hardCount}
                            onChange={(e) => setForm({ ...form, hardCount: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500">
                        Kho câu hiện có: Dễ {difficultyStats.easy} | Trung bình {difficultyStats.medium} | Khó {difficultyStats.hard}
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Danh sách câu hỏi thủ công</label>

                  {form.generationMode === "manual" ? (
                    <>
                      <input
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3"
                        placeholder="Tìm nhanh nội dung câu hỏi..."
                        value={questionSearch}
                        onChange={(e) => setQuestionSearch(e.target.value)}
                      />

                      <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-3 space-y-2">
                        {filteredManualQuestions.map((q) => (
                          <label key={q.id} className="flex items-start gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={form.manualQuestionIds.includes(q.id)}
                              onChange={() => toggleManualQuestion(q.id)}
                            />
                            <span>
                              [{q.id}] Chương {q.chuong} | Độ khó {q.do_kho} - {q.noi_dung}
                            </span>
                          </label>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        Đã chọn {form.manualQuestionIds.length}/{form.totalQuestions} câu
                      </p>
                    </>
                  ) : (
                    <div className="border border-slate-200 rounded-lg p-4 text-sm text-slate-600 bg-slate-50">
                      Bạn đang ở chế độ sinh đề tự động. Chuyển sang chế độ thủ công để chọn từng câu hỏi.
                    </div>
                  )}

                  {isLoadingQuestions && (
                    <p className="text-indigo-600 text-sm mt-3">Đang tải ngân hàng câu hỏi...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex justify-end gap-3">
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700" onClick={closeModal}>
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                onClick={handleSaveExam}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : editingExam ? "Lưu chỉnh sửa" : "Tạo kỳ thi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
