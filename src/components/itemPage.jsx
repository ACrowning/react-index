import { useParams } from "react-router-dom";

export default function ItemPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>Item Page</h2>
      <p>You selected item: {id}</p>
    </div>
  );
}
