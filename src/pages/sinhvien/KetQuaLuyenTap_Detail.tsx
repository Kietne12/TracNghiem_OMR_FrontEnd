import DashboardLayout from "../../layout/DashboardLayout";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPracticeResult } from "../../services/practiceService";

interface QuestionDetail {
  id: number;
  cau_hoi_id: number;
  dap_an_student: string;
  dap_an_dung: string;
  dung_sai: boolean;
  cau_hoi?: {
    id: number;
    noi_dung: string;
    a?: string;
    b?: string;
    c?: string;
    d?: string;
  };
}

export default function KetQuaLuyenTap() {
  const { lichSuBaiId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (lichSuBaiId) {
      loadResult();
    }
  }, [lichSuBaiId]);

  const loadResult = async () => {
    try {
      setLoading(true);
      const response = await getPracticeResult(parseInt(lichSuBaiId!));
      if (response.success) {
        setResult(response.data);
      }
    } catch (err) {
      console.error("Error loading result: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="SINH VIÊN">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin">Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!result) {
    return (
      <DashboardLayout role="SINH VIÊN">
        <div className="text-center py-12">
          <p className="text-slate-600">Không tìm thấy kết quả</p>
        </div>
      </DashboardLayout>
    );
  }

  const correctCount = result.chi_tiet_bai_luyen_taps?.filter(
    (d: QuestionDetail) => d.dung_sai
  ).length || 0;
  const totalCount = result.chi_tiet_bai_luyen_taps?.length || 0;

  return (
    <DashboardLayout role="SINH VIÊN">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
      >
        <ArrowLeft size={20} />
        Quay lại
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Kết quả làm bài
        </h1>
        <p className="text-slate-600">
          Xem chi tiết các câu hỏi bạn làm
        </p>
      </div>

      {/* Score Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg text-white p-8 mb-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-sm opacity-90 mb-2">Tổng điểm</div>
            <div className="text-4xl font-bold">
              {result.tong_diem ? result.tong_diem.toFixed(2) : "0"}/10
            </div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-2">Câu đúng</div>
            <div className="text-4xl font-bold text-green-300">
              {correctCount}/{totalCount}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-2">Tỷ lệ</div>
            <div className="text-4xl font-bold">
              {totalCount > 0
                ? ((correctCount / totalCount) * 100).toFixed(0)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Question Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Chi tiết các câu hỏi</h2>

        {result.chi_tiet_bai_luyen_taps &&
        result.chi_tiet_bai_luyen_taps.length > 0 ? (
          result.chi_tiet_bai_luyen_taps.map(
            (detail: QuestionDetail, idx: number) => (
              <div
                key={idx}
                className={`rounded-lg border-2 p-6 ${
                  detail.dung_sai
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {detail.dung_sai ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Câu {idx + 1}. {detail.cau_hoi?.noi_dung || "N/A"}
                    </h3>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {["a", "b", "c", "d"].map((option: string) => {
                        const optionValue = detail.cau_hoi?.[
                          option as keyof typeof detail.cau_hoi
                        ];
                        if (!optionValue) return null;

                        const isStudentAnswer =
                          detail.dap_an_student?.toUpperCase() ===
                          option.toUpperCase();
                        const isCorrectAnswer =
                          detail.dap_an_dung?.toUpperCase() ===
                          option.toUpperCase();

                        return (
                          <div
                            key={option}
                            className={`p-3 rounded border-2 ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-100"
                                : isStudentAnswer
                                ? "border-red-500 bg-red-100"
                                : "border-slate-200"
                            }`}
                          >
                            <span className="font-semibold uppercase">
                              {option}.
                            </span>{" "}
                            {optionValue}
                            {isCorrectAnswer && (
                              <span className="ml-2 text-green-700 font-semibold">
                                ✓ Đáp án đúng
                              </span>
                            )}
                            {isStudentAnswer && !isCorrectAnswer && (
                              <span className="ml-2 text-red-700 font-semibold">
                                ✗ Bạn chọn
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Result */}
                    <div className="text-sm font-semibold">
                      {detail.dung_sai ? (
                        <span className="text-green-700">✓ Trả lời đúng</span>
                      ) : (
                        <span className="text-red-700">✗ Trả lời sai</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-slate-600 text-center py-4">
            Không có chi tiết câu hỏi
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
