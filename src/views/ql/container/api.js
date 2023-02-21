import { request } from '@/utils'

export default {
  getContainers: (params = {}) => request.get('/container/page', { params }),
  getContainerById: (id) => request.get(`/container/${id}`),
  addContainer: (data) => request.post('/container', data),
  updateContainer: (data) => request.put(`/container`, data),
  deleteContainer: (name) => request.delete(`/container/${name}`),
}
