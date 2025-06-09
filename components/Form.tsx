import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";

interface FormData {
  name: string;
  owner_name: string;
  species: string;
  age: number;
  poddy_trained: boolean;
  diet: string[];
  image_url: string;
  likes: string[];
  dislikes: string[];
}

interface Error {
  name?: string;
  owner_name?: string;
  species?: string;
  image_url?: string;
}

type Props = {
  formId: string;
  petForm: FormData;
  forNewPet?: boolean;
};

const Form = ({ formId, petForm, forNewPet = true }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: petForm.name,
    owner_name: petForm.owner_name,
    species: petForm.species,
    age: petForm.age,
    poddy_trained: petForm.poddy_trained,
    diet: petForm.diet,
    image_url: petForm.image_url,
    likes: petForm.likes,
    dislikes: petForm.dislikes,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: FormData) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      mutate(`/api/pets/${id}`, data, false); // Update the local data without a revalidation
      router.push("/");
    } catch (error) {
      setMessage("Failed to update pet");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: FormData) => {
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      router.push("/");
    } catch (error) {
      setMessage("Failed to add pet");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const value =
      target.name === "poddy_trained"
        ? (target as HTMLInputElement).checked
        : target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err: Error = {};
    if (!form.name) err.name = "Name is required";
    if (!form.owner_name) err.owner_name = "Owner is required";
    if (!form.species) err.species = "Species is required";
    if (!form.image_url) err.image_url = "Image URL is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();

    if (Object.keys(errs).length === 0) {
      forNewPet ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  return (
<div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
        {forNewPet ? "Add a Pet" : "Edit Pet"}
      </h2>

      <div>
        <label htmlFor="name" className="block font-medium">
          Name
        </label>
        <input
          type="text"
          maxLength={20}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="owner_name" className="block font-medium">
          Owner
        </label>
        <input
          type="text"
          maxLength={20}
          name="owner_name"
          value={form.owner_name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="species" className="block font-medium">
          Species
        </label>
        <input
          type="text"
          maxLength={30}
          name="species"
          value={form.species}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="age" className="block font-medium">
          Age
        </label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="poddy_trained"
          checked={form.poddy_trained}
          onChange={handleChange}
        />
        <label htmlFor="poddy_trained" className="font-medium">
          Potty Trained
        </label>
      </div>

      <div>
        <label htmlFor="diet" className="block font-medium">
          Diet
        </label>
        <textarea
          name="diet"
          maxLength={60}
          value={form.diet}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="image_url" className="block font-medium">
          Image URL
        </label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="likes" className="block font-medium">
          Likes
        </label>
        <textarea
          name="likes"
          maxLength={60}
          value={form.likes}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="dislikes" className="block font-medium">
          Dislikes
        </label>
        <textarea
          name="dislikes"
          maxLength={60}
          value={form.dislikes}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>

    {message && <p className="text-red-500">{message}</p>}

    <ul className="text-red-500 list-disc list-inside">
      {Object.keys(errors).map((err, index) => (
        <li key={index}>{err}</li>
      ))}
    </ul>
  </div>
  );
};
export default Form;
