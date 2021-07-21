import { useEffect, useState } from "react";

import api from "../../services/api";

import { Header } from "../../components/Header";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import { FoodsContainer } from "./styles";
import { IFood } from "../../types";

export function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>();
  const [modalIsOpen, setModaIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    const getFoods = async () => {
      const response = await api.get("/foods");
      setFoods(response.data);
    };
    getFoods();
  }, []);

  const handleAddFood = async (food: IFood) => {
    try {
      const response = await api.post<IFood>("/foods", {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: IFood) => {
    if (!editingFood) {
      return;
    }
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);
    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModaIsOpen(!modalIsOpen);
  };

  const toggleEditModal = () => {
    setEditModalIsOpen(!editModalIsOpen);
  };

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setEditModalIsOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalIsOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalIsOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
