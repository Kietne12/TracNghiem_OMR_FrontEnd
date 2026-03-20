// API service for practice endpoints
import api from './api'

// Create bài luyện tập
export const createPractice = async (data: {
  mon_hoc_id?: number
  lop_id: number
  ten_bai: string
  mo_ta?: string
  so_cau: number
  thoi_gian_lam_bai?: number
  cau_hinh?: any
}) => {
  const response = await api.post(`/api/practice`, data)
  return response.data
}

// Get danh sách bài luyện tập
export const getPracticeList = async (filters?: {
  lop_id?: number
  mon_hoc_id?: number
  semester?: string
  academicYear?: string
}) => {
  const response = await api.get(`/api/practice`, {
    params: filters,
  })
  return response.data
}

// Get chi tiết bài luyện tập
export const getPracticeDetail = async (id: number) => {
  const response = await api.get(`/api/practice/${id}`)
  return response.data
}

// Update bài luyện tập
export const updatePractice = async (id: number, data: any) => {
  const response = await api.put(`/api/practice/${id}`, data)
  return response.data
}

// Delete bài luyện tập
export const deletePractice = async (id: number) => {
  const response = await api.delete(`/api/practice/${id}`)
  return response.data
}

// Bắt đầu làm bài
export const startPractice = async (bai_luyen_tap_id: number, sinh_vien_id?: number) => {
  const response = await api.post(
    `/api/practice/${bai_luyen_tap_id}/start`,
    sinh_vien_id ? { sinh_vien_id } : {}
  )
  return response.data
}

// Nộp bài
export const submitPractice = async (
  lich_su_bai_id: number,
  answers: Array<{ cau_hoi_id: number; dap_an_student: string }>
) => {
  const response = await api.post(
    `/api/practice/lich-su/${lich_su_bai_id}/submit`,
    { answers }
  )
  return response.data
}

// Get kết quả bài làm
export const getPracticeResult = async (lich_su_bai_id: number) => {
  const response = await api.get(
    `/api/practice/lich-su/${lich_su_bai_id}/result`
  )
  return response.data
}

// Get lịch sử làm bài của sinh viên
export const getPracticeHistory = async (
  bai_luyen_tap_id: number,
  sinh_vien_id?: number
) => {
  const response = await api.get(
    `/api/practice/${bai_luyen_tap_id}/history`,
    {
      params: sinh_vien_id ? { sinh_vien_id } : {},
    }
  )
  return response.data
}

// Get thống kê bài luyện tập
export const getPracticeStatistics = async (bai_luyen_tap_id: number) => {
  const response = await api.get(
    `/api/practice/${bai_luyen_tap_id}/statistics`
  )
  return response.data
}

// Get thống kê sinh viên
export const getStudentPracticeStatistics = async (sinh_vien_id: number) => {
  const response = await api.get(
    `/api/practice/thong-ke/student/${sinh_vien_id}`
  )
  return response.data
}
