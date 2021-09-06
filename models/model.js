
const mockData = [
	{ id: "id-adm-01", username: "Admin 1", role: "Administrator"},
	{ id: "id-adm-02", username: "Admin 2", role: "Administrator"},
	{ id: "id-adm-03", username: "Admin 3", role: "Administrator"},
	{ id: "id-dev-01", username: "Developer 1", role: "Developer"},
	{ id: "id-dev-02", username: "Developer 2", role: "Developer"},
	{ id: "id-dev-03", username: "Developer 3", role: "Developer"},
	{ id: "id-tes-01", username: "Tester 1", role: "Tester"},
	{ id: "id-tes-02", username: "Tester 2", role: "Tester"},
	{ id: "id-tes-03", username: "Tester 3", role: "Tester"},
	{ id: "admin", username: "admin", role: "Administrator"},
];

class Model {
	
	getUserByUsername(id) {
		return mockData.find(user => user.id === id);
	}

	getUserList() {
		return mockData;
	}
}
module.exports = Model;