import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ClientForm = {
  name: string;
  email: string;
  company: string;
  projectDetails: string;
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ClientForm>({
    name: "",
    email: "",
    company: "",
    projectDetails: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: send to backend API
    console.log("Client Registration:", form);

    navigate("/success");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Client Registration</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="company" placeholder="Company" onChange={handleChange} />
        <textarea
          name="projectDetails"
          placeholder="Project Details"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}