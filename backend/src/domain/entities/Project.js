class Project {
  constructor({ id, name, description, start_date, status_id, status_name }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = start_date;
    this.statusId = status_id;
    this.statusName = status_name; // Este campo vendrá del cruce (JOIN) con la tabla de estados
  }
}

module.exports = Project;