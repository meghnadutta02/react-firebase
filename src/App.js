import { useEffect, useState } from "react";
import Auth from "./components/Auth";

import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
function App() {
  const [movies, setMovies] = useState([]);
  const [editableMovies, setEditableMovies] = useState({});
  const [newMovie, setNewMovie] = useState({
    title: "",
    releaseYear: "",
    oscarNominated: false,
  });
  const [image, setImage] = useState(null);
  const [updatedMovie, setUpdatedMovie] = useState({
    title: "",
    releaseYear: "",
    oscarNominated: false,
  });
  const updateMovie = async (id, movie) => {
    try {
      const movieRef = doc(db, "movies", id);
      const fieldsToUpdate = {};

      Object.entries(updatedMovie).forEach(([key, value]) => {
        if (value === "") {
          fieldsToUpdate[key] = movie[key];
        } else {
          fieldsToUpdate[key] = value;
        }
      });

      await updateDoc(movieRef, fieldsToUpdate);
      setEditableMovies((prev) => ({
        ...prev,
        [id]: false,
      }));
      setUpdatedMovie({
        title: "",
        releaseYear: "",
        oscarNominated: false,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const deleteMovie = async (id) => {
    try {
      const movie = doc(db, "movies", id);
      await deleteDoc(movie);
    } catch (err) {
      console.log(err);
    }
  };
  const addMovie = async () => {
    try {
      if (!image) {
        alert("Upload an image");
        return;
      }
      console.log(image);
      const folderRef = ref(storage, `moviePosters/${newMovie.title}`);
      await uploadBytes(folderRef, image);

      await addDoc(moviesRef, {
        ...newMovie,
        userId: auth?.currentUser?.uid || undefined,
      });
      setNewMovie({
        title: "",
        releaseYear: "",
        oscarNominated: false,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const moviesRef = collection(db, "movies");
  useEffect(() => {
    const unsubscribe = onSnapshot(moviesRef, (querySnapshot) => {
      const updatedMovies = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovies(updatedMovies);
    });

    return unsubscribe;
  }, []);
  const edit = (id) => {
    if (auth?.currentUser?.uid) {
      setEditableMovies((prevEditableMovies) => ({
        ...prevEditableMovies,
        [id]: true,
      }));
    }
  };
  const handleInputChange = (e) => {
    setNewMovie((prevMovie) => ({
      ...prevMovie,
      [e.target.name]: e.target.value,
    }));
  };
  const handleUpdates = (e) => {
    setUpdatedMovie((prevMovie) => ({
      ...prevMovie,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="m-10">
      <Auth />
      <div className="md:w-5/6 mt-20 mx-auto">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
          >
            {editableMovies[movie.id] ? (
              <div className="flex flex-col">
                <input
                  className="border border-gray-300 rounded-md px-2 py-1 mb-2"
                  type="text"
                  name="title"
                  value={updatedMovie.title}
                  placeholder={movie.title}
                  onChange={handleUpdates}
                />
                <input
                  className="border border-gray-300 rounded-md px-2 py-1 mb-2"
                  type="number"
                  name="releaseYear"
                  value={updatedMovie.releaseYear}
                  placeholder={movie.releaseYear}
                  onChange={handleUpdates}
                />
                <label className="flex items-center mb-2">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="oscarNominated"
                    checked={updatedMovie.oscarNominated}
                    onChange={handleUpdates}
                  />
                  <span>Oscar Nominated</span>
                </label>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-gray-500">
                  Release Year: {movie.releaseYear}
                </p>
                <p
                  className={`text-lg font-bold ${
                    movie.oscarNominated ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {movie.oscarNominated
                    ? "Oscar Nominated"
                    : "Not Oscar Nominated"}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              {editableMovies[movie.id] ? (
                <button
                  className="bg-green-500 text-white rounded-lg px-4 py-2"
                  onClick={() => updateMovie(movie.id, movie)}
                >
                  Save
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    className="bg-blue-500 text-white rounded-lg px-7 py-2"
                    onClick={() => edit(movie.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-lg px-4 py-2"
                    onClick={() => deleteMovie(movie.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-8 sm:w-3/5">
          <h2 className="text-2xl font-bold mb-2">Add a New Movie</h2>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            name="title"
            value={newMovie.title}
            placeholder="Title"
            onChange={handleInputChange}
          />
          <input
            className="w-full my-4 p-2 border border-gray-300 rounded-md"
            type="number"
            name="releaseYear"
            value={newMovie.releaseYear}
            placeholder="Release Year"
            onChange={handleInputChange}
          />
          <input
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            id="image-input"
          />
          <label className="flex items-center">
            <input
              className="mr-2"
              type="checkbox"
              name="oscarNominated"
              checked={newMovie.oscarNominated}
              onChange={(e) =>
                setNewMovie((prev) => ({
                  ...prev,
                  oscarNominated: e.target.checked,
                }))
              }
            />
            <span>Oscar Nominated</span>
          </label>
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
            onClick={addMovie}
          >
            Add Movie
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;