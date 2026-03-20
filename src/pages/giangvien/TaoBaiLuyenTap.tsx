import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import api from "../../services/api";
import { createPractice, deletePractice, getPracticeList } from "../../services/practiceService";

type GenerationMode = "auto" | "manual";

interface ClassItem {
  id: number;
  ten_lop: string;
  hoc_ky?: string | null;
  nam_hoc?: string | null;
  si_so?: number;
}

interface PracticeConfig {
  hoc_ky?: string | null;
  nam_hoc?: string | null;
  tong_so_cau?: number;
  cach_tao_de?: GenerationMode;
  tron_cau_hoi?: boolean;
  tron_dap_an?: boolean;
  so_cau_de?: number;
  so_cau_trung_binh?: number;
  so_cau_kho?: number;
  ds_chuong?: number[];
  ds_cau_hoi_chon?: number[];
  cho_phep_lam_lai?: boolean;
  cho_xem_chi_tiet?: boolean;
  cho_xem_dap_an_dung?: boolean;
}

interface PracticeItem {
  id: number;
  ten_bai: string;
  mo_ta: string;
  so_cau: number;
  thoi_gian_lam_bai: number;
  lop_id: number;
  trang_thai: "active" | "inactive";
  cau_hinh?: PracticeConfig;
}

interface QuestionItem {
  id: number;
  noi_dung: string;
  do_kho: number;
  chuong: number;
}

interface CreateForm {
  ten_bai: string;
  mo_ta: string;
  thoi_gian_lam_bai: number;
  tong_so_cau: number;
  cach_tao_de: GenerationMode;
  tron_cau_hoi: boolean;
  tron_dap_an: boolean;
  so_cau_de: number;
  so_cau_trung_binh: number;
  so_cau_kho: number;
  ds_chuong: number[];
  ds_cau_hoi_chon: number[];
  cho_phep_lam_lai: boolean;
  cho_xem_chi_tiet: boolean;
  cho_xem_dap_an_dung: boolean;
}

const defaultForm: CreateForm = {
  ten_bai: "",
  mo_ta: "",
  thoi_gian_lam_bai: 60,
  tong_so_cau: 30,
  cach_tao_de: "auto",
  tron_cau_hoi: true,
  tron_dap_an: true,
  so_cau_de: 10,
  so_cau_trung_binh: 10,
  so_cau_kho: 10,
  ds_chuong: [],
  ds_cau_hoi_chon: [],
  cho_phep_lam_lai: true,
  cho_xem_chi_tiet: true,
  cho_xem_dap_an_dung: true,
};

export default function TaoBaiLuyenTap() {
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [practices, setPractices] = useState<PracticeItem[]>([]);
  const [search, setSearch] = useState("");

  const [questionBank, setQuestionBank] = useState<QuestionItem[]>([]);
  const [questionSearch, setQuestionSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CreateForm>(defaultForm);

  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingPractices, setIsLoadingPractices] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canLoadClasses = semester !== "" && academicYear.trim() !== "";

  const chapterOptions = useMemo(() => {
    const map = new Map<number, number>();
    questionBank.forEach((q) => {
      map.set(q.chuong, (map.get(q.chuong) || 0) + 1);
    });

    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([chuong, total]) => ({ chuong, total }));
  }, [questionBank]);

  const filteredQuestions = useMemo(() => {
    const keyword = questionSearch.trim().toLowerCase();
    if (!keyword) return questionBank;
    return questionBank.filter((q) => q.noi_dung.toLowerCase().includes(keyword));
  }, [questionBank, questionSearch]);

  const filteredPractices = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return practices;
    return practices.filter((p) => p.ten_bai.toLowerCase().includes(keyword));
  }, [practices, search]);

  const fetchClasses = async () => {
    if (!canLoadClasses) {
      setClasses([]);
      setSelectedClassId(null);
      setPractices([]);
      return;
    }

    setIsLoadingClasses(true);
    setErrorMessage("");

    try {
      const res = await api.get<{ classes: ClassItem[] }>("/api/exams/classes", {
        params: {
          semester,
          academicYear,
        },
      });

      const fetchedClasses = res.data.classes || [];
      setClasses(fetchedClasses);

      const keepClassId =
        selectedClassId && fetchedClasses.some((item) => item.id === selectedClassId)
          ? selectedClassId
          : null;

      setSelectedClassId(keepClassId);
      if (keepClassId) {
        await fetchPracticesByClass(keepClassId);
      } else {
        setPractices([]);
      }
    } catch (error: any) {
      setClasses([]);
      setSelectedClassId(null);
      setPractices([]);
      setErrorMessage(error?.response?.data?.message || "Không tải được danh sách lớp");
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchPracticesByClass = async (classId: number | null) => {
    if (!classId) {
      setPractices([]);
      return;
    }

    setIsLoadingPractices(true);
    setErrorMessage("");

    try {
      const response = await getPracticeList({
        lop_id: classId,
        semester,
        academicYear,
      });

      if (response.success) {
        setPractices(response.data || []);
      } else {
        setPractices([]);
        setErrorMessage(response.error || "Không tải được danh sách bài luyện tập");
      }
    } catch (error: any) {
      setPractices([]);
      setErrorMessage(error?.response?.data?.error || "Không tải được danh sách bài luyện tập");
    } finally {
      setIsLoadingPractices(false);
    }
  };

  const ensureQuestionBankLoaded = async () => {
    if (questionBank.length > 0) return;

    setIsLoadingQuestions(true);
    try {
      const res = await api.get<{ questions: QuestionItem[] }>("/api/question-bank");
      setQuestionBank(res.data.questions || []);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Không tải được ngân hàng câu hỏi");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (!canLoadClasses) {
      setClasses([]);
      setSelectedClassId(null);
      setPractices([]);
      return;
    }

    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester, academicYear]);

  const openCreateModal = async () => {
    if (!selectedClassId) {
      setErrorMessage("Bạn cần chọn lớp trước khi tạo bài luyện tập");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setQuestionSearch("");

    try {
      await ensureQuestionBankLoaded();
      setForm(defaultForm);
      setShowCreateModal(true);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setForm(defaultForm);
    setQuestionSearch("");
  };

  const toggleChapter = (chapter: number) => {
    setForm((prev) => ({
      ...prev,
      ds_chuong: prev.ds_chuong.includes(chapter)
        ? prev.ds_chuong.filter((item) => item !== chapter)
        : [...prev.ds_chuong, chapter],
    }));
  };

  const toggleManualQuestion = (questionId: number) => {
    setForm((prev) => ({
      ...prev,
      ds_cau_hoi_chon: prev.ds_cau_hoi_chon.includes(questionId)
        ? prev.ds_cau_hoi_chon.filter((item) => item !== questionId)
        : [...prev.ds_cau_hoi_chon, questionId],
    }));
  };

  const validateForm = () => {
    if (!selectedClassId) return "Bạn chưa chọn lớp";
    if (!form.ten_bai.trim()) return "Bạn chưa nhập tên bài luyện tập";
    if (form.thoi_gian_lam_bai <= 0) return "Thời gian làm bài phải lớn hơn 0";
    if (form.tong_so_cau <= 0) return "Tổng số câu phải lớn hơn 0";

    if (form.cach_tao_de === "manual") {
      if (form.ds_cau_hoi_chon.length !== form.tong_so_cau) {
        return "Số câu hỏi chọn thủ công phải bằng tổng số câu";
      }
      return "";
    }

    const totalByDifficulty = form.so_cau_de + form.so_cau_trung_binh + form.so_cau_kho;
    if (totalByDifficulty > form.tong_so_cau) {
      return "Tổng số câu dễ/trung bình/khó không được vượt quá tổng số câu";
    }

    return "";
  };

  const handleCreatePractice = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!selectedClassId) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await createPractice({
        mon_hoc_id: 1,
        lop_id: selectedClassId,
        ten_bai: form.ten_bai.trim(),
        mo_ta: form.mo_ta.trim(),
        so_cau: form.tong_so_cau,
        thoi_gian_lam_bai: form.thoi_gian_lam_bai,
        cau_hinh: {
          hoc_ky: semester,
          nam_hoc: academicYear,
          tong_so_cau: form.tong_so_cau,
          cach_tao_de: form.cach_tao_de,
          tron_cau_hoi: form.tron_cau_hoi,
          tron_dap_an: form.tron_dap_an,
          so_cau_de: form.so_cau_de,
          so_cau_trung_binh: form.so_cau_trung_binh,
          so_cau_kho: form.so_cau_kho,
          ds_chuong: form.ds_chuong,
          ds_cau_hoi_chon: form.ds_cau_hoi_chon,
          cho_phep_lam_lai: form.cho_phep_lam_lai,
          cho_xem_chi_tiet: form.cho_xem_chi_tiet,
          cho_xem_dap_an_dung: form.cho_xem_dap_an_dung,
        },
      });

      if (!response.success) {
        setErrorMessage(response.error || "Không thể tạo bài luyện tập");
        return;
      }

      setSuccessMessage("Tạo bài luyện tập thành công");
      closeCreateModal();
      await fetchPracticesByClass(selectedClassId);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.error || "Không thể tạo bài luyện tập");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePractice = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài luyện tập này?")) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await deletePractice(id);
      if (!response.success) {
        setErrorMessage(response.error || "Không thể xóa bài luyện tập");
        return;
      }

      setSuccessMessage("Đã xóa bài luyện tập");
      setPractices((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.error || "Không thể xóa bài luyện tập");
    }
  };

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      <div className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Tạo bài luyện tập
          </h1>
          <p className="text-slate-600">Chọn kỳ, năm học, lớp để quản lý bài luyện tập đã tạo</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
          disabled={!selectedClassId}
        >
          <Plus size={20} />
          Tạo bài luyện tập mới
        </button>
      </div>

      {(errorMessage || successMessage) && (
        <div className="mb-6 space-y-3">
          {errorMessage && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">{successMessage}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kỳ học</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            onChange={(e) => {
              const value = Number(e.target.value);
              setSelectedClassId(value || null);
              fetchPracticesByClass(value || null);
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!canLoadClasses || isLoadingClasses || classes.length === 0}
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

      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên bài luyện tập..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoadingPractices ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPractices.length > 0 ? (
            filteredPractices.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">{item.ten_bai}</h3>
                    <p className="text-sm text-slate-600 mt-1">{item.mo_ta || "Không có mô tả"}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePractice(item.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    title="Xóa bài luyện tập"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 mb-3">
                  <div>❓ Số câu: <strong>{item.so_cau}</strong></div>
                  <div>⏱️ Thời gian: <strong>{item.thoi_gian_lam_bai} phút</strong></div>
                  <div>Cách tạo: <strong>{item.cau_hinh?.cach_tao_de === "manual" ? "Thủ công" : "Tự động"}</strong></div>
                  <div>Trạng thái: <strong>{item.trang_thai === "active" ? "Kích hoạt" : "Tạm khóa"}</strong></div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`px-3 py-1 rounded-full ${item.cau_hinh?.cho_phep_lam_lai ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"}`}>
                    {item.cau_hinh?.cho_phep_lam_lai ? "Cho làm lại" : "Không cho làm lại"}
                  </span>
                  <span className={`px-3 py-1 rounded-full ${item.cau_hinh?.cho_xem_chi_tiet ? "bg-cyan-100 text-cyan-800" : "bg-slate-100 text-slate-700"}`}>
                    {item.cau_hinh?.cho_xem_chi_tiet ? "Cho xem chi tiết bài làm" : "Ẩn chi tiết bài làm"}
                  </span>
                  <span className={`px-3 py-1 rounded-full ${item.cau_hinh?.cho_xem_dap_an_dung ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-700"}`}>
                    {item.cau_hinh?.cho_xem_dap_an_dung ? "Cho xem đáp án đúng" : "Ẩn đáp án đúng"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-xl text-slate-500">
              Chưa có bài luyện tập cho lớp này
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Tạo bài luyện tập mới</h2>
              <button onClick={closeCreateModal} className="text-slate-500 hover:text-slate-700">Đóng</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tên bài luyện tập</label>
                  <input
                    value={form.ten_bai}
                    onChange={(e) => setForm((prev) => ({ ...prev, ten_bai: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="VD: Luyện tập Chương 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Thời gian làm bài (phút)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.thoi_gian_lam_bai}
                    onChange={(e) => setForm((prev) => ({ ...prev, thoi_gian_lam_bai: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={form.mo_ta}
                  onChange={(e) => setForm((prev) => ({ ...prev, mo_ta: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                  placeholder="Mô tả ngắn về bài luyện tập"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tổng số câu</label>
                  <input
                    type="number"
                    min={1}
                    value={form.tong_so_cau}
                    onChange={(e) => setForm((prev) => ({ ...prev, tong_so_cau: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cách tạo đề</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.cach_tao_de === "auto"}
                        onChange={() => setForm((prev) => ({ ...prev, cach_tao_de: "auto" }))}
                      />
                      Tự động
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.cach_tao_de === "manual"}
                        onChange={() => setForm((prev) => ({ ...prev, cach_tao_de: "manual" }))}
                      />
                      Thủ công
                    </label>
                  </div>
                </div>
              </div>

              {form.cach_tao_de === "auto" ? (
                <>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Chọn chương cần ra đề</p>
                    {isLoadingQuestions ? (
                      <p className="text-sm text-slate-500">Đang tải chương...</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {chapterOptions.map((item) => (
                          <label key={item.chuong} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={form.ds_chuong.includes(item.chuong)}
                              onChange={() => toggleChapter(item.chuong)}
                            />
                            Chương {item.chuong} ({item.total})
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Câu dễ</label>
                      <input
                        type="number"
                        min={0}
                        value={form.so_cau_de}
                        onChange={(e) => setForm((prev) => ({ ...prev, so_cau_de: Number(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Câu trung bình</label>
                      <input
                        type="number"
                        min={0}
                        value={form.so_cau_trung_binh}
                        onChange={(e) => setForm((prev) => ({ ...prev, so_cau_trung_binh: Number(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Câu khó</label>
                      <input
                        type="number"
                        min={0}
                        value={form.so_cau_kho}
                        onChange={(e) => setForm((prev) => ({ ...prev, so_cau_kho: Number(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tìm câu hỏi thủ công</label>
                    <input
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      placeholder="Tìm theo nội dung câu hỏi..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg divide-y">
                    {filteredQuestions.map((q) => (
                      <label key={q.id} className="block px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.ds_cau_hoi_chon.includes(q.id)}
                            onChange={() => toggleManualQuestion(q.id)}
                            className="mt-1"
                          />
                          <div>
                            <p className="text-slate-800">{q.noi_dung}</p>
                            <p className="text-xs text-slate-500 mt-1">Chương {q.chuong} | Độ khó {q.do_kho}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Đã chọn {form.ds_cau_hoi_chon.length}/{form.tong_so_cau} câu
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.tron_cau_hoi}
                    onChange={(e) => setForm((prev) => ({ ...prev, tron_cau_hoi: e.target.checked }))}
                  />
                  Trộn thứ tự câu hỏi
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.tron_dap_an}
                    onChange={(e) => setForm((prev) => ({ ...prev, tron_dap_an: e.target.checked }))}
                  />
                  Trộn đáp án trong câu
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.cho_phep_lam_lai}
                    onChange={(e) => setForm((prev) => ({ ...prev, cho_phep_lam_lai: e.target.checked }))}
                  />
                  Cho phép làm lại
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.cho_xem_chi_tiet}
                    onChange={(e) => setForm((prev) => ({ ...prev, cho_xem_chi_tiet: e.target.checked }))}
                  />
                  Cho xem chi tiết bài làm
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.cho_xem_dap_an_dung}
                    onChange={(e) => setForm((prev) => ({ ...prev, cho_xem_dap_an_dung: e.target.checked }))}
                  />
                  Cho xem đáp án đúng sau khi nộp bài
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={closeCreateModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  disabled={isSaving}
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreatePractice}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? "Đang lưu..." : "Lưu bài luyện tập"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
