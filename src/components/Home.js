import "../styles/Home.css";
import data from "../data/books.json";

function App() {
  return (
    <div className="App">
      {data.map((data, key) => {
        return (
          <div key={key} className="container">
            <div className="text">
              <p className="title">id:</p>
              &nbsp;
              <p>{data.id}</p>
            </div>

            <div className="text">
              <p className="title">title:</p>
              &nbsp;
              <p> {data.title}</p>
            </div>

            <div className="text">
              <p className="title">Author:</p>
              &nbsp;
              <p> {data.field_author_creator}</p>
            </div>

            <div className="text">
              <p className="title">Collaborator(s):</p>
              &nbsp;
              <p> {data.field_collaborator}</p>
            </div>

            <div className="text">
              <p className="title">Date of publication(s):</p>
              &nbsp;
              <p> {data.field_date_of_publication}</p>
            </div>

            <div className="text">
              <p className="title">Description</p>
              &nbsp;
              <p> {data.field_description}</p>
            </div>

            <div className="text">
              <p className="title">Edition</p>
              &nbsp;
              <p> {data.field_edition}</p>
            </div>

            <div className="text">
              <p className="title">Extent of edition</p>
              &nbsp;
              <p> {data.field_extent_of_the_edition}</p>
            </div>

            <div className="text">
              <p className="title">Genre form</p>
              &nbsp;
              <p> {data.field_genre_form}</p>
            </div>

            <div className="text">
              <p className="title">Isbn</p>
              &nbsp;
              <p> {data.field_isbn}</p>
            </div>

            <div className="text">
              <p className="title">Language</p>
              &nbsp;
              <p> {data.field_language}</p>
            </div>

            <div className="text">
              <p className="title">Number of pages</p>
              &nbsp;
              <p> {data.field_number_of_pages}</p>
            </div>

            <div className="text">
              <p className="title">Original</p>
              &nbsp;
              <p> {data.field_original}</p>
            </div>

            <div className="text">
              <p className="title">Other tiles</p>
              &nbsp;
              <p> {data.field_other_titles}</p>
            </div>

            <div className="text">
              <p className="title">Permalink</p>
              &nbsp;
              <p> {data.field_permalink}</p>
            </div>

            <div className="text">
              <p className="title">Reference number</p>
              &nbsp;
              <p> {data.field_reference_number}</p>
            </div>

            <div className="text">
              <p className="title">Remarks</p>
              &nbsp;
              <p> {data.field_remarks}</p>
            </div>

            <div className="text">
              <p className="title">Serie title</p>
              &nbsp;
              <p> {data.field_serie_title}</p>
            </div>

            <div className="text">
              <p className="title">Source</p>
              &nbsp;
              <p> {data.field_source}</p>
            </div>

            <div className="text">
              <p className="title">Subjects</p>
              &nbsp;
              <p> {data.field_subjects}</p>
            </div>

            <div className="text">
              <p> className="title"Part of project of</p>
              &nbsp;
              <p> {data.field_part_of_the_project_of}</p>
            </div>

            <div className="text">
              <p className="title">Part of project of</p>
              &nbsp;
              <p> {data.field_abstract}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
