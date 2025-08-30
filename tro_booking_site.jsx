import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Cấu hình dãy, phòng, giường
const rows = 7; // dãy A-G
const roomsPerRow = 12; // 12 phòng mỗi dãy
const bedsPerRoom = 8; // 8 giường mỗi phòng

export default function BoardingHouseMap() {
  const [selectedBed, setSelectedBed] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  // Sinh danh sách các dãy phòng
  const building = Array.from({ length: rows }, (_, rowIndex) => {
    const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C...
    return {
      id: rowLetter,
      rooms: Array.from({ length: roomsPerRow }, (_, roomIndex) => {
        const roomNum = (roomIndex + 1).toString().padStart(2, "0");
        return {
          id: `${rowLetter}${roomNum}`,
          beds: Array.from({ length: bedsPerRoom }, (_, bedIndex) => {
            return {
              id: `${rowLetter}${roomNum}-${bedIndex + 1}`,
              status: Math.random() > 0.7 ? "occupied" : "available", // demo random trạng thái
            };
          }),
        };
      }),
    };
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBed) return;

    // URL Google Apps Script web app (cần tạo trên Google Apps Script và publish "Anyone with link")
    const scriptURL = "https://script.google.com/macros/s/AKfycbxRlene9SmrC-uxjYkFupLaq_vmCQuG7B0yYbeCtS7f1bUxqE4SVpeyZPs7fu_rmhjZ9w/exec";

    const payload = {
      bed: selectedBed,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: new Date().toLocaleString()
    };

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("Đăng ký thành công! Thông tin đã được lưu vào Google Sheet.");
      setSelectedBed(null);
      setFormData({ name: "", phone: "", email: "" });
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Sơ Đồ Phòng Trọ</h1>
      <p className="text-gray-600 mb-4">
        Nhấp vào giường trống (màu xanh) để đăng ký.
      </p>

      <div className="space-y-8">
        {building.map((row) => (
          <div key={row.id}>
            <h2 className="text-xl font-semibold mb-2">Dãy {row.id}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {row.rooms.map((room) => (
                <Card key={room.id} className="shadow-md">
                  <CardContent className="p-2">
                    <h3 className="font-medium mb-2">Phòng {room.id}</h3>
                    <div className="grid grid-cols-4 gap-1">
                      {room.beds.map((bed) => (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          key={bed.id}
                          onClick={() =>
                            bed.status === "available" && setSelectedBed(bed.id)
                          }
                          className={`p-2 text-xs text-center rounded cursor-pointer transition-colors duration-200
                            ${bed.status === "available" ? "bg-green-300 hover:bg-green-400" : "bg-red-400 cursor-not-allowed"}`}
                        >
                          {bed.id.split("-")[1]}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedBed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4">Đăng ký giường</h2>
            <p className="mb-4">Bạn chọn giường: <b>{selectedBed}</b></p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Họ và tên" className="w-full border p-2 rounded" required />
              <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Số điện thoại" className="w-full border p-2 rounded" required />
              <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="w-full border p-2 rounded" />

              <Button type="submit" className="w-full">Gửi đăng ký</Button>
            </form>

            <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedBed(null)}>Đóng</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
