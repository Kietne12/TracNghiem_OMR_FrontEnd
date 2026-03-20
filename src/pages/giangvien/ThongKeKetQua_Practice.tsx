import DashboardLayout from "../../layout/DashboardLayout";
import { BarChart as BarChartIcon, TrendingUp, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPracticeStatistics } from "../../services/practiceService";

export default function ThongKeKetQua() {
  const { practiceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    if (practiceId) {
      loadStatistics();
    }
  }, [practiceId]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPracticeStatistics(parseInt(practiceId!));
      if (response.success) {
        setStatistics(response.data);
      } else {
        setError(response.error || "Failed to load statistics");
      }
    } catch (err) {
      setError("Error loading statistics: " + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  if (!practiceId) {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="text-center py-12">
          <p className="text-slate-600">Vui lòng chọn một bài luyện tập</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Thống kê kết quả
        </h1>
        <p className="text-slate-600">Xem thống kê điểm cho bài luyện tập</p>
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
      ) : statistics ? (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Tổng sinh viên</div>
              <div className="text-3xl font-bold text-slate-800">
                {statistics.tong_sinh_vien_lam}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Đã nộp bài</div>
              <div className="text-3xl font-bold text-slate-800">
                {statistics.so_sinh_vien_da_nop}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Điểm trung bình</div>
              <div className="text-3xl font-bold text-indigo-600">
                {statistics.diem_trung_binh}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Điểm cao nhất</div>
              <div className="text-3xl font-bold text-green-600">
                {statistics.diem_cao_nhat.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Score Range */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Thấp nhất: {statistics.diem_thap_nhat.toFixed(2)}
            </h3>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              <TrendingUp className="inline mr-2" size={20} />
              Chi tiết theo sinh viên
            </h3>

            {statistics.chi_tiet && statistics.chi_tiet.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200">
                    <tr className="text-left">
                      <th className="py-3 px-4 font-semibold text-slate-700">
                        Mã số
                      </th>
                      <th className="py-3 px-4 font-semibold text-slate-700">
                        Tên sinh viên
                      </th>
                      <th className="py-3 px-4 font-semibold text-slate-700">
                        Điểm
                      </th>
                      <th className="py-3 px-4 font-semibold text-slate-700">
                        Thời gian bắt đầu
                      </th>
                      <th className="py-3 px-4 font-semibold text-slate-700">
                        Thời gian nộp
                      </th>
                      <th className="py-3 px-4 font-semibold text-slate-700">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.chi_tiet.map((item: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-slate-600">{item.ma_so}</td>
                        <td className="py-3 px-4 text-slate-800">
                          {item.sinh_vien_name || "Unknown"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.tong_diem >= 7
                                ? "bg-green-100 text-green-800"
                                : item.tong_diem >= 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.tong_diem ? item.tong_diem.toFixed(2) : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {item.thoi_gian_bat_dau
                            ? new Date(item.thoi_gian_bat_dau).toLocaleString("vi-VN")
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {item.thoi_gian_nop
                            ? new Date(item.thoi_gian_nop).toLocaleString("vi-VN")
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.trang_thai === "da_nop" ||
                              item.trang_thai === "da_cham"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.trang_thai === "da_nop"
                              ? "Đã nộp"
                              : item.trang_thai === "da_cham"
                              ? "Đã chấm"
                              : "Đang làm"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-600 text-center py-4">
                Chưa có dữ liệu
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChartIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600">Không có thống kê để hiển thị</p>
        </div>
      )}
    </DashboardLayout>
  );
}
