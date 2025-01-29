import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({ name: "", location: "" });

  useEffect(() => {
    // Charger la liste des hôtels depuis l'API
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => setHotels(data));
  }, []);

  const addHotel = () => {
    fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHotel),
    })
      .then((res) => res.json())
      .then((hotel) => setHotels([...hotels, hotel]));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Hôtels</h1>
      
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Nom de l'hôtel"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          />
          <Input
            placeholder="Localisation"
            value={newHotel.location}
            onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
          />
          <Button onClick={addHotel}>Ajouter un hôtel</Button>
        </CardContent>
      </Card>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Localisation</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell>{hotel.name}</TableCell>
              <TableCell>{hotel.location}</TableCell>
              <TableCell>
                <Button variant="outline">Modifier</Button>
                <Button variant="destructive">Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
