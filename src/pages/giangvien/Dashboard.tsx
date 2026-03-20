import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { Users, BookOpen, FileText, Calendar } from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface DashboardStats {
  studentsCount: number;
  examsCreated: number;
  questionsBank: number;
  avgClassScore: number;
}

interface RecentExam {
  id: number;
  name: string;
  date: string;
  submissions: number;
  graded: number;
}

export default function TeacherDashboard() {
  useAuth(); // ensure context block, chỉ cần giữ authentication chạy, không dùng trực tiếp tại đây
  const [stats, setStats] = useState<DashboardStats>({
    studentsCount: 0,
    examsCreated: 0,
    questionsBank: 0,
    avgClassScore: 0,
  });
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get<DashboardStats>("/api/dashboard/stats"),
          api.get<{ recentExams: RecentExam[] }>("/api/dashboard/recent-exams"),
        ]);

        setStats(statsRes.data);
        setRecentExams(recentRes.data.recentExams);
      } catch (err: any) {
        console.error("Lấy dữ liệu dashboard lỗi:", err);

        const apiMessage = err?.response?.data?.message || err?.message || "Lỗi không xác định";
        setError(`Không tải được dữ liệu: ${apiMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="text-center py-20">Đang tải dữ liệu ...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="text-center py-20 text-red-600">{error}</div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Xin chào, Giáo viên!
        </h1>
        <p className="text-slate-600">Quản lý các kỳ thi và học sinh của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Số học sinh</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.studentsCount}</p>
            </div>
            <Users size={32} className="text-indigo-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Kỳ thi tạo</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.examsCreated}</p>
            </div>
            <FileText size={32} className="text-cyan-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Câu hỏi</p>
              <p className="text-3xl font-bold text-green-600">{stats.questionsBank}</p>
            </div>
            <BookOpen size={32} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Kỳ thi gần đây</h2>
          </div>
          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800">{exam.name}</h3>
                  <span className="text-xs text-slate-500">{exam.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{exam.submissions} nộp bài</span>
                  <span>{exam.graded}/{exam.submissions} đã chấm</span>
                </div>
                <div className="mt-2 bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${(exam.graded / exam.submissions) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:shadow-lg text-white rounded-lg p-6 flex items-center gap-4 transition group">
          <FileText size={32} className="group-hover:scale-110 transition" />
          <div className="text-left">
            <p className="font-semibold text-sm">Tạo kỳ thi mới</p>
            <p className="text-indigo-200 text-xs">Tạo đề thi mới cho lớp</p>
          </div>
        </button>
        <button className="bg-gradient-to-br from-cyan-600 to-cyan-700 hover:shadow-lg text-white rounded-lg p-6 flex items-center gap-4 transition group">
          <BookOpen size={32} className="group-hover:scale-110 transition" />
          <div className="text-left">
            <p className="font-semibold text-sm">Ngân hàng câu hỏi</p>
            <p className="text-cyan-200 text-xs">Quản lý câu hỏi</p>
          </div>
        </button>
        <button className="bg-gradient-to-br from-green-600 to-green-700 hover:shadow-lg text-white rounded-lg p-6 flex items-center gap-4 transition group">
          <Users size={32} className="group-hover:scale-110 transition" />
          <div className="text-left">
            <p className="font-semibold text-sm">Quản lý học sinh</p>
            <p className="text-green-200 text-xs">Xem kết quả học sinh</p>
          </div>
        </button>
      </div>
    </DashboardLayout>
  )
}
