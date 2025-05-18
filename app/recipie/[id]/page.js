"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FoodDetail from "../../components/FoodDetail";

const RecipePage = () => {
  const params = useParams();
  const id = params?.id;
  const [foodID, setFoodID] = useState(null);

  useEffect(() => {
    if (id) setFoodID(id);
  }, [id]);

  return (
    <div >
      <FoodDetail foodID={foodID} />
    </div>
  );
};

export default RecipePage;
