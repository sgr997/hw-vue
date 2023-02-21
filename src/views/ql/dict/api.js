import { request } from '@/utils'

export default {
  getDicts: (params = {}) => request.get('/dict/page', { params }),
  getDictById: (id) => request.get(`/dict/${id}`),
  addDict: (data) => request.post('/dict', [data]),
  updateDict: (data) => request.put(`/dict`, [data]),
  deleteDict: (id) => request.delete(`/dict/${id}`),
}
