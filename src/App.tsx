import { useForm, type SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import jsonData from "./jsonData.json";

import { jsonSchemaToJsx } from "./utils/jsonSchemaToJsx";

import { jsonDataToZodSchema } from "./utils/utils";

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormState>({
    resolver: zodResolver(jsonDataToZodSchema(jsonData as SchemaType)),
  });

  const onSubmit: SubmitHandler<FormState> = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {jsonSchemaToJsx(jsonData as SchemaType, register, errors)}
      <button>Submit</button>
    </form>
  );
}

export default App;
