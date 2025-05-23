import createApiClient from "./api.service";
class TheoDoiMuonSachService {
    constructor(baseUrl = "http://127.0.0.1:3000/api/theodoimuonsach") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }
  async getByDocGia(docGiaId){
        return (await this.api.get(`/docgia/${docGiaId}`)).data
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    } 

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new TheoDoiMuonSachService();